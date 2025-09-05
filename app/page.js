"use client";
import { useState, useEffect } from "react";
import RepoTile from "@/components/repo/RepoTile";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 18;

  const totalPages = Math.max(1, Math.ceil(repos.length / perPage));
  const visible = repos.slice((page - 1) * perPage, page * perPage);

  // fallback demo repos (only used if API fails completely)
  const fallbackRepos = [
    {
      name: "vercel/next.js",
      description: "The React framework for the web.",
      stargazers_count: 125000,
      forks_count: 27000,
      language: "JavaScript",
      topics: ["react", "framework", "ssr"],
      license: { spdx_id: "MIT" },
      html_url: "https://github.com/vercel/next.js",
    },
    {
      name: "supabase/supabase",
      description: "The open source Firebase alternative.",
      stargazers_count: 70000,
      forks_count: 6000,
      language: "TypeScript",
      topics: ["database", "auth", "storage"],
      license: { spdx_id: "Apache-2.0" },
      html_url: "https://github.com/supabase/supabase",
    },
    {
      name: "Repo 3",
      description: "Minimal example.",
      stargazers_count: 1200,
      forks_count: 200,
      language: "Python",
      topics: ["ai", "ml"],
      html_url: "#",
    },
    {
      name: "Repo 4",
      description: "Another example.",
      stargazers_count: 950,
      forks_count: 80,
      language: "Go",
      topics: ["cli"],
      html_url: "#",
    },
  ];

  // random dev jokes/puns/quotes
  const devQuotes = [
    "Code is like humor. When you have to explain it, it’s bad.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "In a world without fences and walls, who needs Gates and k Windows?",
    "There are two hard things in computer science: cache invalidation and naming things.",
    "Programming isn’t about what you know; it’s about what you can figure out.",
  ];
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = devQuotes[Math.floor(Math.random() * devQuotes.length)];
    setQuote(random);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi">
      {/* HERO */}
      <section className="border-b border-[rgba(255,255,255,0.06)] py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="hero-heading"
        >
          Discover Open Source Gems
        </motion.h1>

        <p className="mt-4 text-muted max-w-2xl mx-auto">
          Search trending GitHub repositories and explore what’s hot in open
          source.
        </p>

        {/* SearchBar drives repos state */}
        <SearchBar onResults={setRepos} fallbackRepos={fallbackRepos} />

        {/* Dev Quote / Joke */}
        {quote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-2xl font-clash text-[var(--foreground)]"
          >
            {quote}
          </motion.p>
        )}
      </section>

      {/* Repo boxes */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {repos.length === 0 ? (
          <p className="text-center text-muted">No repositories to show.</p>
        ) : (
          <>
            <div className="repo-boxes">
              {visible.map((r, i) => (
                <RepoTile key={i} repo={r} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="button border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-muted text-sm">
                  Page <span className="text-[var(--foreground)]">{page}</span>{" "}
                  / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="button disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
