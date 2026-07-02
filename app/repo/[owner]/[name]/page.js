import { notFound } from "next/navigation";
import { Star, GitFork, AlertCircle, Calendar, ExternalLink, Activity, Users, Lightbulb } from "lucide-react";
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
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                 <h1 className="text-3xl font-bold font-clash flex items-center gap-3">
                   <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-10 h-10 rounded-full" />
                   <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {repo.full_name}
                   </a>
                 </h1>
                 <p className="mt-4 text-lg text-muted max-w-2xl">{repo.description}</p>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                 <a
                    href={`${repo.html_url}/contribute`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[var(--foreground)] hover:bg-gray-200 text-[var(--background)] font-medium px-6 py-3 rounded-xl transition-colors"
                 >
                    <Users size={18} /> Start Contributing
                 </a>
                 <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white font-medium px-6 py-3 rounded-xl transition-colors"
                 >
                    <ExternalLink size={18} /> View on GitHub
                 </a>
              </div>
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

        {/* USP: Contributor Insights Section */}
        <section className="mb-12">
           <h2 className="text-2xl font-bold font-clash mb-6 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" /> Contributor Insights
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insight 1: Activity Level */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] p-6 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                       <Activity className="text-green-400" size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Contribution Guide</h3>
                 </div>
                 <div className="text-muted text-sm leading-relaxed">
                   <ul className="list-disc pl-5 text-muted space-y-2">
                     <li>Fork the repository on GitHub</li>
                     <li>Clone your fork locally</li>
                     <li>Create a feature branch</li>
                     <li>Make changes and commit with clear messages</li>
                     <li>Push and open a Pull Request 🎉</li>
                   </ul>
                 </div>
              </div>

              {/* Insight 2: Community Size */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] p-6 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                       <Users className="text-blue-400" size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Project Health & Size</h3>
                 </div>
                 <p className="text-muted text-sm leading-relaxed mb-4">
                    {repo.forks_count > 1000
                       ? "Massive community. Expect strict contribution guidelines but high prestige."
                       : "Growing community. Great opportunity to make a noticeable impact and build relationships."}
                 </p>
                 <p className="text-muted text-sm leading-relaxed">
                    {repo.open_issues_count > 500
                       ? "High volume of open issues. Might take longer to get PRs reviewed, but lots of areas to help."
                       : "Manageable issue queue. Maintainers are likely responsive to new contributions and PRs."}
                 </p>
              </div>

              {/* Insight 3: Tech Match */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] p-6 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                       <Star className="text-purple-400" size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Tech Stack</h3>
                 </div>
                 <p className="text-muted text-sm leading-relaxed">
                    Primary language is <span className="font-bold text-[var(--foreground)]">{repo.language || "unspecified"}</span>.
                    {repo.topics?.length > 0 && ` Key topics include ${repo.topics.slice(0, 3).join(", ")}.`}
                 </p>
              </div>
           </div>
        </section>

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
