
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  ImageIcon, 
  BookOpen, 
  MessageCircle
} from "lucide-react";

interface QuickActionsProps {
  onActionClick: (prompt: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions = [
    {
      icon: Sparkles,
      title: "Créatif",
      description: "Histoires & poésie",
      prompt: "Écris-moi une histoire courte et créative",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: ImageIcon,
      title: "Image",
      description: "Génération d'images",
      prompt: "Crée une image d'un magnifique paysage de montagne",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Apprendre",
      description: "Cours & explications",
      prompt: "Explique-moi un concept scientifique intéressant",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "Discussion",
      description: "Chat libre",
      prompt: "Salut ! Comment puis-je t'aider aujourd'hui ?",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 pt-8">
          {actions.map((action, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
              onClick={() => onActionClick(action.prompt)}
            >
              <div className="p-6 space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
              
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
