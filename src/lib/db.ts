
import { z } from "zod";

// Define the schema for developer profiles
export const DeveloperProfileSchema = z.object({
  email: z.string().email(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

export type DeveloperProfile = z.infer<typeof DeveloperProfileSchema>;

// Mock database for developer profiles (in a real app, this would use SQLite)
class ProfileDatabase {
  private profiles: Map<string, DeveloperProfile> = new Map();

  constructor() {
    // Load any saved profiles from localStorage
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedProfiles = localStorage.getItem("developer_profiles");
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles) as [string, DeveloperProfile][];
        this.profiles = new Map(parsedProfiles);
      }
    } catch (error) {
      console.error("Failed to load profiles from storage:", error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(
        "developer_profiles",
        JSON.stringify(Array.from(this.profiles.entries()))
      );
    } catch (error) {
      console.error("Failed to save profiles to storage:", error);
    }
  }

  getProfile(email: string): DeveloperProfile | undefined {
    return this.profiles.get(email);
  }

  getAllProfiles(): DeveloperProfile[] {
    return Array.from(this.profiles.values());
  }

  saveProfile(profile: DeveloperProfile): void {
    this.profiles.set(profile.email, profile);
    this.saveToStorage();
  }

  deleteProfile(email: string): boolean {
    const result = this.profiles.delete(email);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  // For testing purposes
  addSampleProfiles() {
    const samples: DeveloperProfile[] = [
      {
        email: "dev1@example.com",
        skills: ["JavaScript", "React", "TypeScript"],
        interests: ["web development", "UI/UX"],
        experienceLevel: "intermediate",
      },
      {
        email: "dev2@example.com",
        skills: ["Python", "Django", "JavaScript"],
        interests: ["backend", "data science"],
        experienceLevel: "beginner",
      },
      {
        email: "dev3@example.com",
        skills: ["Go", "Rust", "C++"],
        interests: ["systems", "performance"],
        experienceLevel: "advanced",
      },
    ];

    samples.forEach((profile) => this.saveProfile(profile));
  }
}

// Create a singleton instance
export const profileDB = new ProfileDatabase();
