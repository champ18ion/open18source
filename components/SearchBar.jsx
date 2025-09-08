"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function SearchBar({ onResults, fallbackRepos }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);


  // Filters state (live as user interacts)
  const [language, setLanguage] = useState("any");
  const [stars, setStars] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("match"); // Default to your best feature

  // Applied filters state (triggers search only when "Apply" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    language: "any",
    stars: 0,
    difficulty: "",
    sort: "match",
  });

  // Debounce text input to avoid API calls on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Main effect to run the search when filters or query change
  useEffect(() => {
    async function runSearch() {
       const hasActiveQuery = debouncedQuery.trim() !== "";
      const hasActiveFilters = appliedFilters.language !== "any" || appliedFilters.stars > 0 || appliedFilters.difficulty !== "";

      // --- THIS IS THE KEY LOGIC ---
      // If the user has cleared the search and filters, revert to the fallback/initial list.
      if (!hasActiveQuery && !hasActiveFilters) {
        onResults(fallbackRepos);
        return; // Stop execution here
      }
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery);

      // Use the correct API parameter names based on your backend route
      if (appliedFilters.language !== "any") params.set("language", appliedFilters.language);
      if (appliedFilters.stars > 0) params.set("starsMin", `${appliedFilters.stars}`);
      if (appliedFilters.difficulty) params.set("goodFirstIssue", "true");

      // Send sort param to API only if it's a valid GitHub sort option
      if (appliedFilters.sort !== 'match') {
        params.set("sort", appliedFilters.sort);
      }

      // If no params are set, use the trending endpoint; otherwise, use search
       const endpoint = `/api/search?${params.toString()}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        
        // Normalize results from either endpoint shape
        let results = Array.isArray(data) ? data : data.items || [];

        // Perform client-side sorting if "Best Match" is selected
        if (appliedFilters.sort === 'match' && Array.isArray(results)) {
          // Sort by match_score descending, handling cases where score might be missing
          results.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
        }

        onResults(results);
      } catch (err) {
        console.error("Search failed → using fallback", err);
        onResults(fallbackRepos);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
    // This dependency array is now correct AND safe because its props are stable
  }, [debouncedQuery, appliedFilters, onResults, fallbackRepos]);

  

  return (
    <div className="max-w-2xl mx-auto mt-8 relative space-y-4">
      {/* Search input and filter toggle button */}
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
          aria-label="Toggle search filters"
        >
          <SlidersHorizontal className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Collapsible filters panel */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted">
          {/* Language Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="language-select">Language</label>
            <select
              id="language-select"
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

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-b border-[rgba(255,255,255,0.1)] focus:outline-none"
            >
              <option value="match">Best Match</option>
              <option value="stars">Stars</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Stars Range Slider */}
          <div className="flex items-center gap-2 flex-grow min-w-[150px]">
            <label htmlFor="stars-range" className="whitespace-nowrap">Stars ≥</label>
            <input
              id="stars-range"
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className="w-full accent-[var(--foreground)]"
            />
            <span>{stars / 1000}k+</span>
          </div>

          {/* Difficulty Buttons */}
          <div className="flex items-center gap-2">
            <label>Difficulty</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDifficulty(d => d === "good-first-issue" ? "" : "good-first-issue")}
                className={`px-3 py-1 rounded-lg border text-xs ${difficulty === "good-first-issue" ? "bg-[var(--foreground)] text-[var(--background)]" : "border-[rgba(255,255,255,0.1)]"}`}
              >
                Good First Issue
              </button>
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={() => setAppliedFilters({ language, stars, difficulty, sort })}
            className="ml-auto px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-xs"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Loading State Indicator */}
      {loading && (
        <div className="absolute right-16 top-2 text-muted text-sm">
          Searching...
        </div>
      )}
    </div>
  );
}