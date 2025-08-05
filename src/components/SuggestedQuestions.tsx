
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const questions = [
    "Raconte-moi une histoire courte",
    "Donne-moi une recette simple",
    "Crée une image d'un paysage",
    "Aide-moi avec mes devoirs"
  ];

  return (
    <div className="p-4">
      <Button
        variant="outline"
        className="w-full justify-between rounded-2xl bg-secondary border-border hover:bg-secondary/80 mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>Questions suggérées</span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left text-sm bg-secondary/50 hover:bg-secondary rounded-xl p-3"
              onClick={() => {
                onQuestionClick(question);
                setIsExpanded(false);
              }}
            >
              {question}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
