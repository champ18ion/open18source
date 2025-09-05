// // app/api/repo/[owner]/[name]/route.js
// import { NextResponse } from "next/server";

// const GH = "https://api.github.com";

// function ghHeaders() {
//   const headers = {
//     Accept: "application/vnd.github+json",
//     "X-GitHub-Api-Version": "2022-11-28",
//     "User-Agent": "oss-gems",
//   };
//   if (process.env.GITHUB_TOKEN) {
//     headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
//   }
//   return headers;
// }

// function stripMarkdown(md = "") {
//   let s = md;
//   s = s.replace(/```[\s\S]*?```/g, " ");           // code fences
//   s = s.replace(/`[^`]*`/g, " ");                  // inline code
//   s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");     // images
//   s = s.replace(/\[[^\]]*\]\([^)]*\)/g, " ");      // links
//   s = s.replace(/^#+\s+/gm, "");                   // headings
//   s = s.replace(/>\s?.*/g, " ");                   // blockquotes
//   s = s.replace(/[*_-]{3,}/g, " ");                // hr
//   s = s.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1"); // emphasis
//   s = s.replace(/\r?\n\s*\r?\n/g, " ");            // collapse blank lines
//   s = s.replace(/\s{2,}/g, " ");                   // multi-space
//   return s.trim();
// }

// export async function GET(_req, { params }) {
//   const { owner, name } = await params;

//   try {
//     // Core repo info
//     const repoRes = await fetch(`${GH}/repos/${owner}/${name}`, {
//       headers: ghHeaders(),
//       cache: "no-store",
//     });

//     if (!repoRes.ok) {
//       const msg = `GitHub repo fetch failed: ${repoRes.status}`;
//       return NextResponse.json({ error: msg }, { status: repoRes.status });
//     }

//     const repo = await repoRes.json();

//     // README (optional)
//     const readmeRes = await fetch(`${GH}/repos/${owner}/${name}/readme`, {
//       headers: ghHeaders(),
//       cache: "no-store",
//     });
//     let readmeSnippet = "";
//     if (readmeRes.ok) {
//       const readme = await readmeRes.json();
//       if (readme?.content) {
//         const decoded = Buffer.from(readme.content, "base64").toString("utf-8");
//         readmeSnippet = stripMarkdown(decoded).slice(0, 300);
//       }
//     }

//     // CONTRIBUTING (optional)
//     const contribRes = await fetch(
//       `${GH}/repos/${owner}/${name}/contents/CONTRIBUTING.md`,
//       { headers: ghHeaders(), cache: "no-store" }
//     );
//     const hasContributing = contribRes.ok;

//     // Label counts via issue search (two synonyms each, summed)
//     async function countSearch(q) {
//       const res = await fetch(`${GH}/search/issues?q=${encodeURIComponent(q)}`, {
//         headers: ghHeaders(),
//         cache: "no-store",
//       });
//       if (!res.ok) return 0;
//       const data = await res.json();
//       return data?.total_count || 0;
//     }

//     const baseQ = `repo:${owner}/${name}+state:open+is:issue`;
//     const [gfiA, gfiB, hwA, hwB] = await Promise.all([
//       countSearch(`${baseQ}+label:"good first issue"`),
//       countSearch(`${baseQ}+label:good-first-issue`),
//       countSearch(`${baseQ}+label:"help wanted"`),
//       countSearch(`${baseQ}+label:help-wanted`),
//     ]);

//     const goodFirstIssues = gfiA + gfiB;
//     const helpWantedIssues = hwA + hwB;

//     const payload = {
//       full_name: repo.full_name,
//       html_url: repo.html_url,
//       description: repo.description,
//       language: repo.language,
//       stargazers_count: repo.stargazers_count,
//       forks_count: repo.forks_count,
//       open_issues_count: repo.open_issues_count,
//       pushed_at: repo.pushed_at,
//       default_branch: repo.default_branch,
//       good_first_issues: goodFirstIssues,
//       help_wanted_issues: helpWantedIssues,
//       readme_snippet: readmeSnippet,
//       has_contributing: hasContributing,
//       owner: {
//         login: repo.owner?.login,
//         avatar_url: repo.owner?.avatar_url,
//         html_url: repo.owner?.html_url,
//       },
//     };

//     const res = NextResponse.json(payload);
//     // Cache the combined response for everyone (CDN) for 1h.
//     res.headers.set("Cache-Control", "s-maxage=3600, stale-while-revalidate=3600");
//     return res;
//   } catch (err) {
//     return NextResponse.json(
//       { error: err?.message || "Unexpected error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const GH = "https://api.github.com";

/**
 * Generates the necessary headers for making requests to the GitHub API.
 */
function ghHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "oss-gems",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * A powerful sanitizer that removes both Markdown and HTML tags from a string.
 */
function sanitizeToText(content = "") {
  let s = content;
  s = s.replace(/<[^>]*>/g, " ");
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/`[^`]*`/g, " ");
  s = s.replace(/^#+\s+/gm, "");
  s = s.replace(/>\s?.*/g, " ");
  s = s.replace(/[*_-]{3,}/g, " ");
  s = s.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1");
  s = s.replace(/\r?\n\s*\r?\n/g, " ");
  s = s.replace(/\s{2,}/g, " ");
  return s.trim();
}

/**
 * [HYBRID STRATEGY - PART 1]
 * Uses the Search API (`/search/issues`) for the sole purpose of getting the accurate `total_count`.
 * This is lightweight as we only request 1 item per page.
 */
async function getIssueCount(baseQuery, labelQuery) {
  const url = new URL(`${GH}/search/issues`);
  url.searchParams.set("q", `${baseQuery} ${labelQuery}`);
  url.searchParams.set("per_page", "1"); // We only need the count, not the items.
  try {
    const res = await fetch(url.toString(), { headers: ghHeaders(), cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total_count || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * [HYBRID STRATEGY - PART 2]
 * Uses the direct, reliable List Issues API (`/repos/{owner}/{repo}/issues`) to fetch the actual issues for display.
 */
async function listRepositoryIssues(owner, name, queryParams = {}) {
  const url = new URL(`${GH}/repos/${owner}/${name}/issues`);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  try {
    const res = await fetch(url.toString(), { headers: ghHeaders(), cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function GET(_req, { params }) {
  const { owner, name } = params;

  try {
    const repoRes = await fetch(`${GH}/repos/${owner}/${name}`, { headers: ghHeaders(), cache: "no-store" });
    if (!repoRes.ok) {
      return NextResponse.json({ error: `GitHub repo fetch failed: ${repoRes.status}` }, { status: 500 });
    }
    const repo = await repoRes.json();
    const baseSearchQuery = `repo:${owner}/${name}+is:open+is:issue`;

    const [
      readmeRes,
      contribRes,
      // Get COUNTS from the Search API
      gfiCount,
      hwCount,
      bugCount,
      // Get actual ISSUE LISTS from the List API
      gfiResult,
      hwResult,
      bugResult,
      recentResult,
    ] = await Promise.all([
      fetch(`${GH}/repos/${owner}/${name}/readme`, { headers: ghHeaders(), cache: "no-store" }),
      fetch(`${GH}/repos/${owner}/${name}/contents/CONTRIBUTING.md`, { headers: ghHeaders(), cache: "no-store" }),
      getIssueCount(baseSearchQuery, `label:"good first issue",good-first-issue`),
      getIssueCount(baseSearchQuery, `label:"help wanted",help-wanted`),
      getIssueCount(baseSearchQuery, `label:"bug",kind/bug,type/bug`),
      listRepositoryIssues(owner, name, { labels: "good first issue,good-first-issue", per_page: 5 }),
      listRepositoryIssues(owner, name, { labels: "help wanted,help-wanted", per_page: 5 }),
      listRepositoryIssues(owner, name, { labels: "bug,kind/bug,type/bug", per_page: 5 }),
      listRepositoryIssues(owner, name, { assignee: "none", sort: "updated", per_page: 5 }),
    ]);

    const hasContributing = contribRes.ok;
    let readmeSnippet = "";
    if (readmeRes.ok) {
      const readme = await readmeRes.json();
      if (readme?.content) {
        const decodedContent = Buffer.from(readme.content, "base64").toString("utf-8");
        readmeSnippet = sanitizeToText(decodedContent).slice(0, 300);
      }
    }

    const normalize = (issue) => ({ id: issue.id, title: issue.title, html_url: issue.html_url, number: issue.number, user: { login: issue.user.login }, labels: issue.labels.map(l => ({ name: l.name, color: l.color })) });

    const payload = {
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      owner: repo.owner,
      topics: repo.topics || [],
      readme_snippet: readmeSnippet,
      has_contributing: hasContributing,
      // Accurate counts from the Search API
      good_first_issues_count: gfiCount,
      help_wanted_issues_count: hwCount,
      bug_issues_count: bugCount,
      // Reliable issue lists from the List API
      good_first_issues: gfiResult.map(normalize),
      help_wanted_issues: hwResult.map(normalize),
      bug_issues: bugResult.map(normalize),
      recent_issues: recentResult.map(normalize),
    };

    const res = NextResponse.json(payload);
    res.headers.set("Cache-Control", "s-maxage=3600, stale-while-revalidate=3600");
    return res;
  } catch (err) {
    console.error(`[OSS GEMS API ERROR] /api/repo/${owner}/${name}:`, err);
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}