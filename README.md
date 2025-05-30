# 📝 AI-Powered Personal Blog Starter

A zero-code, open-source template for building a **personal AI blog** that runs entirely on the free tiers of **Vercel**, **Supabase**, **Groq**, and **OpenRouter**.  
Use it to showcase your profile, projects, and daily AI-generated content—without managing servers or writing backend code.

<div align="center">
  <!-- optional shields.io or vercel / supabase badge links -->
  <!-- ![Deploy to Vercel](https://vercel.com/button) -->
</div>

---

## ✨ Key Features

| Area | What it Does |
|------|--------------|
| **Home** | Personal intro & project portfolio section |
| **Daily NZ News** | Scrapes today’s local headlines ➜ feeds OpenAI* ➜ outputs concise AI summary |
| **Blog / Knowledge Base (CMS)** | Write, edit, and categorise posts or “prompt snippets” directly in the UI |
| **Prompt Manager** | Save & version your best prompts; prompts are plain-text files—edit in code or UI |
| **AI Chatbot** | Toggle system prompts, expand/collapse context, answer visitor questions live |
| **AI Tool Navigator** | Curated list of useful AI tools with search & tags |
| **100 % Serverless** | Runs on Vercel functions + Supabase DB/auth/storage free plan |

\* Model calls are routed via **Groq** (Mixtral-8x7B, Llama-3, etc.) or **OpenRouter** depending on your config—both have generous free tiers.

---

## 🏗️ Built With

| Tool / Service | Role |
|----------------|------|
| **Cursor + v0.dev** | AI-assisted IDE & component generator—most UI built in minutes |
| **Next.js 14** | React framework, App Router |
| **Vercel** (Free) | Hosting, Edge Functions, Preview URLs |
| **Supabase** (Free) | Postgres DB, Auth, Storage |
| **Groq API** (Free tier) | Ultra-fast inference for Mixtral & Llama models |
| **OpenRouter API** (Free tier) | Unified gateway to OpenAI / Anthropic / open-source models |
| **Tailwind CSS** + shadcn/ui | Styling & accessible components |

---

## 🛠️ Tech Stack Highlights

* **All AI prompts live in `/prompts/`** – just open the file in Cursor, tweak, save, redeploy.
* **Switch models with one line** – environment variable `AI_PROVIDER=groq | openrouter`.
* **No vendor lock-in** – swap Supabase for PlanetScale, Groq for OpenAI, etc.
* **Zero-cost by default** – stays free under typical personal-site traffic.

---

## 🚀 Quick Start (≤10 mins)

1. **Fork & Clone**

   ```bash
   git clone https://github.com/your-handle/ai-blog-starter.git
   cd ai-blog-starter

	2.	Create a Supabase Project (free tier)
– copy SUPABASE_URL, SUPABASE_ANON_KEY.
	3.	Add Env Vars on Vercel (or .env.local)

Key	Example
SUPABASE_URL	https://xyz.supabase.co
SUPABASE_ANON_KEY	eyJhbGci...
OPENAI_API_KEY	optional if using OpenRouter
OPENROUTER_API_KEY	or-...
GROQ_API_KEY	gsk_...
AI_PROVIDER	groq


	4.	One-Click Deploy


⸻

🤝 Contributing

Pull requests welcome! Fork → branch → PR.

⸻

📝 License

MIT

**Notes**

* Replace `your-handle` and add screenshots/badges as you like.  
* If you prefer to keep your older README layout, lift only the *Built With* and *Tech Stack* sections into it.
