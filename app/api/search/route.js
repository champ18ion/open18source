// app/api/search/route.js
import { NextResponse } from "next/server";

/**
 * Supported query params:
 * - q: free text (optional)
 * - language: e.g. "javascript" (optional)
 * - topics: comma-separated topics, e.g. "ai,database" (optional)
 * - goodFirstIssue: "true" | "false" (optional)
 * - starsMin: number, e.g. "100" (optional)
 * - sort: "stars" | "updated" | "forks" (optional; default "stars")
 * - order: "desc" | "asc" (optional; default "desc")
 * - per_page: number (1..100; default 20)
 * - page: number (>=1; default 1)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const qText = (searchParams.get("q") || "").trim(); // free text
    const language = (searchParams.get("language") || "").trim();
    const topicsRaw = (searchParams.get("topics") || "").trim();
    const goodFirstIssue = (searchParams.get("goodFirstIssue") || "").toLowerCase() === "true";
    const starsMin = searchParams.get("starsMin");
    const sort = (searchParams.get("sort") || "stars").toLowerCase();
    const order = (searchParams.get("order") || "desc").toLowerCase();
    const perPage = Math.min(Math.max(parseInt(searchParams.get("per_page") || "20", 10), 1), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);

    // Build GitHub search qualifiers
    const qualifiers = [];
    if (language) qualifiers.push(`language:${language}`);
    if (goodFirstIssue) qualifiers.push("good-first-issues:>0");
    if (starsMin && !Number.isNaN(Number(starsMin))) qualifiers.push(`stars:>=${starsMin}`);

    const topics = topicsRaw
      ? topicsRaw.split(",").map(t => t.trim()).filter(Boolean)
      : [];
    for (const t of topics) qualifiers.push(`topic:${t}`);

    const parts = [];
    if (qText) parts.push(qText);
    parts.push(...qualifiers);

    // Final query string for GitHub
    const q = parts.join(" ").trim();
    const ghUrl = new URL("https://api.github.com/search/repositories");
    ghUrl.searchParams.set("q", q || "stars:>0"); // default to something valid
    ghUrl.searchParams.set("sort", ["stars", "updated", "forks"].includes(sort) ? sort : "stars");
    ghUrl.searchParams.set("order", order === "asc" ? "asc" : "desc");
    ghUrl.searchParams.set("per_page", String(perPage));
    ghUrl.searchParams.set("page", String(page));

    // Call GitHub
    const res = await fetch(ghUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // We want fresh data during Phase 1
      cache: "no-store",
    });

    // Handle rate limits / errors gracefully
    const ratelimit = {
      limit: res.headers.get("x-ratelimit-limit"),
      remaining: res.headers.get("x-ratelimit-remaining"),
      reset: res.headers.get("x-ratelimit-reset"),
      used: res.headers.get("x-ratelimit-used"),
    };

    if (!res.ok) {
      const errBody = await safeJson(res);
      const status = res.status === 403 ? 429 : res.status; // map rate-limit to 429
      return NextResponse.json(
        {
          error: errBody?.message || "GitHub API error",
          ratelimit,
        },
        { status }
      );
    }

    const data = await res.json();

    // Normalize items (keep it small; topics may be missing for some repos)
    const items = Array.isArray(data.items) ? data.items.map(repo => ({
      id: repo.id,
      full_name: repo.full_name,
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      topics: repo.topics || [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      pushed_at: repo.pushed_at,
      owner: {
        login: repo.owner?.login,
        avatar_url: repo.owner?.avatar_url,
        html_url: repo.owner?.html_url,
      },
    })) : [];

    return NextResponse.json({
      ok: true,
      q,
      sort: ghUrl.searchParams.get("sort"),
      order: ghUrl.searchParams.get("order"),
      page,
      per_page: perPage,
      total_count: data.total_count ?? items.length,
      ratelimit,
      items,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
