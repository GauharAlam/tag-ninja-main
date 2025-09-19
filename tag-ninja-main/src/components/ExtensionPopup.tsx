import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Heart, Youtube, Linkedin, TrendingUp, Star, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExtensionPopup = () => {
  const [activeTab, setActiveTab] = useState("tags");
  const [inputText, setInputText] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "linkedin">("youtube");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const { toast } = useToast();

  // State for generated content
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded trending keywords for now
  const trendingKeywords = [
    { keyword: "AI content creation", trend: "+125%", difficulty: "Medium" },
    { keyword: "YouTube Shorts", trend: "+89%", difficulty: "High" },
    { keyword: "Creator monetization", trend: "+67%", difficulty: "Low" },
    { keyword: "LinkedIn personal brand", trend: "+54%", difficulty: "Medium" },
    { keyword: "Content automation", trend: "+43%", difficulty: "Easy" },
  ];

  const handleGenerate = async (type: 'titles' | 'tags') => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic or description first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    // Clear previous results for the active tab
    if (type === 'tags') setGeneratedTags([]);
    if (type === 'titles') setGeneratedTitles([]);


    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText, platform, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content.");
      }

      const data = await response.json();

      if (type === 'titles') {
        setGeneratedTitles(data.suggestions);
        setActiveTab('titles');
      } else if (type === 'tags') {
        // The backend returns a comma-separated string for tags
        const tagsArray = data.suggestions[0]?.split(',').map((tag: string) => tag.trim());
        setGeneratedTags(tagsArray || []);
        setActiveTab('tags');
      }

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Generation Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
      duration: 2000,
    });
  };

  const toggleSave = (item: string) => {
    if (savedItems.includes(item)) {
      setSavedItems(savedItems.filter(i => i !== item));
      toast({
        title: "Removed from saved",
        description: "Item removed from your collection",
      });
    } else {
      setSavedItems([...savedItems, item]);
      toast({
        title: "Saved!",
        description: "Item added to your collection",
      });
    }
  };

  return (
    <div className="w-96 h-[500px] bg-gradient-card border border-border rounded-lg shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Creator Assistant</h1>
          <div className="flex gap-2">
            <Button
              variant={platform === "youtube" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPlatform("youtube")}
              className="text-white border-white/30"
            >
              <Youtube className="w-4 h-4" />
            </Button>
            <Button
              variant={platform === "linkedin" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPlatform("linkedin")}
              className="text-white border-white/30"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Textarea
            placeholder={`Paste your ${platform === "youtube" ? "video title/description" : "LinkedIn post draft"} here...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/70 resize-none h-24 pr-24"
          />
          <Button
            onClick={() => handleGenerate(activeTab as 'tags' | 'titles')}
            disabled={isLoading}
            className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/30 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Generate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50 m-2">
          <TabsTrigger value="tags" className="text-xs">Tags</TabsTrigger>
          <TabsTrigger value="titles" className="text-xs">Titles</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
          <TabsTrigger value="saved" className="text-xs">Saved</TabsTrigger>
        </TabsList>

        <div className="px-2 pb-2 flex-1 overflow-auto">
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-destructive text-center">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">!</span>
              </div>
              <p className="font-semibold">Generation Failed</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {!error && (
            <>
              <TabsContent value="tags" className="h-full space-y-2">
                {generatedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {generatedTags.map((tag, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-creator-primary hover:text-white transition-colors text-xs"
                          onClick={() => copyToClipboard(tag)}
                        >
                          {tag}
                          <Copy className="w-3 h-3 ml-1" />
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSave(tag)}
                          className="p-1 h-auto"
                        >
                          <Heart
                            className={`w-3 h-3 ${savedItems.includes(tag) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Enter a topic and click Generate</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="titles" className="h-full space-y-2">
                {generatedTitles.length > 0 ? (
                  generatedTitles.map((template, i) => (
                    <Card key={i} className="p-3 cursor-pointer hover:bg-accent transition-colors group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm flex-1 leading-relaxed">{template}</p>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(template)}
                            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSave(template)}
                            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart
                              className={`w-3 h-3 ${savedItems.includes(template) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Enter a topic and click Generate</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}

          <TabsContent value="trends" className="h-full space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Trending keywords & topics
            </div>
            {trendingKeywords.map((item, i) => (
              <Card key={i} className="p-3 cursor-pointer hover:bg-accent transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.keyword}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-creator-success text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {item.trend}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${item.difficulty === "Easy" ? "text-creator-success border-creator-success" :
                          item.difficulty === "Medium" ? "text-creator-warning border-creator-warning" :
                            "text-destructive border-destructive"
                          }`}
                      >
                        {item.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.keyword)}
                      className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(item.keyword)}
                      className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={`w-3 h-3 ${savedItems.includes(item.keyword) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="saved" className="h-full space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Your saved collection ({savedItems.length})
            </div>
            {savedItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No saved items yet</p>
                <p className="text-xs">Click the heart icon to save items</p>
              </div>
            ) : (
              savedItems.map((item, i) => (
                <Card key={i} className="p-3 cursor-pointer hover:bg-accent transition-colors group">
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1 leading-relaxed">{item}</p>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item)}
                        className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(item)}
                        className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ExtensionPopup;