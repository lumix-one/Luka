
import { X, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/services/userService";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ 
  isOpen, 
  onClose, 
  onSettingsClick, 
  conversations, 
  onConversationSelect, 
  onNewChat 
}: ChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass-effect">
      <div className="w-80 h-full bg-background border-r border-border flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start space-x-2" onClick={onNewChat}>
            <MessageSquare className="h-4 w-4" />
            <span>Nouveau chat</span>
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-4">
            <div className="text-sm text-muted-foreground mb-2">Conversations</div>
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant="ghost"
                className="w-full justify-start space-x-2 text-left"
                onClick={() => onConversationSelect(conv)}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{conv.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-2"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
