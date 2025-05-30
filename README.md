# 📝 CheapBlog – AI-Powered Personal Blog Starter

**CheapBlog** is a zero-code, open-source template for spinning up a fully-featured **AI personal blog** on the *free tiers* of **Vercel**, **Supabase**, **Groq**, and **OpenRouter**.  
Showcase your profile, projects, and daily AI-generated content—without running servers or writing backend code.

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/qianlove880530/CheapBlog">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

---

## ✨ Core Features

| Area | What it Does |
|------|--------------|
| **Home** | Personal introduction & project portfolio |
| **Daily NZ News** | Fetches today’s local headlines ➜ sends to LLM ➜ outputs concise AI summary |
| **Blog / Knowledge Base** | Create, edit, and categorise posts or prompt snippets (built-in CMS) |
| **Prompt Manager** | Store & version your best prompts (editable as plain files or via UI) |
| **AI Chatbot** | Toggle system prompts, show/hide context, answer visitor questions live |
| **AI Tool Navigator** | Curated list of useful AI tools with search & tags |
| **100 % Serverless** | Runs on Vercel functions + Supabase DB / Auth / Storage |

LLM calls are routed through **Groq** (Mixtral-8x7B, Llama-3, …) or **OpenRouter**—both have generous free tiers.

---

## 🏗️ Built With

| Tool / Service | Role |
|----------------|------|
| **Cursor + v0.dev** | AI-assisted IDE & component scaffolding |
| **Next.js 14** | React framework, App Router |
| **Vercel** (Free) | Hosting, Edge Functions, Preview URLs |
| **Supabase** (Free) | Postgres, Auth, Storage |
| **Groq API** (Free) | Blazing-fast Mixtral / Llama inference |
| **OpenRouter API** (Free) | Unified gateway to many LLMs |
| **Tailwind CSS** + **shadcn/ui** | Styling & accessible components |

---

## 🚀 Quick Start — <10 min

### 1. Fork & Clone

```bash
git clone https://github.com/qianlove880530/CheapBlog.git
cd CheapBlog

2. Create a Supabase Project (Free)
	1.	Go to https://supabase.com → New project.
	2.	Copy Project URL + Anon Key under Settings → API.
	3.	Run /supabase/schema.sql in the SQL editor.

3. Add Environment Variables

Key	Description
SUPABASE_URL	Your project URL
SUPABASE_ANON_KEY	Public anon key
OPENAI_API_KEY	Optional if using OpenRouter
OPENROUTER_API_KEY	or-xxxxxxxx
GROQ_API_KEY	gsk_xxxxxxxx
AI_PROVIDER	groq or openrouter
NEXT_PUBLIC_SITE_NAME	Blog title (shown in header & OG tags)

Add them in Vercel → Project → Settings → Environment Vars or .env.local.

4. One-Click Deploy



⸻

🛠️ Tech Highlights
	•	All prompts live in /prompts/ – edit in Cursor, save, redeploy.
	•	Switch models instantly – set AI_PROVIDER to groq or openrouter.
	•	Zero-cost by default – remains free under normal personal-site traffic.
	•	No vendor lock-in – swap Supabase for PlanetScale, Groq for OpenAI, etc.

⸻

📅 Roadmap
	•	✅ MVP (chat, CMS, news summary)
	•	🔜 RSS/Atom feed export
	•	🔜 Theming / dark-mode
	•	🔜 Edge caching for faster global reads

⸻

🤝 Contributing
	1.	Fork → git checkout -b feat/amazing-thing
	2.	Commit & push → git push origin feat/amazing-thing
	3.	Open a PR – template included!

⸻

❤️ Why CheapBlog?

To prove you can launch a robust, AI-powered personal site with zero server cost and virtually zero code.
Fork it, brand it, and make it yours—then share what you build!

Just commit this file as `README.md` in the root of **CheapBlog**, push, and your repo landing page will be investor- / contributor-ready. Happy shipping!
