// app/api/trending/route.js
import { NextResponse } from "next/server";
import { calculateMatchScore } from "@/lib/utils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "daily"; // daily, weekly, monthly

    let date = new Date();
    if (timeframe === "weekly") {
      date.setDate(date.getDate() - 7);
    } else if (timeframe === "monthly") {
      date.setDate(date.getDate() - 30);
    } else {
      date.setDate(date.getDate() - 1); // daily
    }

    const dateString = date.toISOString().split('T')[0];
    const q = `created:>${dateString} stars:>0`;

    const ghUrl = new URL("https://api.github.com/search/repositories");
    ghUrl.searchParams.set("q", q);
    ghUrl.searchParams.set("sort", "stars");
    ghUrl.searchParams.set("order", "desc");
    ghUrl.searchParams.set("per_page", "18");

    const res = await fetch(ghUrl.toString(), {
      headers: {
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`GitHub API failed: ${res.statusText}`);
    }

    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items.map(repo => {
      const matchScore = calculateMatchScore(repo);
      return {
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
        match_score: matchScore,
      };
    }) : [];

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Trending API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
