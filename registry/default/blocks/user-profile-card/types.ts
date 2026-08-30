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

export type BannerEffect = 
  | 'none' 
  | 'nebula' 
  | 'matrix' 
  | 'gold_dust' 
  | 'sakura' 
  | 'frostbite' 
  | 'lightning'
  | 'retrowave_grid'
  | 'hyperdrive_stars';

export type ProfileEffect = 
  | 'none' 
  | 'magic_spells' 
  | 'autumn_leaves' 
  | 'neon_glitch' 
  | 'dragon_fire' 
  | 'sakura_breeze'
  | 'cyber_matrix_stream'
  | 'cosmic_void'
  | 'lightning_surge'
  | 'hypesquad_explosion'
  | 'retrowave_sunset';

export type ProfileTheme = 'blurple' | 'nitro_pink' | 'cyber_emerald' | 'solar_gold' | 'midnight_obsidian' | 'synthwave_neon';

export type NitroLevel = 'none' | 'level1' | 'level2' | 'level3';

export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

export type ProfileTab = 'posts' | 'media' | 'collectibles' | 'likes' | 'soundboard' | 'subscription' | 'server_preview';

export type ProfileContext = 'global' | 'server';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  badge: string;
  color: string;
  features: string[];
  recommended?: boolean;
}

export interface ProfileBadge {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
  animatedGradient?: boolean;
}

export interface ServerRole {
  id: string;
  name: string;
  colorGradient: string;
  animated: boolean;
}

export interface UserProfileStats {
  followers: number;
  likes: number;
  mediaCount: number;
  postsCount: number;
  boostCount: number;
  nextLevelBoosts: number;
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

export interface NitroSound {
  id: string;
  name: string;
  emoji: string;
  freq: number;
  category: 'Meme' | 'Gaming' | 'Nitro Special';
  lockedForFree?: boolean;
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
  animatedAvatar?: string;
  banner: string;
  animatedBanner?: string;
  bio: string;
  location?: string;
  customStatus?: string;
  customStatusEmoji?: string;
  vanityUrl?: string;
  themeColor: string;
  profileTheme: ProfileTheme;
  avatarDecoration: AvatarDecoration;
  bannerEffect: BannerEffect;
  profileEffect: ProfileEffect;
  nitroLevel: NitroLevel;
  subscriptionTier: SubscriptionTier;
  badges: ProfileBadge[];
  stats: UserProfileStats;
  // Server-Specific Profile Overrides
  serverName?: string;
  serverIcon?: string;
  animatedServerIcon?: string;
  serverAvatar?: string;
  serverBanner?: string;
  animatedServerBanner?: string;
  serverNickname?: string;
  serverRoles?: ServerRole[];
}

export interface UserProfileCardProps {
  initialProfile?: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
}
