import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function calculateMatchScore(repo) {
  let score = 10.0;
  // Use metrics available in the search API response:
  // `size` (in KB), `open_issues_count`, `stargazers_count`, `pushed_at`

  // 1. Penalize large codebases (harder to learn)
  if (repo.size && repo.size > 50000) score -= Math.min(4, (repo.size - 50000) / 25000);

  // 2. Penalize massive, complex projects (intimidating)
  if (repo.stargazers_count > 50000) score -= 3;
  else if (repo.stargazers_count > 10000) score -= 1.5;

  // 3. Penalize potentially neglected projects
  if (repo.open_issues_count > 500) score -= 2;

  if (repo.pushed_at) {
    const pushDate = new Date(repo.pushed_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (pushDate < sixMonthsAgo) score = 0; // Inactive repo is a 0 match
  }

  return Math.max(0, Math.round(score * 10) / 10);
}
