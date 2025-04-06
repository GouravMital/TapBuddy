
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeveloperProfileSchema, profileDB } from "@/lib/db";
import { X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  skill: z.string().optional(),
  interest: z.string().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  onProfileCreated: () => void;
}

const ProfileForm = ({ onProfileCreated }: ProfileFormProps) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      skill: "",
      interest: "",
      experienceLevel: "beginner",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }
    
    if (interests.length === 0) {
      toast.error("Please add at least one interest");
      return;
    }
    
    try {
      const profile = DeveloperProfileSchema.parse({
        email: data.email,
        skills,
        interests,
        experienceLevel: data.experienceLevel,
      });
      
      profileDB.saveProfile(profile);
      toast.success("Profile created successfully!");
      onProfileCreated();
      
      // Reset form
      form.reset();
      setSkills([]);
      setInterests([]);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };
  
  const addSkill = () => {
    const skill = form.getValues("skill");
    if (!skill) return;
    
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    form.setValue("skill", "");
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const addInterest = () => {
    const interest = form.getValues("interest");
    if (!interest) return;
    
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
    form.setValue("interest", "");
  };
  
  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Developer Profile</CardTitle>
        <CardDescription>
          Fill in your details to get matched with open-source issues that suit your skills and interests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll use this to send you matching issues.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="e.g. JavaScript, Python"
                    {...form.register("skill")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <FormDescription>
                  Add programming languages and technologies you know.
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1 px-2">
                      {skill}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </div>
            
            <div>
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="e.g. web development, documentation"
                    {...form.register("interest")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                  <Button type="button" onClick={addInterest}>Add</Button>
                </div>
                <FormDescription>
                  Add areas of interest for contribution.
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-sm py-1 px-2">
                      {interest}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </div>
            
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Experience Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="beginner" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Beginner
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermediate" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Intermediate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="advanced" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Advanced
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Create Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
