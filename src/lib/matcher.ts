
import { DeveloperProfile } from "./db";
import { GithubIssue } from "./github-api";

export interface MatchResult {
  issue: GithubIssue;
  score: number;
  reasons: string[];
}

export class IssueMatcher {
  matchIssueToProfile(issue: GithubIssue, profile: DeveloperProfile): MatchResult | null {
    const reasons: string[] = [];
    let score = 0;
    
    // Match based on repository language
    if (issue.repository.language && profile.skills.includes(issue.repository.language)) {
      score += 30;
      reasons.push(`Repository uses ${issue.repository.language}, which is in your skills`);
    }
    
    // Match based on labels
    const issueLabels = issue.labels.map(label => label.name.toLowerCase());
    const matchedLabels = issueLabels.filter(label => 
      profile.interests.some(interest => 
        label.includes(interest.toLowerCase()) || interest.toLowerCase().includes(label)
      )
    );
    
    if (matchedLabels.length > 0) {
      score += matchedLabels.length * 20;
      reasons.push(`Issue has labels (${matchedLabels.join(", ")}) that match your interests`);
    }
    
    // Match based on repository topics
    if (issue.repository.topics) {
      const matchedTopics = issue.repository.topics.filter(topic =>
        profile.interests.some(interest =>
          topic.includes(interest.toLowerCase()) || interest.toLowerCase().includes(topic)
        )
      );
      
      if (matchedTopics.length > 0) {
        score += matchedTopics.length * 15;
        reasons.push(`Repository has topics (${matchedTopics.join(", ")}) that match your interests`);
      }
    }
    
    // Match based on issue title and description keywords
    const interestKeywords = profile.interests.flatMap(interest => interest.toLowerCase().split(" "));
    const titleMatches = interestKeywords.filter(keyword => 
      issue.title.toLowerCase().includes(keyword)
    );
    
    if (titleMatches.length > 0) {
      score += titleMatches.length * 10;
      reasons.push(`Issue title contains keywords related to your interests`);
    }
    
    // Check body for keyword matches if it exists
    if (issue.body) {
      const bodyMatches = interestKeywords.filter(keyword =>
        issue.body!.toLowerCase().includes(keyword)
      );
      
      if (bodyMatches.length > 0) {
        score += bodyMatches.length * 5;
        reasons.push(`Issue description contains keywords related to your interests`);
      }
    }
    
    // Check experience level appropriateness
    if (profile.experienceLevel === "beginner") {
      // Beginners get bonus points for "good first issue" labels
      if (issueLabels.includes("good first issue") || issueLabels.includes("good-first-issue")) {
        score += 40;
        reasons.push(`Issue is explicitly labeled as "good first issue", perfect for your experience level`);
      }
    }
    
    // Return null if the score is too low
    if (score < 30) {
      return null;
    }
    
    return {
      issue,
      score,
      reasons,
    };
  }
  
  findMatchesForProfile(issues: GithubIssue[], profile: DeveloperProfile, limit = 5): MatchResult[] {
    const matches = issues
      .map(issue => this.matchIssueToProfile(issue, profile))
      .filter((result): result is MatchResult => result !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return matches;
  }
}

export const issueMatcher = new IssueMatcher();
