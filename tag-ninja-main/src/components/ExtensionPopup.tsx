import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Heart, Youtube, Linkedin, TrendingUp, Star, Zap, Loader2, Download, Moon, Sun, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExtensionPopup = () => {
  const [activeTab, setActiveTab] = useState("tags");
  const [inputText, setInputText] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "linkedin">("youtube");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const { toast } = useToast();
  const [theme, setTheme] = useState("dark");

  const [generatedContent, setGeneratedContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
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
    setGeneratedContent({});

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content.");
      }

      const data = await response.json();
      setGeneratedContent(data);
      
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
  
  const downloadAs = (format: "csv" | "txt", content: string[]) => {
    const text = format === "csv" ? content.join(",") : content.join("\n");
    const blob = new Blob([text], { type: `text/${format}` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSave = (item: string) => {
    setSavedItems(savedItems.includes(item)
      ? savedItems.filter(i => i !== item)
      : [...savedItems, item]
    );
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className={`w-96 h-[500px] bg-background text-foreground border border-border rounded-lg shadow-lg overflow-hidden flex flex-col ${theme}`}>
      {/* Header */}
      <div className="bg-secondary p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Creator Assistant Logo" className="w-6 h-6" />
            <h1 className="text-lg font-bold">Creator Assistant</h1>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant={platform === "youtube" ? "default" : "ghost"} size="sm" onClick={() => setPlatform("youtube")}><Youtube className="w-4 h-4" /></Button>
            <Button variant={platform === "linkedin" ? "default" : "ghost"} size="sm" onClick={() => setPlatform("linkedin")}><Linkedin className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>{theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</Button>
          </div>
        </div>
        <div className="relative">
          <Textarea placeholder={`Paste your ${platform === "youtube" ? "video idea" : "post topic"} here...`} value={inputText} onChange={(e) => setInputText(e.target.value)} className="bg-background border-border resize-none h-24 pr-28" />
          <Button onClick={handleGenerate} disabled={isLoading} className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}Generate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 bg-muted m-2">
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <div className="px-2 pb-2 flex-1 overflow-auto">
          {error && <div className="text-destructive text-center p-4 flex flex-col items-center justify-center h-full"><AlertCircle className="w-12 h-12 mb-4" /><p className="font-semibold">Generation Failed</p><p className="text-xs">{error}</p></div>}
          
          {!error && !isLoading && !generatedContent.tags && (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center h-full">
              <Zap className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">Enter a topic and click Generate</p>
            </div>
          )}
          
          <TabsContent value="tags" className="h-full space-y-2">
            {generatedContent.tags?.length > 0 && <div className="flex justify-end gap-2"><Button size="sm" onClick={() => copyToClipboard(generatedContent.tags.join(", "))}>Copy All</Button><Button size="sm" onClick={() => downloadAs("txt", generatedContent.tags)}>.txt</Button><Button size="sm" onClick={() => downloadAs("csv", generatedContent.tags)}>.csv</Button></div>}
            <div className="flex flex-wrap gap-1">{generatedContent.tags?.map((tag: string, i: number) => <div key={i} className="flex items-center gap-1"><Badge variant="secondary" className="cursor-pointer" onClick={() => copyToClipboard(tag)}>{tag}</Badge><Button variant="ghost" size="sm" onClick={() => toggleSave(tag)} className="p-1 h-auto"><Heart className={`w-3 h-3 ${savedItems.includes(tag) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} /></Button></div>)}</div>
          </TabsContent>
          
          <TabsContent value="titles" className="h-full space-y-2">
            {generatedContent.titles?.length > 0 && <div className="flex justify-end gap-2"><Button size="sm" onClick={() => copyToClipboard(generatedContent.titles.join("\n"))}>Copy All</Button><Button size="sm" onClick={() => downloadAs("txt", generatedContent.titles)}>.txt</Button></div>}
            {generatedContent.titles?.map((title: string, i: number) => <Card key={i} className="p-3 group"><div className="flex items-start justify-between"><p className="text-sm flex-1">{title}</p><div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="sm" onClick={() => copyToClipboard(title)} className="p-1 h-auto"><Copy className="w-3 h-3" /></Button><Button variant="ghost" size="sm" onClick={() => toggleSave(title)} className="p-1 h-auto"><Heart className={`w-3 h-3 ${savedItems.includes(title) ? 'fill-red-500 text-red-500' : ''}`} /></Button></div></div></Card>)}
          </TabsContent>
          
          <TabsContent value="trends" className="h-full space-y-2">
            {generatedContent.trendingTopics?.map((item: string, i: number) => <Card key={i} className="p-3"><p className="text-sm font-medium">{item}</p></Card>)}
          </TabsContent>

          <TabsContent value="saved" className="h-full space-y-2">
            {savedItems.map((item, i) => <Card key={i} className="p-3 group"><div className="flex items-start justify-between"><p className="text-sm flex-1">{item}</p><div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="sm" onClick={() => copyToClipboard(item)} className="p-1 h-auto"><Copy className="w-3 h-3" /></Button><Button variant="ghost" size="sm" onClick={() => toggleSave(item)} className="p-1 h-auto"><Heart className="w-3 h-3 fill-red-500 text-red-500" /></Button></div></div></Card>)}
            {savedItems.length === 0 && <div className="text-center py-8 text-muted-foreground"><Star className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No saved items yet</p></div>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ExtensionPopup;