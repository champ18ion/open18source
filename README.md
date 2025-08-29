
---

# 🌐 Open18source

> Find the perfect open-source project to contribute to — fast, intuitive, and AI-powered.

---

## ✨ Vision

We’re building the best platform for developers to **discover open-source projects** that match their skills and interests — moving beyond keyword searches to **AI-powered discovery**.

---

## 🚀 Features

### Phase 1 (MVP)

* 🔍 Search by **language** + **good first issue** filter
* ⚡ Results directly from GitHub API

### Phase 2 (Enhanced)

* 🗄 Supabase database for caching repos
* 🤖 Background worker keeps data fresh
* 🔑 Extra filters: topics, activity, star count

### Phase 3 (AI-Powered Search)

* 🧠 Natural language queries
* 📚 Semantic search with pgvector embeddings
* ❤️ Save searches + bookmark repos

---

## 🛠 Tech Stack

* **Frontend** → [Next.js](https://nextjs.org/) (deployed on Vercel)
* **Backend** → [Express.js](https://expressjs.com/) (Node.js, deployed on Render/Railway)
* **Database** → [Supabase](https://supabase.com/) (Postgres + pgvector)
* **Worker** → Node.js background job for GitHub sync
* **AI Search** → pgvector (Supabase) or Pinecone/Weaviate

---

## 🏗 Architecture

```
User → Next.js (Vercel) → Express API (Render/Railway) → Supabase (Postgres)
                                          ↑
                                  Background Worker
                                        (GitHub API)
```

---

## 📊 Database Schema (Simplified)

**repositories**

* `id` → Internal ID
* `github_id` → Unique GitHub ID
* `name`, `full_name`, `description`
* `language`, `topics[]`
* `stargazers_count`, `pushed_at`
* `readme_content`
* `created_at`, `updated_at`, `last_synced`
* (Phase 3) → Embeddings stored via **pgvector**

---

## 🗓 Roadmap

* **Phase 1** → MVP (language + good first issue search)
* **Phase 2** → Supabase + background sync + advanced filters
* **Phase 3** → AI-powered semantic search + user accounts

---

## 🧑‍💻 Contributing

We welcome contributions!

* Open an issue if you’d like to suggest a feature.
* Submit a PR if you’ve built something cool.
* Roadmap is flexible — feedback is appreciated.

---

## ⚡ Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/open-source-discovery.git
   cd open-source-discovery
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run locally:

   * Frontend: `npm run dev` (Next.js)
   * Backend: `npm run server` (Express)

4. Set up environment variables:

   * GitHub API Token
   * Supabase URL + Key

---

## 📌 Status

Currently in **Phase 1** — setting up the monorepo and deployment pipeline.

---

Would you like me to also **add a "Contributors Guide" section** (folder structure, commit rules, PR process) so open-source contributors know how to get started smoothly?
