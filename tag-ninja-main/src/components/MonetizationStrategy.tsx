import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Check, X, TrendingUp, Users, DollarSign } from "lucide-react";

const MonetizationStrategy = () => {
  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "10 daily suggestions",
        "Basic tag generation",
        "5 title templates",
        "Limited trending data",
        "Basic export (TXT only)"
      ],
      limitations: [
        "No advanced analytics",
        "No custom templates",
        "No priority support",
        "Limited API access"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro Monthly",
      price: "$9",
      period: "per month",
      description: "For serious content creators",
      features: [
        "Unlimited suggestions",
        "Advanced SEO analysis",
        "50+ title templates",
        "Real-time trending data",
        "Full export options (CSV, JSON, TXT)",
        "Custom template creation",
        "Analytics dashboard",
        "Priority support"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Pro Lifetime",
      price: "$49",
      period: "one-time",
      description: "Best value for long-term users",
      features: [
        "Everything in Pro Monthly",
        "Lifetime updates",
        "No recurring fees",
        "Early access to new features",
        "Exclusive creator community",
        "1-on-1 onboarding call"
      ],
      limitations: [],
      cta: "Get Lifetime Access",
      popular: false
    }
  ];

  const revenueProjections = [
    { month: "Month 1", free: 100, pro: 5, revenue: 45 },
    { month: "Month 3", free: 500, pro: 25, revenue: 225 },
    { month: "Month 6", free: 1200, pro: 120, revenue: 1080 },
    { month: "Month 12", free: 3000, pro: 500, revenue: 4500 },
  ];

  const marketingChannels = [
    {
      channel: "Product Hunt Launch",
      cost: "$0",
      expectedUsers: "500-1000",
      conversionRate: "3-5%",
      roi: "High"
    },
    {
      channel: "YouTube Creator Communities",
      cost: "$0-200",
      expectedUsers: "1000-2000",
      conversionRate: "5-8%",
      roi: "High"
    },
    {
      channel: "LinkedIn Creator Groups",
      cost: "$0-100",
      expectedUsers: "300-800",
      conversionRate: "8-12%",
      roi: "Medium"
    },
    {
      channel: "Chrome Web Store SEO",
      cost: "$0",
      expectedUsers: "200-500/month",
      conversionRate: "2-4%",
      roi: "Medium"
    },
    {
      channel: "Content Creator Partnerships",
      cost: "$500-2000",
      expectedUsers: "2000-5000",
      conversionRate: "6-10%",
      roi: "High"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Pricing Strategy */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Pricing Strategy
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`relative bg-gradient-card border-border ${tier.popular ? 'border-creator-primary shadow-glow' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground ml-1">/{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-creator-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {tier.limitations.map((limitation, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${tier.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Revenue Projections */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Revenue Projections
        </h2>
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-creator-primary" />
              Growth Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueProjections.map((projection, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-6">
                    <div className="text-sm font-medium w-20">{projection.month}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Free: </span>
                        <span className="font-medium">{projection.free}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Pro: </span>
                        <span className="font-medium text-creator-primary">{projection.pro}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-creator-success" />
                    <span className="font-bold text-creator-success">${projection.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Channels */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Marketing Strategy
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {marketingChannels.map((channel, index) => (
            <Card key={index} className="bg-gradient-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-creator-primary" />
                  {channel.channel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cost: </span>
                    <span className="font-medium">{channel.cost}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Users: </span>
                    <span className="font-medium">{channel.expectedUsers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conversion: </span>
                    <span className="font-medium">{channel.conversionRate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROI: </span>
                    <Badge 
                      variant="outline" 
                      className={
                        channel.roi === "High" ? "text-creator-success border-creator-success" :
                        channel.roi === "Medium" ? "text-creator-warning border-creator-warning" :
                        "text-muted-foreground border-muted"
                      }
                    >
                      {channel.roi}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation Timeline */}
      <div>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Monetization Implementation
        </h2>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-creator-primary flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Setup Payment Infrastructure</h3>
                  <p className="text-sm text-muted-foreground">Integrate Stripe for subscriptions, implement usage tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-creator-primary flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Implement Tier Logic</h3>
                  <p className="text-sm text-muted-foreground">Add daily limits, feature gates, and upgrade prompts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-creator-primary flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Launch Freemium Model</h3>
                  <p className="text-sm text-muted-foreground">Start with free tier to build user base, then introduce Pro features</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-creator-primary flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h3 className="font-semibold">Analytics & Optimization</h3>
                  <p className="text-sm text-muted-foreground">Track conversion rates, optimize pricing, A/B test features</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonetizationStrategy;