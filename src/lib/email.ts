
import { DeveloperProfile } from "./db";
import { MatchResult } from "./matcher";

export class EmailService {
  async sendMatchNotification(profile: DeveloperProfile, matches: MatchResult[]): Promise<boolean> {
    // In a real app, this would use SMTP to send an actual email
    console.log(`Sending email to ${profile.email} with ${matches.length} matches`);
    
    // Log the email content for demonstration
    console.log("Email Content:");
    console.log("==============");
    console.log(`To: ${profile.email}`);
    console.log("Subject: New Open-Source Contribution Opportunities For You!");
    console.log("");
    console.log("Hello Developer,");
    console.log("");
    console.log("We've found some open source issues that match your skills and interests:");
    console.log("");
    
    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.issue.title}`);
      console.log(`   Repository: ${match.issue.repository.full_name}`);
      console.log(`   Language: ${match.issue.repository.language || "Not specified"}`);
      console.log(`   Why it matches: ${match.reasons.join("; ")}`);
      console.log(`   Link: ${match.issue.html_url}`);
      console.log("");
    });
    
    console.log("Happy coding!");
    console.log("The Open Source Contribution Finder Team");
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  }
}

export const emailService = new EmailService();
