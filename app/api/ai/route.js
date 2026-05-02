// app/api/ai/route.js

import Groq from "groq-sdk";
import { Pinecone } from "@pinecone-database/pinecone";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const INDEX_NAME = "portfolio-knowledge";
const TOP_K = 4;

// ─── HuggingFace embedding (fixed URL) ───────────────────────────────────────
async function embedQuestion(text) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (response.status === 503) {
    await new Promise((res) => setTimeout(res, 20000));
    return embedQuestion(text);
  }

  if (!response.ok) {
    throw new Error(`HuggingFace error: ${await response.text()}`);
  }

  const result = await response.json();

  if (Array.isArray(result[0]) && Array.isArray(result[0][0])) {
    const tokenVecs = result[0];
    const dim = tokenVecs[0].length;
    const mean = new Array(dim).fill(0);
    for (const vec of tokenVecs) {
      for (let i = 0; i < dim; i++) mean[i] += vec[i];
    }
    return mean.map((v) => v / tokenVecs.length);
  }

  return Array.isArray(result[0]) ? result[0] : result;
}

// ─── Search Pinecone ──────────────────────────────────────────────────────────
async function retrieveContext(questionEmbedding) {
  const index = pinecone.index(INDEX_NAME);
  const results = await index.query({
    vector: questionEmbedding,
    topK: TOP_K,
    includeMetadata: true,
  });

  const relevant = results.matches.filter((m) => m.score > 0.3);
  if (relevant.length === 0) return null;

  return relevant
    .map((m) => `[From: ${m.metadata.source}]\n${m.metadata.text}`)
    .join("\n\n---\n\n");
}

// ─── Build prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(context) {
  const base = `You are a friendly assistant for [Your Name]'s portfolio website.
Help recruiters learn about [Your Name]'s skills, projects, and experience.
Keep answers concise (2-4 sentences). Never make up information.
If info isn't in the context, say "I don't have that detail — contact [your@email.com] directly."`;

  if (!context) return base + "\n\nNo context found. Suggest contacting directly.";

  return `${base}\n\n---\nCONTEXT:\n${context}\n---\nAnswer only from the above context.`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question?.trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const cleanQuestion = question.trim().slice(0, 500);
    const questionEmbedding = await embedQuestion(cleanQuestion);
    const context = await retrieveContext(questionEmbedding);
    const systemPrompt = buildSystemPrompt(context);

    const chat = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: cleanQuestion },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 300,
      temperature: 0.5,
    });

    return Response.json({ answer: chat.choices[0].message.content });
  } catch (error) {
    console.error("RAG error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}