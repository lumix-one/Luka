import { X, Moon, Sun, Palette, Smartphone, Trash2, Facebook, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserSettings } from "@/services/userService";
import { ProfileEditor } from "./ProfileEditor";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSettingsUpdate: (settings: Partial<UserSettings>) => void;
  onProfileUpdate: (name: string, profileImage?: string) => void;
  onClearHistory: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  user, 
  onSettingsUpdate, 
  onProfileUpdate,
  onClearHistory 
}: SettingsModalProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    onSettingsUpdate({ theme });
    
    // Apply theme immediately
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      // Auto mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  };

  const handleSwipeToggle = (swipeGesture: boolean) => {
    onSettingsUpdate({ swipeGesture });
  };

  const handleContactDeveloper = () => {
    window.open('https://www.facebook.com/Lukaryota45', '_blank');
  };

  const handleProfileSave = (name: string, profileImage?: string) => {
    onProfileUpdate(name, profileImage);
    setIsEditingProfile(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-lg border-border animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Paramètres
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Personnalisez votre expérience Luka AI
          </DialogDescription>
          <Button variant="ghost" size="sm" className="absolute left-4 top-4 hover:scale-110 transition-all duration-200" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {isEditingProfile ? (
            <ProfileEditor
              name={user.name}
              profileImage={user.profileImage}
              onSave={handleProfileSave}
              onCancel={() => setIsEditingProfile(false)}
            />
          ) : (
            <>
              {/* Profile Section */}
              <div className="text-center space-y-4 animate-fade-in">
                <Avatar className="w-20 h-20 mx-auto hover:scale-105 transition-all duration-300">
                  {user.profileImage ? (
                    <AvatarImage src={user.profileImage} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {user.name}
                  </h3>
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:scale-105"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Modifier le profil
                  </Button>
                </div>
              </div>
              
              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 backdrop-blur-sm rounded-xl hover:bg-secondary/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Palette className="h-4 w-4 text-white" />
                    </div>
                    <span>Apparence</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={user.settings.theme === 'light' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className="hover:scale-105 transition-all duration-200"
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={user.settings.theme === 'dark' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                      className="hover:scale-105 transition-all duration-200"
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={user.settings.theme === 'auto' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => handleThemeChange('auto')}
                      className="hover:scale-105 transition-all duration-200"
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/30 backdrop-blur-sm rounded-xl hover:bg-secondary/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <span>Gestuelle de glissement</span>
                  </div>
                  <Switch 
                    checked={user.settings.swipeGesture} 
                    onCheckedChange={handleSwipeToggle}
                  />
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 p-3 hover:bg-secondary/30 transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleContactDeveloper}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <span>Contacter le développeur</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 p-3 hover:bg-destructive/20 transition-all duration-300 hover:scale-[1.02]"
                  onClick={onClearHistory}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-white" />
                  </div>
                  <span>Effacer l'historique des discussions</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
