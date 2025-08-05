
import { Menu, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "./AnimatedLogo";

interface ChatHeaderProps {
  onMenuClick: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onMenuClick, onNewChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/20 backdrop-blur-2xl bg-background/40 sticky top-0 z-50 shadow-xl transition-all duration-300 hover:bg-background/60 hover:backdrop-blur-3xl">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMenuClick}
        className="hover:scale-110 transition-transform duration-300 backdrop-blur-sm hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center space-x-3 bg-secondary/20 backdrop-blur-2xl rounded-full px-6 py-3 transition-all duration-300 hover:bg-secondary/40 border border-border/10 shadow-lg hover:shadow-xl">
        <AnimatedLogo size={36} />
        <span className="font-semibold text-xl text-foreground">
          Luka AI
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onNewChat}
        className="hover:scale-110 transition-transform duration-300 backdrop-blur-sm hover:bg-white/10"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </Button>
    </header>
  );
}
