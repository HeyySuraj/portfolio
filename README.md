# 🌐 Suraj Bhanarkar — Full Stack Developer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)]()
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=radixui&logoColor=white)]()
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)]()

🚀 **Live Portfolio:** https://surajbhanarkar.vercel.app/  
👨‍💻 **Author:** Suraj Bhanarkar  
💼 **Role:** Full Stack Software Engineer  
📍 **Tech Focus:** MERN · Next.js · Scalable Web Apps  

---

## 📖 About This Project

This repository contains the source code for my **personal portfolio website**, built to present my **professional experience, technical expertise, and real-world projects** as a Full Stack Developer.

The portfolio is designed with **recruiters and hiring managers in mind**, focusing on:

- Clean & modern UI
- SEO-friendly architecture
- High performance & fast load times
- Clear presentation of skills and experience

---

## 🖼️ Screenshots

### 🏠 Home Page
<!-- <img width="1615" height="820" alt="image" src="https://github.com/user-attachments/assets/209a84f5-a5c1-40ac-9bde-5c71c7282c8d" /> -->

![Home Page](https://github.com/user-attachments/assets/209a84f5-a5c1-40ac-9bde-5c71c7282c8d)

### 💼 Projects Section
![Projects Section](https://github.com/user-attachments/assets/31fc5b4f-e7fe-418e-94ca-226a765e4877)

<!-- <img width="1706" height="822" alt="image" src="https://github.com/user-attachments/assets/31fc5b4f-e7fe-418e-94ca-226a765e4877" /> -->


### 🧠 Experience & Skills
![Experience & Skills](https://github.com/user-attachments/assets/dcd55eb9-8c0a-4f38-b1db-2786bef7a55f)

<!-- <img width="1690" height="781" alt="image" src="https://github.com/user-attachments/assets/dcd55eb9-8c0a-4f38-b1db-2786bef7a55f" /> -->


### 📬 Contact Section
![Contact Section](https://github.com/user-attachments/assets/58137663-a88b-45f1-b58c-348aea924baf)

<!-- <img width="1889" height="893" alt="image" src="https://github.com/user-attachments/assets/58137663-a88b-45f1-b58c-348aea924baf" /> -->


> Screenshots are taken from the **live deployed application**.

---

## ✨ Key Features

- ⚡ **SEO Optimized** (Next.js App Router + Metadata API)
- 🧩 **Server Components for Performance**
- 📱 **Fully Responsive Design**
- 🌗 **Dark / Light Mode Toggle**
- 🧠 **Clean, Scalable Architecture**
- 🔗 **Smooth Navigation & Internal Linking**
- 📬 **Working Contact Form Integration**
- 🚀 **Optimized Core Web Vitals**

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### Backend & Integrations
- **Node.js**
- **REST APIs**
- **EmailJS (Contact Form)**

### Tooling & Deployment
- **Git & GitHub**
- **Vercel**
- **Google Search Console**
- **Lighthouse Audits**

---

## 📂 Project Structure

```bash
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projects/
│   ├── experience/
│   ├── contact/
│   └── blog/
├── components/
├── public/
│   ├── images/
│   └── screenshots/
├── styles/
├── .env.example
└── README.md



# RAG System for Portfolio Chatbot

A drop-in upgrade for your `api/ai/route.js` that adds semantic search over your personal knowledge base.

---

## How it works (simple version)

```
User asks: "What tech stack do you use?"
      ↓
Convert question to numbers (embedding)
      ↓
Search your knowledge base for the most relevant paragraphs
      ↓
Send those paragraphs + question to Groq
      ↓
Groq answers based only on YOUR actual info
```

---

## Setup (one-time, ~15 minutes)

### Step 1 — Install new packages

```bash
npm install @pinecone-database/pinecone openai
```

### Step 2 — Get your API keys

| Service | Where to get it | Cost |
|---|---|---|
| Groq | console.groq.com/keys | Free |
| OpenAI | platform.openai.com/api-keys | ~$0 (embeddings are nearly free) |
| Pinecone | app.pinecone.io | Free tier (plenty for a portfolio) |

### Step 3 — Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```
GROQ_API_KEY=your_actual_groq_key
OPENAI_API_KEY=your_actual_openai_key  
PINECONE_API_KEY=your_actual_pinecone_key
```

⚠️ **Important**: Your current code uses `NEXT_PUBLIC_GROQ_API_KEY`. 
Remove the `NEXT_PUBLIC_` prefix — API keys must NEVER be exposed to the browser!

### Step 4 — Fill in your knowledge base

Edit the markdown files in `/knowledge/` with your real information:
- `about.md` — who you are, work style, background
- `skills.md` — your tech stack and tools
- `projects.md` — projects you've built
- `experience.md` — work history and education
- `contact.md` — how to reach you, availability

Be specific and detailed — the more info you put in, the better the chatbot answers.

### Step 5 — Index your knowledge base (run ONCE)

```bash
node scripts/indexKnowledge.js
```

You'll see output like:
```
Found 5 knowledge files.
Created 18 chunks total.
Embedding: about.md-0
Embedding: about.md-1
...
✅ Indexing complete! Total vectors stored: 18
```

### Step 6 — Replace your route.js

Copy `app/api/ai/route.js` from this folder into your Next.js project at the same path.

That's it! Your chatbot now uses RAG.

---

## When to re-index

Run `node scripts/indexKnowledge.js` again whenever you:
- Update any file in `/knowledge/`
- Add a new project
- Change your availability or contact info
- Add new skills or experience

---

## File structure

```
your-nextjs-app/
├── app/
│   └── api/
│       └── ai/
│           └── route.js          ← Replace with the new one
├── knowledge/                    ← NEW: Your personal info goes here
│   ├── about.md
│   ├── skills.md
│   ├── projects.md
│   ├── experience.md
│   └── contact.md
├── scripts/                      ← NEW: Run once to build the index
│   └── indexKnowledge.js
└── .env.local                    ← Add your API keys here
```

---

## Customization

### Change the chatbot personality
Edit `buildSystemPrompt()` in `route.js`. Replace `[Your Name]` and `[your email]` with your actual name and email.

### Add more knowledge files
Just create a new `.md` file in `/knowledge/` and re-run the index script. No code changes needed.

### Adjust how many results are retrieved
Change `TOP_K = 4` in `route.js`. Higher = more context but more tokens used.

### Change the Groq model
The current model is `llama-3.1-8b-instant` (fastest). You can switch to:
- `llama-3.3-70b-versatile` — smarter, slightly slower
- `mixtral-8x7b-32768` — good balance

---

## Troubleshooting

**"No vectors found" / chatbot says it has no info**
→ Make sure you ran `node scripts/indexKnowledge.js` and it completed successfully.

**Pinecone connection error**
→ Check your `PINECONE_API_KEY` in `.env.local`. Make sure there are no extra spaces.

**OpenAI error**
→ Check your `OPENAI_API_KEY`. Make sure you have billing set up on your OpenAI account (even $5 credit is enough).

**API key exposed warning**
→ Make sure you're NOT using `NEXT_PUBLIC_` prefix on any API key. Those are sent to the browser.
