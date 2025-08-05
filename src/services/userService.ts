export interface User {
  id: string;
  name: string;
  profileImage?: string;
  conversations: Conversation[];
  settings: UserSettings;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  type?: 'text' | 'image';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  swipeGesture: boolean;
}

class UserService {
  private storageKey = 'luka-ai-user';

  generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUser(): User {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }

    // Create new user
    const newUser: User = {
      id: this.generateUserId(),
      name: 'Vous',
      conversations: [],
      settings: {
        theme: 'dark',
        swipeGesture: true
      }
    };

    this.saveUser(newUser);
    return newUser;
  }

  saveUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  updateUserProfile(user: User, name?: string, profileImage?: string): void {
    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    this.saveUser(user);
  }

  createNewConversation(user: User, title: string = 'Nouvelle conversation'): Conversation {
    const conversation: Conversation = {
      id: 'conv_' + Date.now(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    user.conversations.unshift(conversation);
    this.saveUser(user);
    return conversation;
  }

  updateConversation(user: User, conversationId: string, messages: Message[]): void {
    const conversation = user.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages = messages;
      conversation.updatedAt = new Date().toISOString();
      this.saveUser(user);
    }
  }

  updateUserSettings(user: User, settings: Partial<UserSettings>): void {
    user.settings = { ...user.settings, ...settings };
    this.saveUser(user);
  }

  clearAllConversations(user: User): void {
    user.conversations = [];
    this.saveUser(user);
  }
}

export const userService = new UserService();
