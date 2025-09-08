"use client";
import { useState, useEffect } from "react";
import RepoTile from "@/components/repo/RepoTile";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

const fallbackRepos = [
    {
        "id": 19416347,
        "full_name": "kelseyhightower/nocode",
        "name": "nocode",
        "html_url": "https://github.com/kelseyhightower/nocode",
        "description": "The best way to write secure and reliable applications. Write nothing; deploy nowhere.",
        "language": null,
        "topics": [
            "funny",
            "parody",
            "satire",
            "best-practices"
        ],
        "stargazers_count": 60100,
        "forks_count": 9400,
        "open_issues_count": 1,
        "pushed_at": "2024-08-15T18:24:49Z",
        "owner": {
            "login": "kelseyhightower",
            "avatar_url": "https://avatars.githubusercontent.com/u/112190?v=4",
            "html_url": "https://github.com/kelseyhightower"
        },
        "match_score": 10
    },
    {
        "id": 1457482,
        "full_name": "holman/dotfiles",
        "name": "dotfiles",
        "html_url": "https://github.com/holman/dotfiles",
        "description": "Your dotfiles are how you personalize your system. Here’s how I personalize mine.",
        "language": "Shell",
        "topics": [
            "dotfiles",
            "unix",
            "configuration",
            "shell",
            "homebrew"
        ],
        "stargazers_count": 7100,
        "forks_count": 988,
        "open_issues_count": 4,
        "pushed_at": "2025-07-22T09:13:16Z",
        "owner": {
            "login": "holman",
            "avatar_url": "https://avatars.githubusercontent.com/u/2720?v=4",
            "html_url": "https://github.com/holman"
        },
        "match_score": 9.2
    },
    {
        "id": 1359753,
        "full_name": "hakimel/reveal.js",
        "name": "reveal.js",
        "html_url": "https://github.com/hakimel/reveal.js",
        "description": "The HTML Presentation Framework",
        "language": "JavaScript",
        "topics": [
            "presentation",
            "slides",
            "html",
            "javascript",
            "framework"
        ],
        "stargazers_count": 67300,
        "forks_count": 16900,
        "open_issues_count": 751,
        "pushed_at": "2025-09-02T14:30:11Z",
        "owner": {
            "login": "hakimel",
            "avatar_url": "https://avatars.githubusercontent.com/u/629429?v=4",
            "html_url": "https://github.com/hakimel"
        },
        "match_score": 2.1
    },
    {
        "id": 24320279,
        "full_name": "excalidraw/excalidraw",
        "name": "excalidraw",
        "html_url": "https://github.com/excalidraw/excalidraw",
        "description": "Virtual whiteboard for sketching hand-drawn like diagrams.",
        "language": "TypeScript",
        "topics": [
            "diagram",
            "whiteboard",
            "react",
            "collaboration",
            "sketching"
        ],
        "stargazers_count": 75600,
        "forks_count": 7000,
        "open_issues_count": 1345,
        "pushed_at": "2025-09-09T03:55:01Z",
        "owner": {
            "login": "excalidraw",
            "avatar_url": "https://avatars.githubusercontent.com/u/53811699?v=4",
            "html_url": "https://github.com/excalidraw"
        },
        "match_score": 1.5
    },
    {
        "id": 9919565,
        "full_name": "dthree/cash",
        "name": "cash",
        "html_url": "https://github.com/dthree/cash",
        "description": "A cross-platform implementation of Unix shell commands written in pure ES6.",
        "language": "JavaScript",
        "topics": [
            "shell",
            "unix",
            "command-line",
            "nodejs",
            "cross-platform"
        ],
        "stargazers_count": 8100,
        "forks_count": 526,
        "open_issues_count": 84,
        "pushed_at": "2023-11-14T21:05:47Z",
        "owner": {
            "login": "dthree",
            "avatar_url": "https://avatars.githubusercontent.com/u/1031959?v=4",
            "html_url": "https://github.com/dthree"
        },
        "match_score": 0
    },
    {
        "id": 593854,
        "full_name": "impress/impress.js",
        "name": "impress.js",
        "html_url": "https://github.com/impress/impress.js",
        "description": "It's a presentation framework based on the power of CSS3 transforms and transitions in modern browsers and inspired by the idea behind prezi.com.",
        "language": "JavaScript",
        "topics": [
            "presentation",
            "css3",
            "javascript",
            "slideshow",
            "framework"
        ],
        "stargazers_count": 37900,
        "forks_count": 6800,
        "open_issues_count": 311,
        "pushed_at": "2025-08-28T19:40:22Z",
        "owner": {
            "login": "impress",
            "avatar_url": "https://avatars.githubusercontent.com/u/1225570?v=4",
            "html_url": "https://github.com/impress"
        },
        "match_score": 6.8
    }
]

  // random dev jokes/puns/quotes
  const devQuotes = [
    "Code is like humor. When you have to explain it, it’s bad.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "In a world without fences and walls, who needs Gates and k Windows?",
    "There are two hard things in computer science: cache invalidation and naming things.",
    "Programming isn’t about what you know; it’s about what you can figure out.",
  ];

export default function HomePage() {
  const [repos, setRepos] = useState(fallbackRepos);
  const [page, setPage] = useState(1);
  const perPage = 18;

  const totalPages = Math.max(1, Math.ceil(repos.length / perPage));
  const visible = repos.slice((page - 1) * perPage, page * perPage);

  // fallback demo repos (only used if API fails completely)

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
