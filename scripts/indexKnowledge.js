// scripts/indexKnowledge.js — Full updated file with fixed HuggingFace URL

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const INDEX_NAME = "portfolio-knowledge";
const KNOWLEDGE_DIR = path.join(__dirname, "../knowledge");

// ─── HuggingFace embedding (fixed URL) ───────────────────────────────────────
async function getEmbedding(text) {
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

  // 503 = model is cold-starting on HF free tier, just wait and retry
  if (response.status === 503) {
    console.log("  Model is loading, waiting 20s...");
    await new Promise((res) => setTimeout(res, 20000));
    return getEmbedding(text);
  }

  if (!response.ok) {
    throw new Error(`HuggingFace error: ${await response.text()}`);
  }

  const result = await response.json();

  // all-MiniLM-L6-v2 returns shape [1, tokens, 384]
  // We need a single 384-dim vector, so mean-pool across token dimension
  if (Array.isArray(result[0]) && Array.isArray(result[0][0])) {
    const tokenVecs = result[0]; // shape: [tokens, 384]
    const dim = tokenVecs[0].length;
    const mean = new Array(dim).fill(0);
    for (const vec of tokenVecs) {
      for (let i = 0; i < dim; i++) mean[i] += vec[i];
    }
    return mean.map((v) => v / tokenVecs.length);
  }

  return Array.isArray(result[0]) ? result[0] : result;
}

// ─── Load markdown files ──────────────────────────────────────────────────────
function loadMarkdownFiles() {
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => ({
    filename: file,
    content: fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8"),
  }));
}

// ─── Split into ~400-word chunks ─────────────────────────────────────────────
function chunkText(text, filename) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 30);
  const chunks = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    if (currentChunk && (currentChunk + para).split(" ").length > 400) {
      chunks.push({ id: `${filename}-${chunkIndex}`, text: currentChunk.trim(), source: filename });
      chunkIndex++;
      currentChunk = para + "\n\n";
    } else {
      currentChunk += para + "\n\n";
    }
  }
  if (currentChunk.trim()) {
    chunks.push({ id: `${filename}-${chunkIndex}`, text: currentChunk.trim(), source: filename });
  }
  return chunks;
}

// ─── Create Pinecone index (dimension 384 for MiniLM) ────────────────────────
async function ensureIndex() {
  const existing = await pinecone.listIndexes();
  const exists = existing.indexes?.some((idx) => idx.name === INDEX_NAME);

  if (!exists) {
    console.log(`Creating Pinecone index: ${INDEX_NAME}...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 384,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    await new Promise((res) => setTimeout(res, 10000));
    console.log("Index created.\n");
  } else {
    console.log("Index already exists.\n");
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Starting indexing...\n");

  const files = loadMarkdownFiles();
  console.log(`Found ${files.length} files.`);

  const allChunks = files.flatMap(({ content, filename }) => chunkText(content, filename));
  console.log(`Created ${allChunks.length} chunks.\n`);

  await ensureIndex();
  const index = pinecone.index(INDEX_NAME);

  const vectors = [];
  for (const chunk of allChunks) {
    console.log(`Embedding: ${chunk.id}`);
    const embedding = await getEmbedding(chunk.text);
    await new Promise((res) => setTimeout(res, 500)); // rate limit buffer
    vectors.push({
      id: chunk.id,
      values: embedding,
      metadata: { text: chunk.text, source: chunk.source },
    });
  }

  for (let i = 0; i < vectors.length; i += 100) {
    await index.upsert(vectors.slice(i, i + 100));
  }

  console.log(`\n✅ Done! ${vectors.length} vectors stored in Pinecone.`);
}

main().catch(console.error);