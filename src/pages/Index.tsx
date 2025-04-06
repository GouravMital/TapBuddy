
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";
import { Lightbulb } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("profiles");
  
  const handleProfileCreated = () => {
    setActiveTab("profiles");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-ideathon-navy">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {/* Decorative elements similar to the reference image */}
        <div className="absolute top-6 left-6 h-16 w-16 border border-ideathon-gold/30 opacity-20"></div>
        <div className="absolute top-10 right-10 h-20 w-20 border border-ideathon-gold/30 rotate-45 opacity-20"></div>
        <div className="absolute bottom-10 left-20 h-12 w-12 bg-ideathon-gold/10 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-40 h-8 w-8 border border-ideathon-gold/30 opacity-20"></div>
        
        <section className="mb-8 text-center relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Lightbulb className="h-20 w-20 text-ideathon-gold animate-glow" />
              <div className="absolute inset-0 gold-glow"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Discover Open-Source Opportunities <span className="text-ideathon-gold">Tailored for You</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Create your developer profile, and we'll match you with "good first issues" from GitHub 
            that align with your skills and interests. Start contributing to open-source today!
          </p>
        </section>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-ideathon-darkBlue border border-ideathon-gold/30">
            <TabsTrigger 
              value="profiles" 
              className="data-[state=active]:bg-ideathon-gold data-[state=active]:text-ideathon-navy"
            >
              Your Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="data-[state=active]:bg-ideathon-gold data-[state=active]:text-ideathon-navy"
            >
              Create Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profiles">
            <div className="max-w-4xl mx-auto">
              <ProfileList />
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <div className="flex justify-center">
              <ProfileForm onProfileCreated={handleProfileCreated} />
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="mt-12 bg-ideathon-darkBlue rounded-lg p-6 max-w-4xl mx-auto border border-ideathon-gold/30 relative">
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-ideathon-gold/30"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-ideathon-gold/30"></div>
          
          <h3 className="text-xl font-semibold mb-4 text-ideathon-gold">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ideathon-navy p-4 rounded-md shadow-sm border border-ideathon-gold/20">
              <h4 className="text-lg font-medium text-ideathon-gold mb-2">1. Create Your Profile</h4>
              <p className="text-gray-400">
                Tell us about your skills, interests, and experience level to help us find the perfect issues for you.
              </p>
            </div>
            <div className="bg-ideathon-navy p-4 rounded-md shadow-sm border border-ideathon-gold/20">
              <h4 className="text-lg font-medium text-ideathon-gold mb-2">2. Find Matching Issues</h4>
              <p className="text-gray-400">
                We'll search GitHub for "good first issues" that match your profile and show you personalized recommendations.
              </p>
            </div>
            <div className="bg-ideathon-navy p-4 rounded-md shadow-sm border border-ideathon-gold/20">
              <h4 className="text-lg font-medium text-ideathon-gold mb-2">3. Start Contributing</h4>
              <p className="text-gray-400">
                Receive tailored issue notifications and start your open-source journey with confidence.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-ideathon-darkBlue text-gray-400 p-6 border-t border-ideathon-gold/30">
        <div className="container mx-auto text-center">
          <p>© 2024 Open-Source Contribution IDEATHON</p>
          <p className="text-sm mt-1">
            Built for developers, by developers. Not affiliated with GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
