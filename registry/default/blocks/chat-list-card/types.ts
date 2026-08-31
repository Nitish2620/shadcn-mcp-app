export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

export type AppTheme = 
  | 'midnight_purple' 
  | 'synthwave_cyan' 
  | 'crimson_red' 
  | 'solar_amber' 
  | 'emerald_matrix' 
  | 'sakura_pink';

export type StreamQuality = '480p' | '720p_60fps' | '1080p_60fps' | '4k_source';

export type AvatarDecoration = 
  | 'none' 
  | 'anime_power_aura' 
  | 'cyber_hacker_void' 
  | 'celestial_orbit' 
  | 'phoenix_flame' 
  | 'gold_crown'
  | 'solar_flare';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  isSuperReaction?: boolean;
  superReactionType?: 'hype' | 'fire' | 'heart' | 'matrix' | 'sakura';
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: 'image' | 'file' | 'soundboard' | 'sticker';
  size?: string;
  soundFreq?: number;
  soundEmoji?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  animatedAvatar?: string;
  avatarDecoration?: AvatarDecoration;
  text: string;
  timestamp: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  attachment?: MessageAttachment;
  isNitroSticker?: boolean;
  isNitroSoundboard?: boolean;
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  animatedAvatar?: string;
  avatarDecoration?: AvatarDecoration;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  statusText?: string;
  messages: Message[];
}

export interface ChatListCardProps {
  title?: string;
  chats?: ChatItem[];
  initialSubscriptionTier?: SubscriptionTier;
  initialTheme?: AppTheme;
  onSelectChat?: (chat: ChatItem) => void;
  onNewChat?: () => void;
}
