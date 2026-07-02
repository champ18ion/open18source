import RepoTile from "@/components/repo/RepoTile";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { topic } = params;
  return {
    title: `Top Open Source ${topic} Projects | Open18source`,
    description: `Discover the best open-source ${topic} repositories on GitHub.`,
  };
}

export default async function TopicPage({ params }) {
  const { topic } = params;

  // Fetch repos for this topic
  const ghUrl = new URL("https://api.github.com/search/repositories");
  ghUrl.searchParams.set("q", `topic:${topic}`);
  ghUrl.searchParams.set("sort", "stars");
  ghUrl.searchParams.set("order", "desc");
  ghUrl.searchParams.set("per_page", "18");

  const res = await fetch(ghUrl.toString(), {
    headers: {
      ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
     return <div className="p-8 text-center text-red-400">Failed to load topic data. Please try again later.</div>;
  }

  const data = await res.json();
  const repos = data.items || [];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi py-12">
      <div className="max-w-6xl mx-auto px-4">

        <Link href="/" className="text-muted hover:text-white mb-8 inline-block">
          ← Back to Search
        </Link>

        <header className="mb-12 text-center">
           <h1 className="text-4xl font-bold font-clash mb-4 capitalize">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{topic}</span> Projects
           </h1>
           <p className="text-muted max-w-2xl mx-auto text-lg">
              Discover the most popular open-source repositories related to {topic}.
           </p>
        </header>

        {repos.length === 0 ? (
           <p className="text-center text-muted">No repositories found for this topic.</p>
        ) : (
           <div className="repo-boxes">
              {repos.map((repo, i) => (
                 <RepoTile key={i} repo={repo} />
              ))}
           </div>
        )}

      </div>
    </main>
  );
}
