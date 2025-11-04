export enum View {
  Feed = 'feed',
  Communities = 'communities',
  Create = 'create',
  Chat = 'chat',
  Profile = 'profile',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  nickname?: string;
  bio?: string;
  password?: string; // Added password field
  followers?: string[]; // Array of user IDs
  following?: string[]; // Array of user IDs
}

export interface Post {
  id: string;
  user: User;
  type: 'image' | 'video';
  contentUrl: string;
  caption: string;
  likes: number;
  comments: number;
}

export interface Story {
  id: string;
  user: User;
  contentUrl: string;
  type: 'image' | 'video';
  duration: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  members: number;
}

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: string;
    isSender: boolean;
}

export interface ChatConversation {
    id: string;
    user: User;
    lastMessage: string;
    lastMessageTime: string;
    messages: ChatMessage[];
}
