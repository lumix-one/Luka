
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Download, Clock, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
  type?: 'text' | 'image';
  onRetry?: () => void;
  userName?: string;
  userImage?: string;
}

export function ChatMessage({ 
  message, 
  isBot, 
  timestamp, 
  type = 'text', 
  onRetry,
  userName = "Vous",
  userImage
}: ChatMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Copié !",
        description: "Le texte a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte.",
        variant: "destructive",
      });
    }
  };

  const handleCodeCopy = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${index}`);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Code copié !",
        description: "Le code a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (type === 'image') {
      const link = document.createElement('a');
      link.href = message;
      link.download = `luka-ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Téléchargement lancé !",
        description: "L'image est en cours de téléchargement.",
      });
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      toast({
        title: "Regeneration...",
        description: "Je génère une nouvelle réponse.",
      });
    }
  };

  const formatMessageWithCode = (text: string) => {
    // Split by code blocks (```...```)
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim() || 'text';
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-border/50 w-full max-w-full">
            <div className="flex items-center justify-between bg-muted/50 px-3 sm:px-4 py-2 border-b border-border/30">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                {language}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/20 flex-shrink-0 ml-2"
                onClick={() => handleCodeCopy(code, index)}
              >
                {copiedCode === `${index}` ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-card/50 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm max-w-full">
                <code className="text-foreground font-mono leading-relaxed break-all sm:break-normal whitespace-pre-wrap sm:whitespace-pre">
                  {code}
                </code>
              </pre>
            </div>
          </div>
        );
      } else {
        // Regular text - also handle inline code (`...`)
        const inlineParts = part.split(/(`[^`]+`)/g);
        return (
          <span key={index}>
            {inlineParts.map((inlinePart, inlineIndex) => {
              if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
                return (
                  <code 
                    key={inlineIndex}
                    className="bg-muted/60 text-foreground px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-border/30 break-all"
                  >
                    {inlinePart.slice(1, -1)}
                  </code>
                );
              }
              return inlinePart;
            })}
          </span>
        );
      }
    });
  };

  return (
    <div className="flex space-x-2 sm:space-x-4 p-2 sm:p-4 hover:bg-white/5 transition-all duration-300 group animate-fade-in rounded-lg hover:shadow-lg max-w-full">
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 hover:scale-110 transition-all duration-200 flex-shrink-0">
        {isBot ? (
          <AvatarFallback className="gradient-premium text-white text-xs sm:text-sm">
            L
          </AvatarFallback>
        ) : userImage ? (
          <AvatarImage src={userImage} alt={userName} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs sm:text-sm">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 space-y-2 min-w-0 max-w-full overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-xs sm:text-sm bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {isBot ? "Luka AI" : userName}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity">
              <Clock className="h-3 w-3" />
              <span>{timestamp}</span>
            </span>
          )}
        </div>
        
        <div className="prose prose-invert max-w-none w-full overflow-hidden">
          {type === 'image' ? (
            <img 
              src={message} 
              alt="Generated image" 
              className="max-w-full h-auto rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300 border border-border/50" 
            />
          ) : (
            <div className="text-foreground leading-relaxed text-sm sm:text-base w-full overflow-hidden">
              {formatMessageWithCode(message)}
            </div>
          )}
        </div>
        
        {isBot && (
          <div className="flex items-center space-x-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:scale-110 transition-all duration-200 hover:bg-primary/20"
              onClick={handleCopy}
              title="Copier"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:scale-110 transition-all duration-200 hover:bg-primary/20"
              onClick={handleRetry}
              title="Réessayer"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            {type === 'image' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:scale-110 transition-all duration-200 hover:bg-primary/20"
                onClick={handleDownload}
                title="Télécharger"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
