import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Image as ImageIcon, 
  Grid, 
  Settings, 
  Share2, 
  Edit3, 
  CheckCircle2, 
  Zap, 
  Crown, 
  Sparkles, 
  Flame, 
  Diamond, 
  MoreHorizontal, 
  Volume2, 
  VolumeX, 
  Plus, 
  Check, 
  X, 
  MessageSquare, 
  Eye,
  Globe,
  ShieldAlert,
  Music,
  Code2,
  Sparkle
} from 'lucide-react';
import type { 
  UserProfileData, 
  UserProfileCardProps, 
  AvatarDecoration, 
  BannerEffect, 
  NitroLevel, 
  ProfileTab, 
  ProfileContext, 
  PostItem, 
  NitroSticker, 
  NitroSound 
} from './types';

export type { UserProfileData, UserProfileCardProps, AvatarDecoration, BannerEffect, NitroLevel, ProfileTab, ProfileContext };

/* ========================================================
   INDEXEDDB AUTO-PERSISTENCE ENGINE FOR PROFILE CARD
======================================================== */
const DB_NAME = 'UserProfileCardDB';
const DB_VERSION = 1;
const STORE_PROFILE = 'profileData';

function openProfileDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PROFILE)) {
        db.createObjectStore(STORE_PROFILE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbSaveProfile(key: string, data: any) {
  try {
    const db = await openProfileDB();
    const tx = db.transaction(STORE_PROFILE, 'readwrite');
    tx.objectStore(STORE_PROFILE).put(data, key);
  } catch (err) {
    console.warn('Profile IndexedDB save skipped:', err);
  }
}

async function idbLoadProfile(key: string): Promise<any> {
  try {
    const db = await openProfileDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PROFILE, 'readonly');
      const req = tx.objectStore(STORE_PROFILE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/* ========================================================
   AVATAR DECORATION RENDERER (DISCORD NITRO FEATURE)
======================================================== */
const AvatarDecorationFrame = React.memo(({ decoration }: { decoration: AvatarDecoration }) => {
  if (decoration === 'none') return null;

  if (decoration === 'crown') {
    return (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
        <Crown className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
      </div>
    );
  }

  if (decoration === 'neon') {
    return (
      <div className="absolute -inset-2.5 rounded-full border-2 border-cyan-400 animate-spin z-10 pointer-events-none shadow-[0_0_18px_rgba(34,211,238,0.9)] opacity-90" style={{ animationDuration: '6s' }} />
    );
  }

  if (decoration === 'sparkle') {
    return (
      <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-70 blur-md animate-pulse z-0 pointer-events-none" />
    );
  }

  if (decoration === 'flame') {
    return (
      <div className="absolute -top-3 -right-2 z-20 pointer-events-none">
        <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-pulse drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]" />
      </div>
    );
  }

  if (decoration === 'diamond') {
    return (
      <div className="absolute -bottom-1 -right-1 z-20 pointer-events-none">
        <Diamond className="w-6 h-6 text-indigo-400 fill-indigo-400 drop-shadow-[0_0_12px_rgba(129,140,248,0.95)]" />
      </div>
    );
  }

  if (decoration === 'sakura') {
    return (
      <div className="absolute -inset-2 rounded-full border-2 border-pink-400 animate-pulse z-10 pointer-events-none shadow-[0_0_15px_rgba(244,114,182,0.8)] opacity-90" />
    );
  }

  if (decoration === 'matrix') {
    return (
      <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-spin z-10 pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.8)] opacity-90" style={{ animationDuration: '8s' }} />
    );
  }

  return null;
});
AvatarDecorationFrame.displayName = 'AvatarDecorationFrame';

/* ========================================================
   BANER EFFECT OVERLAY RENDERER (DISCORD NITRO FEATURE)
======================================================== */
const BannerEffectOverlay = React.memo(({ effect }: { effect: BannerEffect }) => {
  if (effect === 'none') return null;

  if (effect === 'nebula') {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-indigo-600/30 backdrop-blur-[1px] animate-pulse pointer-events-none z-10" />
    );
  }

  if (effect === 'matrix') {
    return (
      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        <div className="w-full h-full opacity-25 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] animate-pulse" />
      </div>
    );
  }

  if (effect === 'gold_dust') {
    return (
      <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        <div className="w-full h-full opacity-30 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px] animate-pulse" />
      </div>
    );
  }

  if (effect === 'sakura') {
    return (
      <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[1px] pointer-events-none z-10" />
    );
  }

  return null;
});
BannerEffectOverlay.displayName = 'BannerEffectOverlay';

