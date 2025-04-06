
import React from "react";
import { MatchResult } from "@/lib/matcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Calendar } from "lucide-react";

interface ProfileIssueMatchesProps {
  matches: MatchResult[];
}

const ProfileIssueMatches: React.FC<ProfileIssueMatchesProps> = ({ matches }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium text-ideathon-gold">Best Matching Issues For You</h3>
      {matches.map((match) => (
        <Card key={match.issue.id} className="border-l-4 border-l-ideathon-gold bg-ideathon-darkBlue hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">
                <a 
                  href={match.issue.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline hover:text-ideathon-gold"
                >
                  {match.issue.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Created: {formatDate(match.issue.created_at)}</span>
              </div>
            </div>
            <CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  Repository: <a 
                    href={match.issue.repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-ideathon-gold"
                  >
                    {match.issue.repository.full_name}
                  </a>
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-ideathon-gold mr-1" />
                  <span className="text-sm font-medium text-ideathon-gold">{match.score} points match</span>
                </div>
              </div>
              {match.issue.repository.language && (
                <span className="mt-1 inline-block">
                  <Badge variant="outline" className="bg-ideathon-darkBlue/50 border-ideathon-gold/30 text-white">
                    {match.issue.repository.language}
                  </Badge>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {match.issue.labels.map((label) => (
                  <Badge key={label.name} variant="secondary" className="bg-ideathon-darkBlue text-ideathon-gold border border-ideathon-gold/30">
                    {label.name}
                  </Badge>
                ))}
              </div>
              
              {match.issue.body && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {match.issue.body}
                </p>
              )}
              
              <div className="bg-ideathon-navy/50 p-2 rounded-sm mt-1 border border-ideathon-gold/20">
                <p className="text-xs font-medium mb-1 text-ideathon-gold">Why this matches your profile:</p>
                <ul className="text-xs text-muted-foreground pl-4 list-disc">
                  {match.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileIssueMatches;
