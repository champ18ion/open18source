"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function SearchBar({ onResults, fallbackRepos }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // filters
  const [language, setLanguage] = useState("any");
  const [stars, setStars] = useState(0);
  const [difficulty, setDifficulty] = useState("");

  // applied filters (only when user clicks Apply)
  const [appliedFilters, setAppliedFilters] = useState({
    language: "any",
    stars: 0,
    difficulty: "",
  });

  // debounce text search
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  // unified search
  useEffect(() => {
    async function runSearch() {
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery);

      // use applied filters, not live ones
      if (appliedFilters.language !== "any")
        params.set("lang", appliedFilters.language);
      if (appliedFilters.stars > 0)
        params.set("stars", `${appliedFilters.stars}+`);
      if (appliedFilters.difficulty)
        params.set("difficulty", appliedFilters.difficulty);

      const endpoint = params.toString()
        ? `/api/search?${params.toString()}`
        : `/api/trending`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (Array.isArray(data)) onResults(data);
        else onResults(data.items || []);
      } catch (err) {
        console.error("Search failed → using fallback", err);
        onResults(fallbackRepos);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [debouncedQuery, appliedFilters]);

  return (
    <div className="max-w-2xl mx-auto mt-8 relative space-y-4">
      {/* search input + filter toggle */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search repositories..."
          className="input-flat w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)]"
        >
          <SlidersHorizontal className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* filters row */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          {/* language */}
          <div className="flex items-center gap-2">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-b border-[rgba(255,255,255,0.1)] focus:outline-none"
            >
              <option value="any">Any</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          {/* stars */}
          <div className="flex items-center gap-2 flex-1">
            <label className="whitespace-nowrap">Stars ≥</label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className="flex-1 accent-[var(--foreground)]"
            />
            <span>{stars}+</span>
          </div>

          {/* difficulty */}
          <div className="flex items-center gap-2">
            <label>Difficulty</label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setDifficulty(
                    difficulty === "good-first-issue" ? "" : "good-first-issue"
                  )
                }
                className={`px-3 py-1 rounded-lg border text-xs ${
                  difficulty === "good-first-issue"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[rgba(255,255,255,0.1)]"
                }`}
              >
                Good First Issue
              </button>
              <button
                onClick={() =>
                  setDifficulty(
                    difficulty === "help-wanted" ? "" : "help-wanted"
                  )
                }
                className={`px-3 py-1 rounded-lg border text-xs ${
                  difficulty === "help-wanted"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[rgba(255,255,255,0.1)]"
                }`}
              >
                Help Wanted
              </button>
            </div>
          </div>

          {/* apply button */}
          <button
            onClick={() =>
              setAppliedFilters({ language, stars, difficulty })
            }
            className="ml-auto px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-xs"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* loading state */}
      {loading && (
        <div className="absolute right-16 top-2 text-muted text-sm">
          Searching...
        </div>
      )}
    </div>
  );
}