/* ========================================================
   MAIN MNC DISCORD NITRO USER PROFILE CARD
======================================================== */
export function UserProfileCard({
  initialProfile = {
    name: 'ram verma',
    handle: '@ram',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'Full-stack AI systems architect & Discord Nitro Booster ✨ Building MNC-grade web apps with Next.js, Tailwind CSS & Radix UI primitives.',
    location: 'San Francisco, CA',
    customStatus: '🎮 Streaming Next.js + Radix UI Primitives',
    customStatusEmoji: '✨',
    vanityUrl: 'discord.gg/ram',
    themeColor: '#5865F2',
    avatarDecoration: 'neon',
    bannerEffect: 'nebula',
    nitroLevel: 'level3',
    badges: [
      { id: 'b1', name: 'Server Booster (Level 3)', iconName: 'Zap', color: 'text-pink-400 bg-pink-950/60 border-pink-500/40', description: 'Boosting servers since 2022' },
      { id: 'b2', name: 'Nitro Subscriber', iconName: 'Crown', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40', description: 'Discord Nitro Perks Active' },
      { id: 'b3', name: 'Early Supporter', iconName: 'Sparkles', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40', description: 'Early Nitro Supporter Badge' },
      { id: 'b4', name: 'Active Developer', iconName: 'ShieldCheck', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40', description: 'Verified Bot Developer' }
    ],
    stats: {
      followers: 24500,
      likes: 1200000,
      mediaCount: 842,
      postsCount: 156,
      boostCount: 12,
      nextLevelBoosts: 14
    },
    // Server Specific Profile
    serverName: 'Next.js MNC Guild 🛡️',
    serverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    serverBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    serverNickname: 'Ram [Lead Architect]',
    serverRoles: ['@Core Lead', '@MNC Architect', '@Nitro Booster']
  },
  onUpdateProfile
}: UserProfileCardProps) {
  // Profile State
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [profileContext, setProfileContext] = useState<ProfileContext>('global');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialProfile.stats.followers);
  const [likesCount, setLikesCount] = useState(initialProfile.stats.likes);
  const [boostCount, setBoostCount] = useState(initialProfile.stats.boostCount);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Super Reaction Burst Particles
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Settings Draft State
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editStatus, setEditStatus] = useState(profile.customStatus || '');
  const [editDecoration, setEditDecoration] = useState<AvatarDecoration>(profile.avatarDecoration);
  const [editBannerEffect, setEditBannerEffect] = useState<BannerEffect>(profile.bannerEffect);

  // Auto-Hydration from IndexedDB
  useEffect(() => {
    idbLoadProfile('userProfileState').then(stored => {
      if (stored) {
        setProfile(prev => ({ ...prev, ...stored }));
        if (stored.stats?.boostCount !== undefined) setBoostCount(stored.stats.boostCount);
        if (stored.stats?.likes !== undefined) setLikesCount(stored.stats.likes);
      }
    });
  }, []);

  // Auto-Save to IndexedDB
  useEffect(() => {
    const handler = setTimeout(() => {
      idbSaveProfile('userProfileState', {
        ...profile,
        stats: { ...profile.stats, boostCount, likes: likesCount }
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [profile, boostCount, likesCount]);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Web Audio Synthesizer Engine for Haptic Sound Effects
  const playHapticSound = useCallback((freq = 520, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }, [soundEnabled]);

  // Trigger Soundboard Audio Clips
  const playSoundboardClip = useCallback((sound: NitroSound) => {
    playHapticSound(sound.freq, 'triangle');
    showToast(`Played Soundboard: ${sound.emoji} ${sound.name}`);
  }, [playHapticSound, showToast]);

  // Super Reaction Particle Blast
  const triggerParticleBlast = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left + (Math.random() * 40 - 20),
      y: e.clientY - rect.top + (Math.random() * 40 - 20)
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Handle Nitro Super Boost
  const handleNitroBoost = useCallback((e: React.MouseEvent) => {
    playHapticSound(880, 'square');
    triggerParticleBlast(e);
    setBoostCount(b => b + 1);
    setLikesCount(l => l + 50);
    showToast('Nitro Super Boosted Level 3! 🚀✨ (+50 Likes)');
  }, [playHapticSound, triggerParticleBlast, showToast]);

  // Save Settings
  const handleSaveSettings = useCallback(() => {
    playHapticSound(750);
    const updated: UserProfileData = {
      ...profile,
      name: editName.trim() || profile.name,
      handle: editHandle.trim() || profile.handle,
      bio: editBio.trim() || profile.bio,
      customStatus: editStatus.trim(),
      avatarDecoration: editDecoration,
      bannerEffect: editBannerEffect
    };
    setProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    setIsSettingsOpen(false);
    showToast('Nitro Profile Settings Saved to IndexedDB! ✨');
  }, [editName, editHandle, editBio, editStatus, editDecoration, editBannerEffect, profile, playHapticSound, showToast, onUpdateProfile]);

  // Mock Data
  const mockPosts: PostItem[] = useMemo(() => [
    {
      id: 'p1',
      author: profileContext === 'server' ? (profile.serverNickname || profile.name) : profile.name,
      avatar: profile.avatar,
      timestamp: '2 hours ago',
      content: 'Just launched our MNC-grade Nitro Profile Dashboard with Next.js, Tailwind CSS & Radix UI primitives! Zero Cumulative Layout Shift (CLS) and 60 FPS frame rates 🔥 What do you think?',
      likes: 342,
      comments: 28,
      shares: 14,
      isNitroClip: true,
      mediaUrl: '/ny_skyline.jpg'
    },
    {
      id: 'p2',
      author: profileContext === 'server' ? (profile.serverNickname || profile.name) : profile.name,
      avatar: profile.avatar,
      timestamp: 'Yesterday at 6:30 PM',
      content: 'Configured automated IndexedDB state auto-persistence for 100k+ records. Hydrates in < 20ms with progressive windowing virtualization 🚀',
      likes: 890,
      comments: 64,
      shares: 42,
      mediaUrl: '/ny_skyscrapers.jpg'
    }
  ], [profileContext, profile.name, profile.serverNickname, profile.avatar]);

  const mockSoundboard: NitroSound[] = useMemo(() => [
    { id: 'sb1', name: 'Airhorn Blast', emoji: '📢', freq: 750, category: 'Meme' },
    { id: 'sb2', name: 'Quack Quack', emoji: '🦆', freq: 440, category: 'Meme' },
    { id: 'sb3', name: 'Victory Horn', emoji: '🎺', freq: 880, category: 'Gaming' },
    { id: 'sb4', name: 'GG WP Chime', emoji: '🎮', freq: 620, category: 'Gaming' },
    { id: 'sb5', name: 'Super Laser Blast', emoji: '⚡', freq: 950, category: 'Nitro Special' }
  ], []);

  const mockCollectibles: NitroSticker[] = useMemo(() => [
    { id: 's1', name: 'Cyberpunk Neon Wave', emoji: '🌌', rarity: 'Nitro Exclusive', animated: true },
    { id: 's2', name: 'Super Reaction Spark', emoji: '✨', rarity: 'Legendary', animated: true },
    { id: 's3', name: 'Golden Dragon Flame', emoji: '🐉', rarity: 'Legendary', animated: true },
    { id: 's4', name: 'HypeSquad Events Badge', emoji: '⚡', rarity: 'Rare', animated: false }
  ], []);

  const currentBanner = profileContext === 'server' ? (profile.serverBanner || profile.banner) : profile.banner;
  const currentDisplayName = profileContext === 'server' ? (profile.serverNickname || profile.name) : profile.name;

  return (
    <Tooltip.Provider>
      <div className="w-full max-w-5xl mx-auto font-sans selection:bg-purple-500 selection:text-white relative">
        
        {/* Toast Notification Pill */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              role="status"
              aria-live="polite"
              className="fixed top-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700/50 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global vs Server Profile Switcher Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => { playHapticSound(500); setProfileContext('global'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                profileContext === 'global' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Profile</span>
            </button>
            <button
              type="button"
              onClick={() => { playHapticSound(500); setProfileContext('server'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                profileContext === 'server' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
              <span>{profile.serverName}</span>
            </button>
          </div>

          {profile.vanityUrl && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-200 dark:border-purple-800">
              <Code2 className="w-3 h-3" />
              {profile.vanityUrl}
            </span>
          )}
        </div>

        {/* MAIN PROFILE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all relative">
          
          {/* Animated Particles Overlay */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ y: -60, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8 }}
              className="absolute z-50 text-xl pointer-events-none"
              style={{ left: p.x, top: p.y }}
            >
              ✨🚀
            </motion.span>
          ))}

          {/* COVER BANNER SECTION WITH BANNER EFFECTS */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <BannerEffectOverlay effect={profile.bannerEffect} />
            <img
              src={currentBanner}
              alt="Profile Cover Banner"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/30 to-transparent" />

            {/* Nitro Tier Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Nitro Level 3 Boosted
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                <Zap className="w-3 h-3 text-purple-400" />
                {boostCount} Server Boosts
              </span>
            </div>

            {/* Audio Toggle */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition cursor-pointer border border-slate-700/60"
                title={soundEnabled ? "Profile Audio Haptics On" : "Profile Audio Muted"}
                aria-label="Toggle haptic audio effects"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* PROFILE HEADER & AVATAR SECTION */}
          <div className="px-6 sm:px-10 pb-6 relative pt-0">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar with Nitro Decoration Ring */}
              <div className="relative group self-start sm:self-auto z-20">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-slate-800">
                  <AvatarDecorationFrame decoration={profile.avatarDecoration} />
                  <img
                    src={profile.avatar}
                    alt={currentDisplayName}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full rounded-full object-cover relative z-10"
                  />
                  <span 
                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-30 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" 
                    title="Online & Custom Status Active"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap sm:mb-2 z-20">
                
                {/* Follow Button */}
                <button
                  type="button"
                  onClick={() => {
                    playHapticSound(640);
                    setIsFollowing(!isFollowing);
                    setFollowersCount(c => (!isFollowing ? c + 1 : c - 1));
                    showToast(!isFollowing ? 'Followed @' + profile.handle : 'Unfollowed');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isFollowing 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300' 
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90'
                  }`}
                >
                  {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                {/* Boost Button */}
                <button
                  type="button"
                  onClick={handleNitroBoost}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Boost ({boostCount})</span>
                </button>

                {/* Edit Profile Quick Button */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      aria-label="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg z-50">
                      Edit Profile
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* Share Button */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Profile link copied! 📋');
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      aria-label="Share Profile"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg z-50">
                      Copy Link
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* Settings Trigger */}
                <Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      onClick={() => playHapticSound(600)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </Dialog.Trigger>

                  {/* RADIX UI DIALOG MODAL FOR NITRO CUSTOMIZATION */}
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                        <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Crown className="w-5 h-5 text-amber-400" />
                          Discord Nitro Profile Customizer
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button type="button" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                            <X className="w-5 h-5" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Handle</label>
                          <input
                            type="text"
                            value={editHandle}
                            onChange={(e) => setEditHandle(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nitro Custom Status</label>
                          <input
                            type="text"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            placeholder="e.g. 🎮 Streaming Next.js + Radix UI"
                            className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">About Me Bio</label>
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                          />
                        </div>

                        {/* Avatar Decoration Picker */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Nitro Avatar Decoration</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'none', label: 'None', emoji: '⚪' },
                              { id: 'crown', label: 'Gold Crown', emoji: '👑' },
                              { id: 'neon', label: 'Cyber Neon', emoji: '⚡' },
                              { id: 'sparkle', label: 'Cosmic Sparkle', emoji: '✨' },
                              { id: 'flame', label: 'Dragon Flame', emoji: '🔥' },
                              { id: 'diamond', label: 'Diamond Aura', emoji: '💎' },
                              { id: 'sakura', label: 'Sakura Petals', emoji: '🌸' },
                              { id: 'matrix', label: 'Matrix Code', emoji: '💻' }
                            ].map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setEditDecoration(item.id as AvatarDecoration)}
                                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition ${
                                  editDecoration === item.id 
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600 font-bold' 
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span>{item.emoji}</span>
                                <span>{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Banner Effect Picker */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Nitro Banner Animated Effect</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'none', label: 'None', emoji: '🚫' },
                              { id: 'nebula', label: 'Cosmic Nebula', emoji: '🌌' },
                              { id: 'matrix', label: 'Cyber Matrix', emoji: '💻' },
                              { id: 'gold_dust', label: 'Gold Dust Shimmer', emoji: '✨' }
                            ].map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setEditBannerEffect(item.id as BannerEffect)}
                                className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition ${
                                  editBannerEffect === item.id 
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600 font-bold' 
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span>{item.emoji}</span>
                                <span>{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <Dialog.Close asChild>
                          <button type="button" className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>

                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

              </div>
            </div>

            {/* Name & Handle */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  {currentDisplayName}
                  {profile.verified && (
                    <CheckCircle2 className="w-5 h-5 text-purple-500 fill-purple-500/20" />
                  )}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.handle}</span>
                {profile.location && (
                  <>
                    <span>•</span>
                    <span>{profile.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* Nitro Boost Level Progression Widget */}
            <div className="mb-4 p-3 bg-purple-50/80 dark:bg-purple-950/40 rounded-2xl border border-purple-200/60 dark:border-purple-900/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  Server Level 3 Boost Progression
                </span>
                <span className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  {boostCount} / {profile.stats.nextLevelBoosts} Boosts
                </span>
              </div>
              <div className="h-2 bg-purple-200 dark:bg-purple-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (boostCount / profile.stats.nextLevelBoosts) * 100)}%` }}
                />
              </div>
            </div>

            {/* Custom Status Pill */}
            {profile.customStatus && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-medium mb-4 border border-slate-200/60 dark:border-slate-700/60">
                <span>{profile.customStatusEmoji || '💬'}</span>
                <span>{profile.customStatus}</span>
              </div>
            )}

            {/* Bio */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-5">
              {profile.bio}
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {profile.badges.map(badge => (
                <Tooltip.Root key={badge.id}>
                  <Tooltip.Trigger asChild>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color} cursor-pointer transition transform hover:scale-105`}>
                      <Zap className="w-3.5 h-3.5" />
                      {badge.name}
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl z-50 font-medium">
                      {badge.description}
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </div>

            {/* METRICS & STATS CARDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              
              <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition hover:border-purple-500/50">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {(followersCount / 1000).toFixed(1)}K
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  FOLLOWERS
                </div>
              </div>

              <button
                type="button"
                onClick={handleNitroBoost}
                className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-left transition hover:border-rose-500/50 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500 group-hover:scale-125 transition transform" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {(likesCount / 1000000).toFixed(1)}M
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  LIKES
                </div>
              </button>

              <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition hover:border-blue-500/50">
                <div className="flex items-center gap-2 text-blue-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profile.stats.mediaCount}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  MEDIA
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition hover:border-emerald-500/50">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Grid className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profile.stats.postsCount}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  POSTS
                </div>
              </div>

            </div>

            {/* RADIX UI SEGMENTED TABS NAVIGATION */}
            <Tabs.Root value={activeTab} onValueChange={(val) => { playHapticSound(480); setActiveTab(val as ProfileTab); }}>
              
              <div className="flex justify-center my-6">
                <Tabs.List className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto">
                  
                  <Tabs.Trigger
                    value="posts"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'posts'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>Posts</span>
                  </Tabs.Trigger>

                  <Tabs.Trigger
                    value="media"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'media'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Media</span>
                  </Tabs.Trigger>

                  <Tabs.Trigger
                    value="soundboard"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'soundboard'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Music className="w-4 h-4 text-purple-500" />
                    <span>Soundboard</span>
                  </Tabs.Trigger>

                  <Tabs.Trigger
                    value="collectibles"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'collectibles'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Nitro Collectibles</span>
                  </Tabs.Trigger>

                  <Tabs.Trigger
                    value="likes"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'likes'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Likes</span>
                  </Tabs.Trigger>

                </Tabs.List>
              </div>

              {/* POSTS TAB CONTENT */}
              <Tabs.Content value="posts" className="space-y-4 outline-none">
                {mockPosts.map((post) => (
                  <div key={post.id} className="bg-slate-50/80 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                            {post.author}
                            {post.isNitroClip && (
                              <span className="text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded-full border border-purple-200 dark:border-purple-800">
                                Nitro Clip ⚡
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{post.timestamp}</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {post.content}
                    </p>

                    {post.mediaUrl && (
                      <div className="rounded-xl overflow-hidden aspect-video bg-slate-900">
                        <img src={post.mediaUrl} alt="Post content media" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="flex items-center gap-1 hover:text-rose-500 transition cursor-pointer">
                        <Heart className="w-3.5 h-3.5" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 transition cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1 hover:text-purple-500 transition cursor-pointer">
                        <Share2 className="w-3.5 h-3.5" /> {post.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </Tabs.Content>

              {/* SOUNDBOARD TAB CONTENT */}
              <Tabs.Content value="soundboard" className="outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {mockSoundboard.map(sound => (
                    <button
                      key={sound.id}
                      type="button"
                      onClick={() => playSoundboardClip(sound)}
                      className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-left hover:border-purple-500/50 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-125 transition transform">{sound.emoji}</span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{sound.name}</div>
                          <span className="text-[10px] font-semibold text-purple-500">{sound.category}</span>
                        </div>
                      </div>
                      <Volume2 className="w-4 h-4 text-purple-400 group-hover:animate-bounce" />
                    </button>
                  ))}
                </div>
              </Tabs.Content>

              {/* MEDIA TAB CONTENT */}
              <Tabs.Content value="media" className="outline-none">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['/ny_skyscrapers.jpg', '/ny_skyline.jpg', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'].map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-900 group relative cursor-pointer">
                      <img src={img} alt={`Media gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              {/* NITRO COLLECTIBLES TAB CONTENT */}
              <Tabs.Content value="collectibles" className="outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockCollectibles.map(item => (
                    <div key={item.id} className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</div>
                          <span className="text-[10px] font-semibold text-purple-500">{item.rarity}</span>
                        </div>
                      </div>
                      <Sparkle className="w-4 h-4 text-amber-400" />
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              {/* LIKES TAB CONTENT */}
              <Tabs.Content value="likes" className="outline-none">
                <div className="p-12 text-center bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <Heart className="w-8 h-8 text-rose-400 mx-auto" />
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No Liked Posts Hidden</div>
                  <div className="text-xs text-slate-400">Posts you like will appear here for easy access</div>
                </div>
              </Tabs.Content>

            </Tabs.Root>

          </div>

        </div>

      </div>
    </Tooltip.Provider>
  );
}
