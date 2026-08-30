export type AvatarDecoration = 'none' | 'crown' | 'neon' | 'sparkle' | 'flame' | 'diamond';

export type NitroLevel = 'none' | 'level1' | 'level2' | 'level3';

export type ProfileTab = 'posts' | 'media' | 'collectibles' | 'likes';

export interface ProfileBadge {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
}

export interface UserProfileStats {
  followers: number;
  likes: number;
  mediaCount: number;
  postsCount: number;
  boostCount: number;
}

export interface PostItem {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  mediaUrl?: string;
  isNitroClip?: boolean;
}

export interface NitroSticker {
  id: string;
  name: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Nitro Exclusive';
  animated?: boolean;
}

export interface UserProfileData {
  name: string;
  handle: string;
  verified?: boolean;
  avatar: string;
  banner: string;
  bio: string;
  location?: string;
  customStatus?: string;
  customStatusEmoji?: string;
  themeColor: string;
  avatarDecoration: AvatarDecoration;
  nitroLevel: NitroLevel;
  badges: ProfileBadge[];
  stats: UserProfileStats;
}

export interface UserProfileCardProps {
  initialProfile?: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
}
