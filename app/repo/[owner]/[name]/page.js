import { notFound } from "next/navigation";
import { Star, GitFork, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { owner, name } = params;
  return {
    title: `${owner}/${name} | Open18source`,
    description: `View stats and details for ${owner}/${name} on GitHub.`,
  };
}

export default async function RepoPage({ params }) {
  const { owner, name } = params;

  // Fetch basic repo details
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });

  if (!repoRes.ok) {
    if (repoRes.status === 404) notFound();
    return <div className="p-8 text-center text-red-400">Failed to load repository data. Please try again later.</div>;
  }

  const repo = await repoRes.json();

  // Fetch README
  const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers: {
      ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      Accept: "application/vnd.github.v3.html", // get html directly
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });

  let readmeHtml = null;
  if (readmeRes.ok) {
     readmeHtml = await readmeRes.text();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi py-12">
      <div className="max-w-4xl mx-auto px-4">

        <Link href="/" className="text-muted hover:text-white mb-8 inline-block">
          ← Back to Search
        </Link>

        {/* Header section */}
        <header className="mb-12 border-b border-[rgba(255,255,255,0.1)] pb-8">
           <div className="flex items-start justify-between">
              <div>
                 <h1 className="text-3xl font-bold font-clash flex items-center gap-3">
                   <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-10 h-10 rounded-full" />
                   <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {repo.full_name}
                   </a>
                 </h1>
                 <p className="mt-4 text-lg text-muted">{repo.description}</p>
              </div>
              {/* Optional: Add a button to view on GitHub */}
           </div>

           <div className="flex flex-wrap gap-4 mt-6">
              {repo.language && (
                 <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] rounded-full text-sm">
                    {repo.language}
                 </span>
              )}
              {repo.topics && repo.topics.map(topic => (
                 <span key={topic} className="px-3 py-1 border border-[rgba(255,255,255,0.1)] rounded-full text-sm text-muted">
                    {topic}
                 </span>
              ))}
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 mb-2" />
              <span className="text-2xl font-bold">{repo.stargazers_count.toLocaleString()}</span>
              <span className="text-sm text-muted">Stars</span>
           </div>
           <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <GitFork className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-2xl font-bold">{repo.forks_count.toLocaleString()}</span>
              <span className="text-sm text-muted">Forks</span>
           </div>
           <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
              <span className="text-2xl font-bold">{repo.open_issues_count.toLocaleString()}</span>
              <span className="text-sm text-muted">Open Issues</span>
           </div>
           <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400 mb-2" />
              <span className="text-xl font-bold">{new Date(repo.pushed_at).toLocaleDateString()}</span>
              <span className="text-sm text-muted">Last Push</span>
           </div>
        </div>

        {/* README Section */}
        <section>
           <h2 className="text-2xl font-bold font-clash mb-6">README</h2>
           {readmeHtml ? (
              <div
                 className="prose prose-invert max-w-none bg-[rgba(255,255,255,0.02)] p-6 md:p-8 rounded-xl border border-[rgba(255,255,255,0.06)] overflow-x-auto"
                 dangerouslySetInnerHTML={{ __html: readmeHtml }}
              />
           ) : (
              <p className="text-muted italic">No README found for this repository.</p>
           )}
        </section>

      </div>
    </main>
  );
}
