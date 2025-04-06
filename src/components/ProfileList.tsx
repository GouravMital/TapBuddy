
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeveloperProfile, profileDB } from "@/lib/db";
import { GithubIssue, githubApi } from "@/lib/github-api";
import { MatchResult, issueMatcher } from "@/lib/matcher";
import { emailService } from "@/lib/email";
import { toast } from "sonner";
import { Mail, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileIssueMatches from "./ProfileIssueMatches";
import { useQuery } from "@tanstack/react-query";

const ProfileList: React.FC = () => {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [justScanned, setJustScanned] = useState(false);
  
  // Fetch profiles
  const { data: profiles = [], refetch: refetchProfiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => profileDB.getAllProfiles(),
  });
  
  // Fetch GitHub issues with React Query
  const { 
    data: issues = [], 
    isLoading: isLoadingIssues,
    refetch: refetchIssues,
    isSuccess: issuesLoaded
  } = useQuery({
    queryKey: ['githubIssues'],
    queryFn: async () => {
      const fetchedIssues = await githubApi.fetchGoodFirstIssues();
      return fetchedIssues;
    },
    // Refetch issues when component mounts or when invalidated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Generate matches
  const { data: matchesMap = new Map(), isLoading: isLoadingMatches, refetch: refetchMatches } = useQuery({
    queryKey: ['matches', profiles, issues],
    queryFn: () => {
      const profileMatches = new Map<string, MatchResult[]>();
      
      for (const profile of profiles) {
        const profileIssueMatches = issueMatcher.findMatchesForProfile(issues, profile);
        profileMatches.set(profile.email, profileIssueMatches);
      }
      
      return profileMatches;
    },
    enabled: issues.length > 0 && profiles.length > 0,
  });

  // Expand all profiles that have matches after a scan
  useEffect(() => {
    if (justScanned && !isLoadingMatches && matchesMap.size > 0) {
      const profilesWithMatches = Array.from(matchesMap.entries())
        .filter(([_, matches]) => matches.length > 0)
        .map(([email]) => email);
      
      setSelectedProfiles(profilesWithMatches);
      setJustScanned(false);
    }
  }, [justScanned, isLoadingMatches, matchesMap]);
  
  const deleteProfile = (email: string) => {
    profileDB.deleteProfile(email);
    refetchProfiles();
    toast.success("Profile deleted successfully");
    setSelectedProfiles(prevSelected => prevSelected.filter(e => e !== email));
  };

  const findMatches = async () => {
    toast.loading("Finding matching issues...");
    
    try {
      setJustScanned(true);
      // Refetch issues if needed
      await refetchIssues();
      // Then refetch matches
      await refetchMatches();
      toast.success("Found matches for all profiles");
    } catch (error) {
      console.error("Error finding matches:", error);
      toast.error("Failed to find matches. Please try again.");
      setJustScanned(false);
    }
  };

  const toggleProfile = (email: string) => {
    setSelectedProfiles(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  const sendEmail = async (profile: DeveloperProfile) => {
    const profileMatches = matchesMap.get(profile.email);
    if (!profileMatches || profileMatches.length === 0) {
      toast.error("No matches found for this profile");
      return;
    }

    try {
      toast.promise(
        emailService.sendMatchNotification(profile, profileMatches),
        {
          loading: `Sending email to ${profile.email}...`,
          success: `Email sent to ${profile.email}!`,
          error: `Failed to send email to ${profile.email}`,
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  if (profiles.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardContent>
          <p className="text-muted-foreground">No profiles created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Developer Profiles</h2>
        <Button 
          onClick={findMatches}
          disabled={isLoadingIssues || isLoadingMatches || profiles.length === 0}
          className="flex items-center"
        >
          {isLoadingIssues || isLoadingMatches ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Finding Matches...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Find Matches
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {profiles.map((profile) => {
          const profileMatches = matchesMap.get(profile.email) || [];
          const hasMatches = profileMatches.length > 0;
          const isSelected = selectedProfiles.includes(profile.email);
          
          return (
            <Card 
              key={profile.email} 
              className={`border transition-all duration-200 ${hasMatches ? "hover:border-github-blue" : ""} ${isSelected ? "border-github-blue" : ""}`}
            >
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleProfile(profile.email)}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div>
                      <CardTitle>{profile.email}</CardTitle>
                      <CardDescription>
                        {profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)} developer
                        {hasMatches && <span className="ml-2 text-github-green font-medium">{profileMatches.length} matches found!</span>}
                      </CardDescription>
                    </div>
                    {hasMatches && (
                      <div className="ml-2">
                        {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendEmail(profile);
                      }}
                      disabled={!profileMatches.length}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(profile.email);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4">
                      {isLoadingMatches ? (
                        <div className="space-y-2">
                          <Skeleton className="h-24 w-full" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      ) : profileMatches.length > 0 ? (
                        <ProfileIssueMatches matches={profileMatches} />
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">
                            No matches found. Click 'Find Matches' to search for issues.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileList;
