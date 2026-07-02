# 🚀 Proposed Improvements: SEO & Discovery (Phase 1.5)

This document outlines the planned improvements to increase traffic, discovery, and overall user experience for Open18source, prioritizing features that can be implemented *without* needing the Phase 2 database (Supabase) right away.

---

## 1. 📈 Dynamic Trending System (Timeframes)

**The Problem:** Currently, when a user lands on the homepage without a search query, they see a static list of `fallbackRepos`. The `/api/trending` endpoint exists but isn't integrated into the main feed dynamically.

**The Solution:**
Replace the fallback list with a dynamic trending feed powered directly by the GitHub API.

**Implementation Details:**
- **UI Update:** Add a toggle group on the homepage: `[ Today | This Week | This Month ]`.
- **API Logic (`/api/trending/route.js`):**
  Calculate a date string based on the requested timeframe and query GitHub.
  - *Daily:* `q=created:>{yesterday} sort=stars`
  - *Weekly:* `q=created:>{7_days_ago} sort=stars`
  - *Monthly:* `q=created:>{30_days_ago} sort=stars`
- **Caching:** Use Next.js route caching (`next: { revalidate: 3600 }`) to cache these results for 1 hour. This prevents hitting the GitHub rate limit while keeping the front page feeling fresh and active.

---

## 2. 🔍 SEO-Optimized Repository Pages

**The Problem:** The app functions as a single-page search experience. Search engines cannot index individual repositories, meaning we miss out on "long-tail" organic search traffic (e.g., someone Googling "excalidraw github stats").

**The Solution:**
Create dedicated, Server-Side Rendered (SSR) pages for every repository.

**Implementation Details:**
- **Route:** Create `app/repo/[owner]/[name]/page.js`.
- **Data Fetching:** Fetch `https://api.github.com/repos/{owner}/{name}` directly on the server.
- **Content:**
  - Render core stats (Stars, Forks, Open Issues).
  - Fetch and render the repository's `README.md` (`https://api.github.com/repos/{owner}/{name}/readme`) using a markdown parser.
  - Show recent commit activity or contributor lists (optional).
- **SEO Metadata:** Implement Next.js `generateMetadata()` to dynamically create page titles, descriptions, and Open Graph images (for Twitter/Discord link previews) based on the repository's data.

---

## 3. 📚 Curated Topic Pages (Collections)

**The Problem:** Users often don't know what to search for. Providing curated lists gives users a reason to browse and provides high-value targets for search engine indexing.

**The Solution:**
Create dedicated pages for popular topics and categories.

**Implementation Details:**
- **Route:** Create `app/topics/[topic]/page.js`.
- **Examples:** `/topics/ai`, `/topics/react`, `/topics/rust`, `/topics/good-first-issue`.
- **Data Fetching:** When a user visits `/topics/ai`, fetch `q=topic:ai sort=stars` from GitHub.
- **UI:** A specialized header explaining the topic (e.g., "Top Open Source Artificial Intelligence Projects") followed by a list of repositories.
- **Navigation:** Add a "Browse Topics" section to the homepage or navbar linking to these pages.

---

## 4. 🎛 Advanced GitHub Search Filters

**The Solution:** Enhance `SearchBar.jsx` to leverage more of GitHub's advanced search syntax.

**Implementation Details:**
- **"Most Active" Filter:** Sort by recent updates (`sort=updated`) or filter by `pushed:>{date}`.
- **License Filter:** Allow users to filter by specific open-source licenses (`license:mit`, `license:apache-2.0`).
- **Language Integration:** Ensure the existing language dropdown maps perfectly to the `language:{lang}` qualifier in the search API.

---

## Conclusion
By implementing these features, Open18source will transition from a simple search tool into an indexed, discoverable platform that behaves more like established players (GitHub Trending, OSSInsight) while remaining entirely stateless and free to host in the short term.
