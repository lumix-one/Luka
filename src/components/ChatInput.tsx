
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Camera, Image, X, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedImage) && !disabled) {
      onSendMessage(message, selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setShowAttachments(false);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t border-border backdrop-blur-lg bg-background/90 z-50">
      {showAttachments && (
        <div className="mb-4 flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 hover:bg-primary/10 transition-colors duration-200"
            onClick={handleCameraCapture}
          >
            <Camera className="h-4 w-4" />
            <span>Caméra</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 hover:bg-primary/10 transition-colors duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4" />
            <span>Image</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-3 hover:scale-105 transition-transform duration-200"
            onClick={() => setShowAttachments(!showAttachments)}
          >
            {showAttachments ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1 relative">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Selected" 
                  className="max-w-20 h-16 object-cover rounded-xl border-2 border-border shadow-lg" 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive hover:bg-destructive/80 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Parlons !"
                className="min-h-[65px] max-h-[200px] resize-none bg-input/50 backdrop-blur-sm border-border rounded-2xl pr-24 py-4 transition-all duration-200 focus:border-primary/50"
                disabled={disabled}
              />
              <div className="absolute right-3 bottom-3 flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:scale-105 transition-transform duration-200 hover:bg-primary/20"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:scale-105 transition-transform duration-200 hover:bg-primary/20 disabled:opacity-50"
                  disabled={disabled || (!message.trim() && !selectedImage)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
