import { useState, useEffect } from "react";

interface GitHubStarsResponse {
  stargazers_count: number;
}

export function useGithubStars(owner: string, repo: string) {
  const [stargazersCount, setStargazersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stargazers count");
        }
        const data: GitHubStarsResponse = await response.json();
        setStargazersCount(data.stargazers_count);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [owner, repo]);

  return { stargazersCount, isLoading, error };
}
