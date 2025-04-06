
import React from "react";
import { Button } from "@/components/ui/button";
import { profileDB } from "@/lib/db";
import { toast } from "sonner";
import { Github, Search, RefreshCw, Lightbulb } from "lucide-react";
import { githubApi } from "@/lib/github-api";
import { useQueryClient } from "@tanstack/react-query";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  
  const addSampleData = () => {
    profileDB.addSampleProfiles();
    toast.success("Sample profiles added successfully");
    // Refresh the page to show the new profiles
    window.location.reload();
  };
  
  const scanGitHub = async () => {
    toast.loading("Scanning GitHub for new issues...");
    
    try {
      // Fetch new issues and invalidate the cache
      await queryClient.invalidateQueries({ queryKey: ['githubIssues'] });
      toast.success("GitHub scan complete! Issues matched to profiles.");
    } catch (error) {
      console.error("Error scanning GitHub:", error);
      toast.error("Failed to scan GitHub");
    }
  };
  
  return (
    <header className="bg-contribution-purple text-white p-4 sm:p-6 relative overflow-hidden shadow-md">
      <div className="absolute inset-0 geometric-pattern opacity-10"></div>
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-white animate-pulse mr-2" />
              <h1 className="text-2xl font-bold flex items-center">
                <span className="text-white">Open-Source</span> 
                <span className="text-white ml-2">Contribution Finder</span>
              </h1>
            </div>
            <div className="text-sm text-white/80 mt-1 flex items-center">
              <Search className="h-3 w-3 mr-1" />
              <p>Automatically scans GitHub repositories for "good first issues" and matches them to your profile</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-contribution-purple flex items-center"
              onClick={scanGitHub}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan GitHub
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-contribution-purple" 
              onClick={addSampleData}
            >
              Add Sample Profiles
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
