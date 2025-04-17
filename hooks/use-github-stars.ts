import useSWR from "swr";

interface GitHubStarsResponse {
  stargazers_count: number;
}

async function fetchGithubStars(
  owner: string,
  repo: string
): Promise<GitHubStarsResponse> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stargazers count");
  }
  return response.json();
}

export function useGithubStars(owner: string, repo: string) {
  const { data, isLoading, error } = useSWR(
    [owner, repo],
    ([owner, repo]) => fetchGithubStars(owner, repo),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Revalidate at most once per minute
    }
  );

  return {
    stargazersCount: data?.stargazers_count ?? 0,
    isLoading,
    error: error as Error | null,
  };
}
