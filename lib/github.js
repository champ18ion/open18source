export async function fetchRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch repos");
  }

  return res.json();
}
