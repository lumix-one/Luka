import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { SettingsModal } from "./SettingsModal";
import { WelcomeScreen } from "./WelcomeScreen";
import { FloatingBubbles } from "./FloatingBubbles";
import { QuickActions } from "./QuickActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userService, User, Conversation, Message } from "@/services/userService";
import { apiService } from "@/services/apiService";
import { Toaster } from "@/components/ui/toaster";

export function ChatInterface() {
  const [user, setUser] = useState<User | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    
    // Apply theme
    const root = document.documentElement;
    if (currentUser.settings.theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else if (currentUser.settings.theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      // Auto mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const handleSendMessage = async (content: string, image?: File) => {
    if (!user) return;

    // Create new conversation if none exists
    let conversation = currentConversation;
    if (!conversation) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      conversation = userService.createNewConversation(user, title);
      setCurrentConversation(conversation);
    }

    let messageContent = content;
    let messageType: 'text' | 'image' = 'text';

    // Handle image upload
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      messageContent = imageUrl;
      messageType = 'image';
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      type: messageType
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Determine request type
    const isImageRequest = content.toLowerCase().includes('image') || 
                          content.toLowerCase().includes('photo') || 
                          content.toLowerCase().includes('dessine') ||
                          content.toLowerCase().includes('crée une image') ||
                          content.toLowerCase().includes('génère une image');

    const isQRRequest = content.toLowerCase().includes('qr') || 
                       content.toLowerCase().includes('code qr') ||
                       content.toLowerCase().includes('qr code');

    try {
      let botResponse: Message;

      if (isQRRequest && !image) {
        // Ask for QR content if not specified
        if (!content.includes(':') && !content.includes('=')) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: "Pour générer un QR code, dites-moi ce que vous voulez encoder. Par exemple : 'QR code: https://www.example.com' ou 'QR code: Mon message secret'",
            isBot: true,
            timestamp: new Date().toLocaleTimeString(),
            type: 'text'
          };
        } else {
          // Extract content after : or =
          const qrContent = content.split(/[:=]/)[1]?.trim() || content;
          const qrUrl = apiService.generateQRCodeUrl(qrContent);
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: qrUrl,
            isBot: true,
            timestamp: new Date().toLocaleTimeString(),
            type: 'image'
          };
        }
      } else if (isImageRequest && !image) {
        const imageUrl = apiService.generateImageUrl(content);
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: imageUrl,
          isBot: true,
          timestamp: new Date().toLocaleTimeString(),
          type: 'image'
        };
      } else {
        // Préparer l'historique des messages pour l'API (limiter aux 10 derniers messages pour éviter les requêtes trop longues)
        const conversationHistory = messages.slice(-10).map(msg => ({
          content: msg.content,
          isBot: msg.isBot
        }));

        const response = await apiService.generateTextResponse(content, conversationHistory);
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: response,
          isBot: true,
          timestamp: new Date().toLocaleTimeString(),
          type: 'text'
        };
      }

      const finalMessages = [...newMessages, botResponse];
      setMessages(finalMessages);
      userService.updateConversation(user, conversation.id, finalMessages);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = async (messageIndex: number) => {
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage && !previousUserMessage.isBot) {
        await handleSendMessage(previousUserMessage.content);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversation(null);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
    setSidebarOpen(false);
  };

  const handleSettingsUpdate = (newSettings: any) => {
    if (user) {
      userService.updateUserSettings(user, newSettings);
      setUser({ ...user, settings: { ...user.settings, ...newSettings } });
    }
  };

  const handleProfileUpdate = (name: string, profileImage?: string) => {
    if (user) {
      userService.updateUserProfile(user, name, profileImage);
      setUser({ ...user, name, profileImage });
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <>
      <FloatingBubbles />
      <div className="h-screen bg-background flex flex-col relative overflow-hidden">
        <ChatHeader 
          onMenuClick={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden pb-28">
          {messages.length === 0 ? (
            <>
              <WelcomeScreen />
              <QuickActions onActionClick={handleSendMessage} />
            </>
          ) : (
            <ScrollArea className="flex-1 smooth-scroll">
              <div className="space-y-4 p-2">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                    type={message.type}
                    onRetry={() => handleRetryMessage(index)}
                    userName={user.name}
                    userImage={user.profileImage}
                  />
                ))}
                {isLoading && (
                  <ChatMessage
                    message="Je réfléchis..."
                    isBot={true}
                    timestamp={new Date().toLocaleTimeString()}
                    userName={user.name}
                    userImage={user.profileImage}
                  />
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

        <ChatSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSettingsClick={() => {
            setSidebarOpen(false);
            setSettingsOpen(true);
          }}
          conversations={user.conversations}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />

        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          user={user}
          onSettingsUpdate={handleSettingsUpdate}
          onProfileUpdate={handleProfileUpdate}
          onClearHistory={() => {
            userService.clearAllConversations(user);
            setMessages([]);
            setCurrentConversation(null);
            setUser({ ...user, conversations: [] });
          }}
        />
      </div>
      <Toaster />
    </>
  );
}
