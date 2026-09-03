import type { UserProfileData } from '../user-profile-card/types';

export interface NitroCustomEmoji {
  id: string;
  name: string;
  url?: string;
  emoji: string;
  category: string;
  animated: boolean;
  isNitroOnly: boolean;
}

export interface NitroSoundClip {
  id: string;
  name: string;
  emoji: string;
  freq: number;
  isNitroOnly: boolean;
}

export type ChatThemeId = string;

export interface ChatTheme {
  id: ChatThemeId;
  name: string;
  background?: string;
  primary?: string;
  cardBg: string;
  gradient: string;
  textAccent: string;
  isNitroOnly: boolean;
}

export interface NitroSticker {
  id: string;
  name: string;
  url?: string;
  image: string;
  category: string;
  isNitroOnly: boolean;
}

export interface VoiceNote {
  duration: string;
  waveform: number[];
}


export type AvatarDecoration = 
  | 'none' 
  | 'crown' 
  | 'neon' 
  | 'sparkle' 
  | 'flame' 
  | 'diamond' 
  | 'sakura' 
  | 'matrix'
  | 'solar_flare'
  | 'galaxy_warp'
  | 'holographic_glitch'
  | 'anime_power_aura'
  | 'cyber_hacker_void'
  | 'celestial_orbit'
  | 'phoenix_flame';

export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

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
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: MessageReaction[];
  attachment?: MessageAttachment;
  isNitroClip?: boolean;
  soundClip?: NitroSoundClip;
  sticker?: NitroSticker;
  voiceNote?: VoiceNote;
  isNitroSuperReaction?: boolean;
  nitroCustomEmoji?: string;
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
  isNitroSubscriber?: boolean;
  nitroBadge?: string;
  statusText?: string;
  customStatusEmoji?: string;
  nitroTier?: SubscriptionTier;
  badge?: string;
  nameGradient?: string;
  messages: Message[];
}

export interface ChatListCardProps {
  title?: string;
  chats?: ChatItem[];
  subscriptionTier?: SubscriptionTier;
  profile?: UserProfileData;
  onSelectChat?: (chat: ChatItem) => void;
  onNewChat?: () => void;
  onSelectSubscription?: (tier: SubscriptionTier) => void;
  onSubscriptionChange?: (tier: SubscriptionTier) => void;
  instanceId?: string;
}
