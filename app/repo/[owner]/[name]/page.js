"use client";
import { useState, useEffect } from "react";
import { Star, GitFork, ExternalLink, ChevronLeft, CheckCircle, GitPullRequest, Lightbulb, Inbox, Tag, Bug, LifeBuoy, Code, Activity, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import ContributionHealth from "@/components/repo/ContributionHealth";

/**
 * Helper to format large numbers into a compact "k" format.
 */
function k(n) {
  if (n == null) return "0";
  if (n < 1000) return `${n}`;
  if (n < 1000000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1000000).toFixed(1)}m`;
}

/**
 * A reusable component to display a single issue card.
 */
function IssueCard({ issue }) {
  return (
    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="block list-row hover:bg-[rgba(255,255,255,0.02)] transition-colors p-4 border-b border-[rgba(255,255,255,0.05)] last:border-0 flex items-center justify-between">
      <div className="flex-grow min-w-0 pr-4">
        <p className="text-[var(--foreground)] truncate font-medium" title={issue.title}>{issue.title}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-muted">#{issue.number} by {issue.user.login}</span>
          {issue.labels.map(label => (
            <span key={label.name} className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}>
              {label.name}
            </span>
          ))}
        </div>
      </div>
      <ExternalLink size={16} className="text-muted flex-shrink-0" />
    </a>
  );
}

export default function RepoDetailPage() {
  const params = useParams();
  const { owner, name } = params || {};
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !name) return;
    const fetchRepo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/repo/${owner}/${name}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to fetch repository: ${res.statusText}`);
        }
        setRepo(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [owner, name]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-satoshi text-muted">Analyzing Repository...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400 px-4 text-center">{error}</div>;
  }
  if (!repo) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Repository not found.</div>;
  }

  // --- Contribution Hierarchy Logic ---
  let issueContent;
  if (repo.good_first_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted mb-6 text-sm">Based on our analysis, the best place to start is with one of these issues marked as ideal for newcomers.</p> <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"> {repo.good_first_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.help_wanted_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted mb-6 text-sm">This project is actively looking for help. Check out these issues to see where you can make an impact.</p> <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"> {repo.help_wanted_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.bug_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted mb-6 text-sm">Fixing bugs is a great way to learn the codebase. Here are some open bugs you can investigate.</p> <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"> {repo.bug_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.recent_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted mb-6 text-sm">We couldn&apos;t find any standard beginner labels. However, these recently updated and unassigned issues are often a great place to start exploring.</p> <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"> {repo.recent_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else {
    issueContent = ( <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl text-center py-10"> <Inbox size={48} className="mx-auto text-muted mb-4"/> <p className="text-[var(--foreground)] font-semibold">All Caught Up!</p> <p className="mt-2 text-sm text-muted">It looks like there are no open issues right now. Great job, maintainers!</p> </div> );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-[var(--foreground)] transition-colors mb-8"> <ChevronLeft size={18} /> Back to Discover </Link>
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
            <div className="flex items-center gap-4">
              <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-16 h-16 rounded-xl border border-[rgba(255,255,255,0.1)] hidden sm:block" />
              <div>
                <h1 className="font-clash text-3xl md:text-4xl font-bold">{repo.full_name}</h1>
                <p className="text-muted mt-2 max-w-2xl">{repo.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 mt-4 md:mt-0 min-w-[200px]">
               <div className="flex items-center gap-4 bg-[rgba(255,255,255,0.03)] p-3 rounded-xl border border-[rgba(255,255,255,0.06)] justify-center">
                 <span className="flex items-center gap-1.5 text-sm font-medium"><Star size={16} className="text-yellow-500"/> {k(repo.stargazers_count)}</span>
                 <span className="flex items-center gap-1.5 text-sm font-medium"><GitFork size={16} className="text-gray-400"/> {k(repo.forks_count)}</span>
                 <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="ml-2 bg-[var(--foreground)] text-[var(--background)] p-1.5 rounded-lg hover:bg-gray-200 transition-colors" title="View on GitHub"><ExternalLink size={16} /></a>
               </div>
               <a
                  href={`https://gitpod.io/#${repo.html_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 w-full"
               >
                  <Code size={18} /> Code in Browser
               </a>
            </div>
          </div>
        </motion.div>

        {/* USP: Contributor Insights Section */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-12 mb-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Insight 1: Activity Level */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] p-6 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                       <Activity className="text-green-400" size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Project Health</h3>
                 </div>
                 <p className="text-muted text-sm leading-relaxed">
                    {repo.open_issues_count > 500
                       ? "High volume of open issues. Might take longer to get PRs reviewed, but lots of areas to help."
                       : "Manageable issue queue. Maintainers are likely responsive to new contributions and PRs."}
                 </p>
              </div>

              {/* Insight 2: Community Size */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] p-6 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                       <Users className="text-blue-400" size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Community Size</h3>
                 </div>
                 <p className="text-muted text-sm leading-relaxed">
                    {repo.forks_count > 1000
                       ? "Massive community. Expect strict contribution guidelines but high prestige."
                       : "Growing community. Great opportunity to make a noticeable impact and build relationships."}
                 </p>
              </div>
           </div>
        </motion.section>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold font-clash mb-6">Contribution Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center text-center"><p className="text-sm text-muted flex items-center justify-center gap-2 mb-2"><Tag size={14}/> Good First</p><p className="text-2xl font-clash font-bold">{k(repo.good_first_issues_count)}</p></div>
                <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center text-center"><p className="text-sm text-muted flex items-center justify-center gap-2 mb-2"><LifeBuoy size={14}/> Help Wanted</p><p className="text-2xl font-clash font-bold">{k(repo.help_wanted_issues_count)}</p></div>
                <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center text-center"><p className="text-sm text-muted flex items-center justify-center gap-2 mb-2"><Bug size={14}/> Open Bugs</p><p className="text-2xl font-clash font-bold">{k(repo.bug_issues_count)}</p></div>
              </div>
              {issueContent}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold font-clash mb-6">Contribution Roadmap</h2>
            <div className="bg-[rgba(255,255,255,0.03)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-6">
              <div className="flex items-start gap-3"> <CheckCircle size={18} className="mt-1 text-blue-400 flex-shrink-0"/> <div> <h4 className="font-clash font-semibold text-[var(--foreground)]">Understand the Project</h4> <p className="text-sm text-muted mt-1 leading-relaxed">{repo.readme_snippet ? repo.readme_snippet + '...' : 'Review the repository to understand its goals.'}</p> </div> </div>
              {repo.has_contributing && ( <div className="flex items-start gap-3"> <CheckCircle size={18} className="mt-1 text-blue-400 flex-shrink-0"/> <div> <h4 className="font-clash font-semibold text-[var(--foreground)]">Read the Guidelines</h4> <p className="text-sm text-muted mt-1">The project has a <a href={`${repo.html_url}/blob/${repo.default_branch || 'master'}/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">CONTRIBUTING.md</a> file.</p> </div> </div> )}
              <div className="flex items-start gap-3"> <GitPullRequest size={18} className="mt-1 text-blue-400 flex-shrink-0"/> <div> <h4 className="font-clash font-semibold text-[var(--foreground)]">Pick an Issue</h4> <p className="text-sm text-muted mt-1 leading-relaxed">Choose a task from the left, comment to claim it, and start coding.</p> </div> </div>
            </div>

            <div className="mt-8">
               <ContributionHealth health={repo.contribution_health} />
            </div>

            {repo.topics?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold font-clash mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {repo.topics.map(topic => (
                  <span key={topic} className="text-xs font-medium text-muted bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full">{topic}</span>
                ))}
              </div>
            </div> )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
