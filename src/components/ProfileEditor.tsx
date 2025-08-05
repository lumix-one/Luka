
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Edit2, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface ProfileEditorProps {
  name: string;
  profileImage?: string;
  onSave: (name: string, profileImage?: string) => void;
  onCancel: () => void;
}

export function ProfileEditor({ name, profileImage, onSave, onCancel }: ProfileEditorProps) {
  const [newName, setNewName] = useState(name);
  const [newProfileImage, setNewProfileImage] = useState<string | undefined>(profileImage);
  const [imagePreview, setImagePreview] = useState<string | undefined>(profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "L'image doit faire moins de 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewProfileImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!newName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }
    onSave(newName.trim(), newProfileImage);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-24 h-24">
          <Avatar className="w-24 h-24 mx-auto hover:scale-105 transition-all duration-300">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                {newName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -bottom-1 -right-1 h-8 w-8 p-0 bg-primary hover:bg-primary/80 text-white rounded-full hover:scale-110 transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom d'utilisateur</label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Votre nom"
            className="text-center bg-secondary/50 border-border hover:bg-secondary/70 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex space-x-3 justify-center">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center space-x-2 hover:bg-secondary/50 transition-all duration-200"
        >
          <X className="h-4 w-4" />
          <span>Annuler</span>
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105"
        >
          <Save className="h-4 w-4" />
          <span>Sauvegarder</span>
        </Button>
      </div>
    </div>
  );
}
