"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, ChevronDown, ExternalLink, Circle, ArrowRight } from "lucide-react"; // 1. Import ArrowRight icon
import Link from "next/link"; // 2. Import the Next.js Link component

function k(n) {
  if (n == null) return "0";
  if (n < 1000) return `${n}`;
  if (n < 1000000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1000000).toFixed(1)}m`;
}

export default function RepoTile({ repo }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const onKey = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }, [toggle]);

  const {
    name,
    full_name,
    description,
    stargazers_count,
    stars,
    forks_count,
    forks,
    language,
    topics = [],
    license,
    html_url
  } = repo || {};

  const displayName = name || full_name || "repository";
  const starCount = stars ?? stargazers_count ?? 0;
  const forkCount = forks ?? forks_count ?? 0;

  return (
    <div
      className={`repo-box ${open ? "active" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={onKey}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="repo-box-title font-clash truncate">{displayName}</h3>
          <div className="mt-2 text-muted text-sm flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Star size={16} /> {k(starCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork size={16} /> {k(forkCount)}
            </span>
            {language ? (
              <span className="inline-flex items-center gap-1">
                <Circle size={12} /> {language}
              </span>
            ) : null}
            {license?.spdx_id ? (
              <span className="text-xs">License: {license.spdx_id}</span>
            ) : null}
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`mt-1 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </div>

      {/* Expandable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)]">
              <p className="text-muted text-sm">
                {description || "No description provided."}
              </p>

              {topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-muted px-2 py-1 border border-[rgba(255,255,255,0.08)] rounded-[6px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <a
                  href={html_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="btn inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open on GitHub <ExternalLink size={16} />
                </a>
                
                {/* 3. ADDED THIS LINK TO THE DETAIL PAGE */}
                <Link
                  href={`/repo/${full_name}`}
                  className="btn-accent inline-flex items-center gap-1 text-sm" // Using the accent style from your CSS
                  onClick={(e) => e.stopPropagation()} // Stop propagation to prevent the tile from closing
                >
                    Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// function timeAgo(iso) {
//   if (!iso) return "unknown";
//   const delta = (Date.now() - new Date(iso).getTime()) / 1000;
//   const map = [
//     [60, "sec"],
//     [60, "min"],
//     [24, "hr"],
//     [7, "day"],
//     [4.345, "wk"],
//     [12, "mo"],
//   ];
//   let n = delta;
//   let unit = "yr";
//   for (let i = 0; i < map.length; i++) {
//     const [d, u] = map[i];
//     if (n < d) { unit = u; break; }
//     n = n / d;
//   }
//   const rounded = Math.floor(n);
//   return `${rounded} ${unit}${rounded !== 1 ? "s" : ""} ago`;
// }

// export default function RepoTile({ repo, isOpen, onOpen }) {
//   // Normalize base info coming from different sources
//   const { owner, name } = useMemo(() => {
//     const full = repo.full_name || repo.name || "";
//     const parts = full.includes("/") ? full.split("/") : [repo.owner?.login || "", full];
//     return { owner: parts[0], name: parts[1] };
//   }, [repo]);

//   const base = useMemo(() => {
//     return {
//       full_name: repo.full_name || repo.name,
//       description: repo.description || "",
//       html_url: repo.html_url || `https://github.com/${owner}/${name}`,
//       stargazers_count: repo.stargazers_count || repo.stars || 0,
//       forks_count: repo.forks_count || repo.forks || 0,
//       language: repo.language || "",
//       topics: repo.topics || [],
//       pushed_at: repo.pushed_at,
//     };
//   }, [repo, owner, name]);

//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   // Lazy load on first open
//   useEffect(() => {
//     if (!isOpen || details || loading) return;
//     let aborted = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setErr("");
//         const res = await fetch(`/api/repo/${owner}/${name}`);
//         if (!res.ok) throw new Error(`Failed: ${res.status}`);
//         const data = await res.json();
//         if (!aborted) setDetails(data);
//       } catch (e) {
//         if (!aborted) setErr(e?.message || "Failed to load details");
//       } finally {
//         if (!aborted) setLoading(false);
//       }
//     }

//     load();
//     return () => { aborted = true; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen, owner, name]);

//   const activeClass = isOpen ? "active" : "";

//   return (
//     <div className={`repo-box ${activeClass}`} onClick={() => onOpen(`${owner}/${name}`)}>
//       <h3 className="repo-box-title">{base.full_name}</h3>
//       {base.description && (
//         <p className="text-muted mt-1">{base.description}</p>
//       )}

//       {/* Always-visible small meta (language + stars) */}
//       <div className="mt-2 text-sm text-muted">
//         {base.language && <span>{base.language}</span>}
//         {base.language && " · "}
//         <span>⭐ {base.stargazers_count}</span>
//       </div>

//       {/* Expandable area */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2 }}
//             className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]"
//             onClick={(e) => e.stopPropagation()} // keep clicks inside from toggling others
//           >
//             {loading && (
//               <p className="text-muted text-sm">Loading details…</p>
//             )}

//             {err && (
//               <p className="text-destructive text-sm">⚠️ {err}</p>
//             )}

//             {!loading && !err && details && (
//               <div className="space-y-4">
//                 {/* Metrics row */}
//                 <div className="flex flex-wrap items-center gap-4 text-sm">
//                   <span>⭐ {details.stargazers_count}</span>
//                   <span>🍴 {details.forks_count}</span>
//                   <span>📂 {details.open_issues_count} open issues</span>
//                   <span>🕒 last push {timeAgo(details.pushed_at)}</span>
//                 </div>

//                 {/* Labels summary */}
//                 <div className="text-sm text-muted">
//                   <span className="mr-4">
//                     🧩 Good first issues: <b className="text-[var(--foreground)]">{details.good_first_issues}</b>
//                   </span>
//                   <span>
//                     🙋 Help wanted: <b className="text-[var(--foreground)]">{details.help_wanted_issues}</b>
//                   </span>
//                 </div>

//                 {/* README snippet */}
//                 {details.readme_snippet && (
//                   <div className="text-sm text-muted">
//                     <p>{details.readme_snippet}…</p>
//                   </div>
//                 )}

//                 {/* Links */}
//                 <div className="flex flex-wrap items-center gap-3">
//                   <a
//                     href={details.html_url}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="btn-accent px-3 py-1 rounded-lg text-sm"
//                   >
//                     View on GitHub ↗
//                   </a>
//                   {details.has_contributing && (
//                     <a
//                       href={`${details.html_url}/blob/${details.default_branch || "main"}/CONTRIBUTING.md`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="button px-3 py-1 text-sm"
//                     >
//                       Contribution Guide
//                     </a>
//                   )}
//                 </div>

//                 {/* How to contribute (static checklist) */}
//                 <div className="text-sm">
//                   <p className="section-title !text-base !mb-2">How to contribute</p>
//                   <ul className="list-disc pl-5 text-muted">
//                     <li>Fork the repository on GitHub</li>
//                     <li>Clone your fork locally</li>
//                     <li>Create a feature branch</li>
//                     <li>Make changes and commit with clear messages</li>
//                     <li>Push and open a Pull Request 🎉</li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
