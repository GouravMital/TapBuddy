
import { z } from "zod";
import { toast } from "sonner";

export const GithubIssueSchema = z.object({
  id: z.number(),
  title: z.string(),
  html_url: z.string().url(),
  body: z.string().nullable(),
  created_at: z.string(),
  repository: z.object({
    full_name: z.string(),
    html_url: z.string().url(),
    language: z.string().nullable(),
    topics: z.array(z.string()).optional(),
  }),
  labels: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export type GithubIssue = z.infer<typeof GithubIssueSchema>;

// Mock data for development
const MOCK_ISSUES: GithubIssue[] = [
  {
    id: 1,
    title: "Add documentation for API endpoints",
    html_url: "https://github.com/org/repo1/issues/1",
    body: "We need better documentation for our REST API endpoints to help new users get started quickly.",
    created_at: "2023-04-01T12:00:00Z",
    repository: {
      full_name: "org/documentation-project",
      html_url: "https://github.com/org/documentation-project",
      language: "JavaScript",
      topics: ["documentation", "web", "api"],
    },
    labels: [
      { name: "good first issue" },
      { name: "documentation" },
      { name: "help wanted" },
    ],
  },
  {
    id: 2,
    title: "Fix styling issue in mobile navigation",
    html_url: "https://github.com/org/repo2/issues/2",
    body: "The mobile navigation menu doesn't close properly when clicking outside of it.",
    created_at: "2023-04-02T12:00:00Z",
    repository: {
      full_name: "org/frontend-project",
      html_url: "https://github.com/org/frontend-project",
      language: "TypeScript",
      topics: ["frontend", "react", "ui"],
    },
    labels: [
      { name: "good first issue" },
      { name: "bug" },
      { name: "frontend" },
    ],
  },
  {
    id: 3,
    title: "Implement caching for database queries",
    html_url: "https://github.com/org/repo3/issues/3",
    body: "We need to add caching for frequently accessed database queries to improve performance.",
    created_at: "2023-04-03T12:00:00Z",
    repository: {
      full_name: "org/backend-project",
      html_url: "https://github.com/org/backend-project",
      language: "Python",
      topics: ["backend", "database", "performance"],
    },
    labels: [
      { name: "good first issue" },
      { name: "enhancement" },
      { name: "performance" },
    ],
  },
  {
    id: 4,
    title: "Add unit tests for user authentication",
    html_url: "https://github.com/org/repo4/issues/4",
    body: "We need more test coverage for our authentication module, especially for edge cases.",
    created_at: "2023-04-04T12:00:00Z",
    repository: {
      full_name: "org/testing-project",
      html_url: "https://github.com/org/testing-project",
      language: "Python",
      topics: ["testing", "authentication", "backend"],
    },
    labels: [
      { name: "good first issue" },
      { name: "testing" },
      { name: "help wanted" },
    ],
  },
  {
    id: 5,
    title: "Improve error handling in API client",
    html_url: "https://github.com/org/repo5/issues/5",
    body: "The API client needs better error handling to provide more helpful error messages to users.",
    created_at: "2023-04-05T12:00:00Z",
    repository: {
      full_name: "org/api-project",
      html_url: "https://github.com/org/api-project",
      language: "JavaScript",
      topics: ["api", "client", "error-handling"],
    },
    labels: [
      { name: "good first issue" },
      { name: "enhancement" },
      { name: "api" },
    ],
  },
  {
    id: 6,
    title: "Refactor CSS to use CSS variables",
    html_url: "https://github.com/org/repo6/issues/6",
    body: "We should refactor our CSS to use CSS variables to make theming easier and reduce duplication.",
    created_at: "2023-04-06T12:00:00Z",
    repository: {
      full_name: "org/css-project",
      html_url: "https://github.com/org/css-project",
      language: "CSS",
      topics: ["frontend", "css", "styling"],
    },
    labels: [
      { name: "good first issue" },
      { name: "refactor" },
      { name: "css" },
    ],
  },
  {
    id: 7,
    title: "Add search functionality to docs site",
    html_url: "https://github.com/org/repo7/issues/7",
    body: "Our documentation site needs a search feature to help users find information more easily.",
    created_at: "2023-04-07T12:00:00Z",
    repository: {
      full_name: "org/docs-project",
      html_url: "https://github.com/org/docs-project",
      language: "JavaScript",
      topics: ["documentation", "search", "frontend"],
    },
    labels: [
      { name: "good first issue" },
      { name: "feature" },
      { name: "documentation" },
    ],
  },
];

export class GitHubApiClient {
  private baseUrl = "https://api.github.com";
  
  async fetchGoodFirstIssues(): Promise<GithubIssue[]> {
    console.log("Fetching good first issues from GitHub API");
    
    try {
      // Use the real GitHub API instead of mock data
      return await this.fetchLiveGoodFirstIssues();
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
      toast.error("Failed to fetch GitHub issues");
      return [];
    }
  }
  
  // Add a method to fetch real-time GitHub issues
  // This would be used in a production environment
  async fetchLiveGoodFirstIssues(token?: string): Promise<GithubIssue[]> {
    console.log("Fetching live good first issues from GitHub API");
    
    try {
      const headers: Record<string, string> = {
        "Accept": "application/vnd.github.v3+json",
      };
      
      if (token) {
        headers["Authorization"] = `token ${token}`;
      }
      
      // Fetch issues with the "good first issue" label
      const response = await fetch(
        `${this.baseUrl}/search/issues?q=label:"good+first+issue"+state:open&sort=created&order=desc&per_page=30`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process each issue and fetch repository details
      const issuePromises = data.items.map(async (item: any) => {
        try {
          // Extract repo name from repository_url
          // Format: https://api.github.com/repos/owner/repo
          const repoFullName = item.repository_url.split('/repos/')[1];
          
          // Fetch repository details
          const repoResponse = await fetch(
            `${this.baseUrl}/repos/${repoFullName}`,
            { headers }
          );
          
          if (!repoResponse.ok) {
            throw new Error(`Failed to fetch repository details for ${repoFullName}`);
          }
          
          const repoData = await repoResponse.json();
          
          return {
            id: item.id,
            title: item.title,
            html_url: item.html_url,
            body: item.body,
            created_at: item.created_at,
            repository: {
              full_name: repoData.full_name,
              html_url: repoData.html_url,
              language: repoData.language,
              topics: repoData.topics || [],
            },
            labels: item.labels.map((label: any) => ({ name: label.name })),
          };
        } catch (error) {
          console.error(`Error processing issue ${item.id}:`, error);
          return null;
        }
      });
      
      // Wait for all repository fetches to complete
      const results = await Promise.all(issuePromises);
      
      // Filter out any null results from failed fetches
      const issues = results.filter((issue): issue is GithubIssue => issue !== null);
      
      return issues;
    } catch (error) {
      console.error("Error fetching live GitHub issues:", error);
      // Fall back to mock data if API fails
      return MOCK_ISSUES;
    }
  }
}

export const githubApi = new GitHubApiClient();
