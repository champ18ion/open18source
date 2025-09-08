// "use client";
// import { useState, useEffect } from "react";
// import { Star, GitFork, AlertCircle, Code, FileText, ExternalLink, ChevronLeft } from "lucide-react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useParams } from "next/navigation";

// // Helper to format large numbers into a compact format (e.g., 12345 -> 12.3k)
// function k(n) {
//   if (n == null) return "0";
//   if (n < 1000) return `${n}`;
//   if (n < 1000000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
//   return `${(n / 1000000).toFixed(1)}m`;
// }

// // Helper to format date strings for better readability
// function formatDate(dateString) {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// export default function RepoDetailPage( ) {
//   const params = useParams();
//   const { owner, name } = params;
//   const [repo, setRepo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!owner || !name) return;

//     const fetchRepo = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/repo/${owner}/${name}`);
//         if (!res.ok) {
//           throw new Error(`Failed to fetch repository: ${res.statusText}`);
//         }
//         const data = await res.json();
//         setRepo(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRepo();
//   }, [owner, name]);

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center font-satoshi text-muted-foreground">Loading...</div>;
//   }

//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;
//   }

//   if (!repo) {
//     return <div className="min-h-screen flex items-center justify-center">Repository not found.</div>;
//   }

//   // Data for the main statistics grid
//   const statItems = [
//     { icon: Star, label: "Stars", value: k(repo.stargazers_count) },
//     { icon: GitFork, label: "Forks", value: k(repo.forks_count) },
//     { icon: AlertCircle, label: "Open Issues", value: k(repo.open_issues_count) },
//     { icon: Code, label: "Language", value: repo.language || "N/A" },
//     { icon: FileText, label: "License", value: repo.license?.name || "N/A" },
//   ];

//   // Data for the contribution details section
//   const contributionItems = [
//       { label: "Good First Issues", value: repo.good_first_issues },
//       { label: "Help Wanted Issues", value: repo.help_wanted_issues },
//       { label: "Has Contributing Guide", value: repo.has_contributing ? "Yes" : "No" }
//   ];

//   return (
//     <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi">
//       <div className="max-w-6xl mx-auto px-4 py-12">
//         {/* Header Section */}
//         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//             <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
//                 <ChevronLeft size={18} /> Back to Fonts
//             </Link>

//             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//                 <div>
//                     <h1 className="font-clash text-3xl md:text-4xl">{repo.full_name}</h1>
//                     <p className="text-muted-foreground mt-2 max-w-2xl">{repo.description}</p>
//                 </div>
//                 <a
//                     href={repo.html_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="button inline-flex items-center gap-2"
//                 >
//                     Open on GitHub <ExternalLink size={16} />
//                 </a>
//             </div>
//         </motion.div>

//         {/* Statistics Grid */}
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.4 }}
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.06)] my-12"
//         >
//             {statItems.map(item => (
//                  <div key={item.label} className="bg-[var(--background)] p-4">
//                      <p className="text-sm text-muted-foreground">{item.label}</p>
//                      <p className="text-xl font-clash mt-1">{item.value}</p>
//                  </div>
//             ))}
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column: README Snippet */}
//             <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.4 }}
//                 className="md:col-span-2"
//             >
//                 <h2 className="section-title">README Snippet</h2>
//                 <div className="card">
//                     <p className="text-muted-foreground whitespace-pre-wrap font-satoshi leading-relaxed">
//                         {repo.readme_snippet ? repo.readme_snippet + '...' : "No README snippet available."}
//                     </p>
//                 </div>
//             </motion.div>

//              {/* Right Column: Details and Contributions */}
//              <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4, duration: 0.4 }}
//             >
//                 <h2 className="section-title">Details</h2>
//                 <div className="card divide-y divide-[rgba(255,255,255,0.04)]">
//                      <div className="py-3 flex justify-between items-center">
//                          <span className="text-muted-foreground text-sm">Owner</span>
//                          <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
//                             <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-6 h-6 rounded-full"/>
//                             <span>{repo.owner.login}</span>
//                          </a>
//                      </div>
//                      <div className="py-3 flex justify-between items-center">
//                          <span className="text-muted-foreground text-sm">Last Pushed</span>
//                          <span>{formatDate(repo.pushed_at)}</span>
//                      </div>
//                      <div className="py-3 flex justify-between items-center">
//                          <span className="text-muted-foreground text-sm">Default Branch</span>
//                          <span>{repo.default_branch}</span>
//                      </div>
//                 </div>

