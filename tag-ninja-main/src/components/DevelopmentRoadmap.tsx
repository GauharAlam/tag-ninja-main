import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, Zap } from "lucide-react";

const DevelopmentRoadmap = () => {
  const roadmapPhases = [
    {
      phase: "Week 1-2: Foundation",
      status: "completed",
      items: [
        "Chrome Extension Manifest V3 setup",
        "Basic popup UI with tabs (Tags | Titles | Trends | Saved)",
        "Hardcoded sample suggestions for testing",
        "One-click copy functionality",
        "Platform detection (YouTube/LinkedIn)"
      ]
    },
    {
      phase: "Week 3-4: Backend Integration",
      status: "in-progress",
      items: [
        "Node.js + Express backend setup",
        "MongoDB/Firebase database schema",
        "YouTube Data API integration",
        "Google Trends API connection",
        "Real-time suggestion generation"
      ]
    },
    {
      phase: "Week 5-6: User Experience",
      status: "planned",
      items: [
        "Save collections functionality",
        "Export/Import options (CSV, TXT)",
        "Dark mode toggle",
        "Quick preview of title/tags",
        "Keyboard shortcuts (Ctrl+Shift+Y)",
        "Offline mode with default templates"
      ]
    },
    {
      phase: "Week 7: Monetization",
      status: "planned",
      items: [
        "Free vs Pro tier logic implementation",
        "Usage limits and paywall",
        "Stripe payment integration",
        "Subscription management",
        "Chrome Web Store billing"
      ]
    },
    {
      phase: "Week 8: Launch",
      status: "planned",
      items: [
        "UI/UX polish and testing",
        "Beta testing with creators",
        "Chrome Web Store submission",
        "Product Hunt launch",
        "Creator community outreach"
      ]
    }
  ];

  const futureFeatures = [
    {
      title: "AI Content Generator",
      description: "Full video/post script generation",
      priority: "high",
      timeline: "3-6 months"
    },
    {
      title: "Competitor Analysis",
      description: "Analyze top videos/posts for trending tags",
      priority: "high",
      timeline: "6-9 months"
    },
    {
      title: "Multi-Platform Support",
      description: "TikTok, Instagram Reels, Twitter/X integration",
      priority: "medium",
      timeline: "9-12 months"
    },
    {
      title: "Analytics Dashboard",
      description: "Track saved tags, engagement insights",
      priority: "medium",
      timeline: "6-12 months"
    },
    {
      title: "Mobile App",
      description: "iOS/Android companion app",
      priority: "low",
      timeline: "12+ months"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-creator-success" />;
      case "in-progress":
        return <Zap className="w-5 h-5 text-creator-warning" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-creator-success border-creator-success";
      case "in-progress":
        return "text-creator-warning border-creator-warning";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive border-destructive";
      case "medium":
        return "text-creator-warning border-creator-warning";
      default:
        return "text-creator-success border-creator-success";
    }
  };

  return (
    <div className="space-y-8">
      {/* Development Roadmap */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Development Roadmap (MVP)
        </h2>
        <div className="space-y-4">
          {roadmapPhases.map((phase, index) => (
            <Card key={index} className="bg-gradient-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-3">
                    {getStatusIcon(phase.status)}
                    {phase.phase}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(phase.status)}>
                    {phase.status.charAt(0).toUpperCase() + phase.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-creator-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Future Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Scalable Roadmap (6-12 months)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {futureFeatures.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="w-4 h-4 text-creator-primary" />
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                    {feature.priority.charAt(0).toUpperCase() + feature.priority.slice(1)} Priority
                  </Badge>
                  <span className="text-xs text-muted-foreground">{feature.timeline}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Database Schema */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Suggested Database Schema
        </h2>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-creator-primary">Users Collection</h3>
                <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm">
                  <div className="text-muted-foreground">// MongoDB Schema</div>
                  <div className="mt-2 space-y-1">
                    <div><span className="text-creator-primary">_id:</span> ObjectId</div>
                    <div><span className="text-creator-primary">email:</span> String (unique)</div>
                    <div><span className="text-creator-primary">subscription:</span> "free" | "pro"</div>
                    <div><span className="text-creator-primary">dailyUsage:</span> Number</div>
                    <div><span className="text-creator-primary">resetDate:</span> Date</div>
                    <div><span className="text-creator-primary">createdAt:</span> Date</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-creator-primary">Saved Items Collection</h3>
                <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm">
                  <div className="mt-2 space-y-1">
                    <div><span className="text-creator-primary">_id:</span> ObjectId</div>
                    <div><span className="text-creator-primary">userId:</span> ObjectId</div>
                    <div><span className="text-creator-primary">type:</span> "tag" | "title" | "keyword"</div>
                    <div><span className="text-creator-primary">content:</span> String</div>
                    <div><span className="text-creator-primary">platform:</span> "youtube" | "linkedin"</div>
                    <div><span className="text-creator-primary">category:</span> String</div>
                    <div><span className="text-creator-primary">savedAt:</span> Date</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-creator-primary">Analytics Collection</h3>
                <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm">
                  <div className="mt-2 space-y-1">
                    <div><span className="text-creator-primary">_id:</span> ObjectId</div>
                    <div><span className="text-creator-primary">userId:</span> ObjectId</div>
                    <div><span className="text-creator-primary">action:</span> "copy" | "save" | "generate"</div>
                    <div><span className="text-creator-primary">itemType:</span> "tag" | "title" | "keyword"</div>
                    <div><span className="text-creator-primary">platform:</span> String</div>
                    <div><span className="text-creator-primary">timestamp:</span> Date</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentRoadmap;