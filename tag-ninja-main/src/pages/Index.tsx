import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExtensionPopup from "@/components/ExtensionPopup";
import DevelopmentRoadmap from "@/components/DevelopmentRoadmap";
import MonetizationStrategy from "@/components/MonetizationStrategy";
import { Chrome, Github, Star, Users, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("demo");

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Suggestions",
      description: "Get SEO-optimized tags and trending keywords instantly"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Trends",
      description: "Stay ahead with the latest trending topics and keywords"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Platform",
      description: "Works seamlessly with YouTube and LinkedIn"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Smart Collections",
      description: "Save and organize your favorite tags and templates"
    }
  ];

  const stats = [
    { label: "Time Saved", value: "5+ hours/week", icon: "⏰" },
    { label: "Content Ideas", value: "100+ templates", icon: "💡" },
    { label: "SEO Tags", value: "1000+ suggestions", icon: "🏷️" },
    { label: "Platforms", value: "YouTube + LinkedIn", icon: "🌐" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="inline-flex items-center gap-2 bg-white/10 text-white border-white/20 mb-6">
              <Chrome className="w-4 h-4" />
              Chrome Extension Prototype
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Creator Assistant
              <span className="block text-creator-secondary">for YouTube & LinkedIn</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Save 5+ hours per week with AI-powered content ideas, SEO tags, and trending keywords. 
              The ultimate Chrome extension for content creators who want to grow faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-creator">
                <Chrome className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything Creators Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop wasting time on manual research. Get AI-powered suggestions, trending topics, and SEO optimization in one click.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gradient-card border border-border hover:shadow-card transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="demo" className="text-sm sm:text-base">Live Demo</TabsTrigger>
            <TabsTrigger value="roadmap" className="text-sm sm:text-base">Roadmap</TabsTrigger>
            <TabsTrigger value="monetization" className="text-sm sm:text-base">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Interactive Chrome Extension Demo
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the full functionality of our Chrome extension. Switch between YouTube and LinkedIn modes, 
                generate tags, explore trending keywords, and save your favorites.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-lg rounded-lg" />
                <ExtensionPopup />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
            <DevelopmentRoadmap />
          </TabsContent>

          <TabsContent value="monetization">
            <MonetizationStrategy />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Ready to Build This Extension?</h3>
            <p className="text-muted-foreground mb-6">
              This prototype demonstrates the core functionality. The actual Chrome extension would follow the detailed roadmap above.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-primary">
                Start Development
              </Button>
              <Button variant="outline">
                Schedule Demo Call
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