//                 <h2 className="section-title mt-8">Contributions</h2>
//                  <div className="card divide-y divide-[rgba(255,255,255,0.04)]">
//                     {contributionItems.map(item => (
//                         <div key={item.label} className="py-3 flex justify-between items-center">
//                             <span className="text-muted-foreground text-sm">{item.label}</span>
//                             <span className={`font-clash ${item.value > 0 ? 'text-primary' : ''}`}>{item.value}</span>
//                         </div>
//                     ))}
//                  </div>
//             </motion.div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { Star, GitFork, ExternalLink, ChevronLeft, CheckCircle, GitPullRequest, Lightbulb, Inbox, Tag, Bug, LifeBuoy } from "lucide-react";
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
    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="block list-row hover:bg-secondary transition-colors">
      <div className="flex-grow min-w-0">
        <p className="text-foreground truncate" title={issue.title}>{issue.title}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-muted-foreground">#{issue.number} by {issue.user.login}</span>
          {issue.labels.map(label => (
            <span key={label.name} className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}>
              {label.name}
            </span>
          ))}
        </div>
      </div>
      <ExternalLink size={16} className="text-muted-foreground flex-shrink-0 ml-4" />
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
    return <div className="min-h-screen flex items-center justify-center font-satoshi text-muted-foreground">Analyzing Repository...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive px-4 text-center">{error}</div>;
  }
  if (!repo) {
    return <div className="min-h-screen flex items-center justify-center">Repository not found.</div>;
  }

  // --- Contribution Hierarchy Logic ---
  let issueContent;
  if (repo.good_first_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted-foreground   mb-6 text-sm">Based on our analysis, the best place to start is with one of these issues marked as ideal for newcomers.</p> <div className="card divide-y divide-[rgba(255,255,255,0.04)]"> {repo.good_first_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.help_wanted_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted-foreground mb-6 text-sm">This project is actively looking for help. Check out these issues to see where you can make an impact.</p> <div className="card divide-y divide-[rgba(255,255,255,0.04)]"> {repo.help_wanted_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.bug_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted-foreground mb-6 text-sm">Fixing bugs is a great way to learn the codebase. Here are some open bugs you can investigate.</p> <div className="card divide-y divide-[rgba(255,255,255,0.04)]"> {repo.bug_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else if (repo.recent_issues?.length > 0) {
    issueContent = ( <> <p className="text-muted-foreground mb-6 text-sm">We couldn't find any standard beginner labels. However, these recently updated and unassigned issues are often a great place to start exploring.</p> <div className="card divide-y divide-[rgba(255,255,255,0.04)]"> {repo.recent_issues.map(issue => <IssueCard key={issue.id} issue={issue} />)} </div> </> );
  } else {
    issueContent = ( <div className="card text-center py-10"> <Inbox size={48} className="mx-auto text-muted-foreground"/> <p className="mt-4 text-foreground">All Caught Up!</p> <p className="mt-2 text-sm text-muted-foreground">It looks like there are no open issues right now. Great job, maintainers!</p> </div> );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-satoshi">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"> <ChevronLeft size={18} /> Back to Discover </Link>
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4"> <div> <h1 className="font-clash text-3xl md:text-4xl">{repo.full_name}</h1> <p className="text-muted-foreground mt-2 max-w-2xl">{repo.description}</p> </div> <div className="flex items-center gap-4 flex-shrink-0 mt-4 md:mt-0"> <span className="flex items-center gap-1.5 text-sm"><Star size={16} /> {k(repo.stargazers_count)}</span> <span className="flex items-center gap-1.5 text-sm"><GitFork size={16} /> {k(repo.forks_count)}</span> <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="button"><ExternalLink size={16} /></a> </div> </div>
        </motion.div>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="section-title">Contribution Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="card p-4"><p className="text-sm text-muted-foreground flex items-center gap-2"><Tag size={14}/> Good First Issues</p><p className="text-2xl font-clash mt-2">{k(repo.good_first_issues_count)}</p></div>
                <div className="card p-4"><p className="text-sm text-muted-foreground flex items-center gap-2"><LifeBuoy size={14}/> Help Wanted</p><p className="text-2xl font-clash mt-2">{k(repo.help_wanted_issues_count)}</p></div>
                <div className="card p-4"><p className="text-sm text-muted-foreground flex items-center gap-2"><Bug size={14}/> Open Bugs</p><p className="text-2xl font-clash mt-2">{k(repo.bug_issues_count)}</p></div>
              </div>
              {issueContent}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="section-title">Contribution Roadmap</h2>
            <div className="card p-6 space-y-4">
              <div className="flex items-start gap-3"> <CheckCircle size={18} className="mt-1 text-primary flex-shrink-0"/> <div> <h4 className="font-clash">Understand the Project</h4> <p className="text-sm text-muted-foreground">{repo.readme_snippet ? repo.readme_snippet + '...' : 'Review the repository to understand its goals.'}</p> </div> </div>
              {repo.has_contributing && ( <div className="flex items-start gap-3"> <CheckCircle size={18} className="mt-1 text-primary flex-shrink-0"/> <div> <h4 className="font-clash">Read the Guidelines</h4> <p className="text-sm text-muted-foreground">The project has a <a href={`${repo.html_url}/blob/master/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="text-primary underline">CONTRIBUTING.md</a> file.</p> </div> </div> )}
              <div className="flex items-start gap-3"> <GitPullRequest size={18} className="mt-1 text-primary flex-shrink-0"/> <div> <h4 className="font-clash">Pick an Issue</h4> <p className="text-sm text-muted-foreground">Choose a task from the left, comment to claim it, and start coding.</p> </div> </div>
            </div>
            <ContributionHealth health={repo.contribution_health} />
            {repo.topics?.length > 0 && ( <> <h2 className="section-title mt-8">Topics</h2> <div className="flex flex-wrap gap-2"> {repo.topics.map(topic => ( <span key={topic} className="text-xs font-satoshi text-muted-foreground bg-secondary px-2 py-1 rounded-sm">{topic}</span> ))} </div> </> )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}