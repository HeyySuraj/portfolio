import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

export async function POST(req) {
    const { question } = await req.json();

    const context = `
You are Suraj Bhanarkar's AI portfolio assistant.

Suraj Bhanarkar:
Full Stack Software Engineer with 3+ years experience at Leadows Technologies.

Key Skills:
Frontend: React, Redux, Context API, Material UI, Vite
Backend: Node.js, TypeScript, Express, Java, Spring Boot
Databases: MongoDB, PostgreSQL
Systems: Redis caching, ActiveMQ event-driven systems

Specializations:
- Payment gateway integrations
- Scalable backend systems
- Microservices architecture
- AI Agents and MCP servers

Data Skills:
SQL analysis, Python data processing, Power BI dashboards.

Answer questions about Suraj professionally.
`;

    const chat = await groq.chat.completions.create({
        messages: [
            { role: "system", content: context },
            { role: "user", content: question }
        ],
        model: "groq/compound"
    });

    return Response.json({
        answer: chat.choices[0].message.content
    });
}