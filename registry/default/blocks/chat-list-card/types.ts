export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

export interface NitroCustomEmoji {
  id: string;
  name: string;
  emoji: string;
  category: string;
  animated?: boolean;
  isNitroOnly?: boolean;
}

export interface NitroSoundClip {
  id: string;
  name: string;
  emoji: string;
  freq: number;
  isNitroOnly?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  isSuperReaction?: boolean;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
  isNitroClip?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  attachment?: MessageAttachment;
  soundClip?: NitroSoundClip;
  isNitroSuperReaction?: boolean;
  nitroCustomEmoji?: string;
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  statusText?: string;
  nitroTier?: SubscriptionTier;
  badge?: string;
  avatarDecoration?: string;
  messages: Message[];
}

export interface ChatListCardProps {
  title?: string;
  chats?: ChatItem[];
  subscriptionTier?: SubscriptionTier;
  onSelectChat?: (chat: ChatItem) => void;
  onNewChat?: () => void;
  onSubscriptionChange?: (tier: SubscriptionTier) => void;
}
