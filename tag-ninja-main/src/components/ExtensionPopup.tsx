import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Heart, Youtube, Linkedin, TrendingUp, Star, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define a type for our trend items
type Trend = {
  keyword: string;
  trend: string;
  difficulty: "High" | "Medium" | "Low" | "Easy";
};

const ExtensionPopup = () => {
  const [activeTab, setActiveTab] = useState("tags");
  const [inputText, setInputText] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "linkedin">("youtube");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  
  const [tags, setTags] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch trends when the component mounts
  useEffect(() => {
    const fetchTrends = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/get-trends');
            if (!response.ok) throw new Error("Failed to fetch trends");
            const data = await response.json();
            setTrends(data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchTrends();
  }, []);


const handleGenerate = async () => {
    if (!inputText) {
      toast({ title: "Input required", description: "Please enter a topic to generate content.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTags([]);
    setTitles([]);

    try {
      const [tagsResponse, titlesResponse] = await Promise.all([
        fetch('http://localhost:3001/api/generate-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputText, platform }),
        }),
        fetch('http://localhost:3001/api/generate-titles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputText, platform }),
        }),
      ]);

      // *** FIX IS HERE: Check if responses are OK ***
      if (!tagsResponse.ok || !titlesResponse.ok) {
        // Try to get the error message from the backend
        const errorData = await tagsResponse.json().catch(() => ({ error: "An unknown error occurred on the server." }));
        throw new Error(errorData.error || "Failed to generate content from AI.");
      }

      const tagsData = await tagsResponse.json();
      const titlesData = await titlesResponse.json();
      
      // Ensure data is an array before setting it
      setTags(Array.isArray(tagsData) ? tagsData : []);
      setTitles(Array.isArray(titlesData) ? titlesData : []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Generation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard.", duration: 2000 });
  };

  const toggleSave = (item: string) => {
    setSavedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };
  
  const getDifficultyClass = (difficulty: Trend['difficulty']) => {
    switch(difficulty) {
      case 'High': return 'text-destructive border-destructive';
      case 'Medium': return 'text-creator-warning border-creator-warning';
      default: return 'text-creator-success border-creator-success';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 mb-2">
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      ));
    }

    if (error) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-destructive" />
                <p className="text-sm font-semibold">Generation Failed</p>
                <p className="text-xs">{error}</p>
            </div>
        );
    }
    
    return null; // Return null to let the TabsContent handle display
  };


  return (
    <div className="w-96 h-[500px] bg-background text-foreground rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Creator Assistant</h1>
          <div className="flex gap-2">
            <Button variant={platform === "youtube" ? "secondary" : "ghost"} size="icon" onClick={() => setPlatform("youtube")} className="h-8 w-8"> <Youtube className="w-4 h-4" /> </Button>
            <Button variant={platform === "linkedin" ? "secondary" : "ghost"} size="icon" onClick={() => setPlatform("linkedin")} className="h-8 w-8"> <Linkedin className="w-4 h-4" /> </Button>
          </div>
        </div>
        <div className="relative">
          <Textarea
            placeholder={`Enter a topic, like "AI productivity tools"...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/70 resize-none h-20 pr-28"
          />
          <Button onClick={handleGenerate} disabled={isLoading} className="absolute bottom-2 right-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? "..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-4 mx-auto mt-2 w-[calc(100%-1rem)]">
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <div className="px-2 pb-2 flex-1 overflow-auto mt-2">
            {isLoading || error ? renderContent() :
            <>
                <TabsContent value="tags" className="space-y-2">
                    {tags.length > 0 ? tags.map((tag, i) => (
                    <Card key={i} className="p-2 flex items-center justify-between group">
                        <span className="text-sm">{tag}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(tag)}><Copy className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleSave(tag)}><Heart className={`w-3.5 h-3.5 ${savedItems.includes(tag) ? 'fill-red-500 text-red-500' : ''}`} /></Button>
                        </div>
                    </Card>
                    )) : <p className="text-center text-sm text-muted-foreground pt-8">Generated tags will appear here.</p>}
                </TabsContent>

                <TabsContent value="titles" className="space-y-2">
                    {titles.length > 0 ? titles.map((title, i) => (
                    <Card key={i} className="p-2 flex items-center justify-between group">
                        <span className="text-sm">{title}</span>
                         <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(title)}><Copy className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleSave(title)}><Heart className={`w-3.5 h-3.5 ${savedItems.includes(title) ? 'fill-red-500 text-red-500' : ''}`} /></Button>
                        </div>
                    </Card>
                    )) : <p className="text-center text-sm text-muted-foreground pt-8">Generated titles will appear here.</p>}
                </TabsContent>

                <TabsContent value="trends" className="space-y-2">
                    {trends.map((item, i) => (
                    <Card key={i} className="p-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{item.keyword}</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getDifficultyClass(item.difficulty)}>{item.difficulty}</Badge>
                                <div className="flex items-center text-creator-success text-xs font-semibold">
                                    <TrendingUp className="w-3 h-3 mr-1" />{item.trend}
                                </div>
                            </div>
                        </div>
                    </Card>
                    ))}
                </TabsContent>

                <TabsContent value="saved" className="space-y-2">
                    {savedItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No saved items yet</p>
                    </div>
                    ) : (
                    savedItems.map((item, i) => (
                        <Card key={i} className="p-2 flex items-center justify-between group">
                            <span className="text-sm flex-1 truncate pr-2">{item}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(item)}><Copy className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleSave(item)}><Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /></Button>
                            </div>
                        </Card>
                    ))
                    )}
                </TabsContent>
            </>
            }
        </div>
      </Tabs>
    </div>
  );
};

export default ExtensionPopup;