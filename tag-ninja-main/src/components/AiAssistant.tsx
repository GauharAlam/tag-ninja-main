import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, Loader2, User, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/useTypewriter";

interface AiAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

// A separate component for the AI message to handle the typewriter effect
const AiMessage = ({ text }: { text: string }) => {
  const typedText = useTypewriter(text, 20);
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => <p className="text-prose-p" {...props} />,
      }}
    >
      {typedText}
    </ReactMarkdown>
  );
};

const welcomeMessage: Message = {
  id: 1,
  sender: 'ai',
  text: "Hello! I'm your Creator Assistant. How can I help you today?",
};

export function AiAssistant({ open, onOpenChange }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error('Failed to get response.');

      const data = await response.json();
      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md h-[500px] flex flex-col p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles /> AI Assistant
          </DialogTitle>
          <DialogDescription>
            Your personal content creation expert.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex items-start gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                  <div className={cn(
                    "p-3 rounded-lg max-w-[85%] prose prose-sm dark:prose-invert",
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}>
                    {msg.sender === 'ai' ? (
                      <AiMessage text={msg.text} />
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="text-primary-foreground" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                   {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  <div className="p-3 rounded-lg bg-muted flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="p-4 border-t bg-background">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              disabled={isLoading}
              className="pr-12"
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading} className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8">
              <CornerDownLeft className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}