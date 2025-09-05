// app/api/trending/route.js
import { NextResponse } from "next/server";

const fallbackRepos = [
  { name: "vercel/next.js", description: "The React Framework", stars: 123000 },
  { name: "facebook/react", description: "UI Library", stars: 210000 },
  { name: "tailwindlabs/tailwindcss", description: "Utility-first CSS", stars: 80000 },
];

export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=5",
      {
        headers: {
          "User-Agent": "my-app",
        //   Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // optional but recommended
        },
        next: { revalidate: 86400 }, // ✅ 24h cache
      }
    );

    if (!response.ok) throw new Error("GitHub API failed");

    const data = await response.json();

    const repos = data.items.map((repo) => ({
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
    }));

    return NextResponse.json(repos);
  } catch (err) {
    console.error("Trending API failed → using fallback repos", err.message);
    return NextResponse.json(fallbackRepos, {
      headers: { "Cache-Control": "s-maxage=86400" },
    });
  }
}
