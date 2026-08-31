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
  Lock,
  CheckCircle,
  MoreHorizontal,
  Layers,
  Award,
  Palette,
  Upload,
  Camera
} from 'lucide-react';
import type { 
  UserProfileData, 
  UserProfileCardProps, 
  AvatarDecoration, 
  BannerEffect, 
  ProfileEffect, 
  ProfileTheme,
  SubscriptionTier, 
  SubscriptionPlan, 
  ProfileTab, 
  ProfileContext, 
  PostItem, 
  NitroSticker, 
  NitroSound,
  ServerRole 
} from './types';

export type { UserProfileData, UserProfileCardProps, AvatarDecoration, BannerEffect, ProfileEffect, ProfileTheme, SubscriptionTier, ProfileTab, ProfileContext, ServerRole };

/* ========================================================
   INDEXEDDB AUTO-PERSISTENCE ENGINE FOR PROFILE & SUBSCRIPTION
======================================================== */
const DB_NAME = 'UserProfileCardDB';
const DB_VERSION = 1;
const STORE_PROFILE = 'profileData';

let dbPromiseCache: Promise<IDBDatabase> | null = null;

function openProfileDB(): Promise<IDBDatabase> {
  if (!dbPromiseCache) {
    dbPromiseCache = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_PROFILE)) {
          db.createObjectStore(STORE_PROFILE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => {
        dbPromiseCache = null;
        reject((e.target as any)?.error);
      };
    });
  }
  return dbPromiseCache;
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
   SUBSCRIPTION PLANS DEFINITION
======================================================== */
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Standard',
    price: '$0',
    period: 'forever',
    badge: 'Basic',
    color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200',
    features: [
      'Standard Static Avatar & Cover Photo',
      'Basic Custom Status',
      'View Feed Posts & Media Gallery',
      'Standard Like & Share Reactions'
    ]
  },
  {
    id: 'nitro_basic',
    name: 'Nitro Basic',
    price: '$2.99',
    period: 'per month',
    badge: 'Popular',
    color: 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100',
    features: [
      'Custom Nitro Basic Badge',
      '50MB High-Res File Uploads',
      'Custom Emojis Everywhere',
      'Nitro Special Reactions'
    ]
  },
  {
    id: 'nitro_pro',
    name: 'Nitro Pro (Full Nitro)',
    price: '$9.99',
    period: 'per month',
    badge: 'Full Nitro Perks',
    recommended: true,
    color: 'border-purple-500 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-900 text-white shadow-xl shadow-purple-500/20',
    features: [
      'Looping GIF Animated Profile Avatar',
      'Looping GIF Animated Cover Banner',
      'Full-Screen Programmatic Profile Effects (Anime Power, Cyber Matrix, Retrowave Sunset)',
      'Shop Avatar Decorations (Solar Flare, Anime Aura, Cyber Hacker Void, Celestial Orbit)',
      'Server Level 1 Animated Sidebar Server Icon',
      'Server Level 1 Holographic Animated Gradient Roles',
      'Server Level 3 Animated Sidebar Banner Slot',
      'Nitro Soundboard Audio Sampler & 2 Free Server Boosts'
    ]
  }
];

/* ========================================================
   HIGH-IMPACT NITRO PROFILE EFFECTS OVERLAY (GPU ACCELERATED PARTICLES)
======================================================== */
const ProfileEffectOverlay = React.memo(({ effect, isUnlocked }: { effect: ProfileEffect; isUnlocked: boolean }) => {
  if (effect === 'none' || !isUnlocked) return null;

  if (effect === 'magic_spells') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Swirling Spell Ring */}
        <motion.div 
          animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/30 via-indigo-600/20 to-transparent blur-md"
        />
        {/* Floating Magic Orbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`magic-orb-${i}`}
            initial={{ y: 250, x: (i * 80) % 400, opacity: 0, scale: 0.6 }}
            animate={{ y: -50, opacity: [0, 0.9, 0], scale: [0.6, 1.2, 0.6] }}
            transition={{ repeat: Infinity, duration: 3 + (i % 3), delay: i * 0.4, ease: 'easeInOut' }}
            className="absolute text-purple-400 font-extrabold text-sm drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]"
          >
            🔮✨
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'hypesquad_explosion') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/40 via-pink-500/30 to-transparent blur-xl"
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`hs-spark-${i}`}
            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: (i % 2 === 0 ? 1 : -1) * (50 + i * 25), 
              y: (i % 3 === 0 ? -1 : 1) * (40 + i * 20),
              opacity: [0, 1, 0],
              scale: [0.5, 1.3, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.2 }}
            className="absolute top-1/2 left-1/2 text-amber-300 text-lg drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
          >
            🌟✨⚡
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'retrowave_sunset') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen">
        {/* Neon Grid Scanlines */}
        <motion.div
          animate={{ y: [0, 40] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-full h-full opacity-35 bg-[linear-gradient(to_bottom,#ec4899_2px,transparent_2px)] [background-size:100%_20px]"
        />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-pink-600/40 via-purple-900/30 to-transparent" />
      </div>
    );
  }

  if (effect === 'autumn_leaves') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            initial={{ y: -30, x: (i * 70) % 500, rotate: 0, opacity: 0 }}
            animate={{ 
              y: 450, 
              x: ((i * 70) % 500) + (i % 2 === 0 ? 40 : -40), 
              rotate: 360, 
              opacity: [0, 0.9, 0] 
            }}
            transition={{ repeat: Infinity, duration: 4 + (i % 3), delay: i * 0.5, ease: 'easeInOut' }}
            className="absolute text-amber-500 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
          >
            🍂
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'neon_glitch') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen">
        <motion.div 
          animate={{ opacity: [0.2, 0.7, 0.2], x: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-b from-cyan-500/25 via-transparent to-pink-500/25"
        />
      </div>
    );
  }

  if (effect === 'dragon_fire') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-orange-600/40 via-red-600/20 to-transparent" />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`fire-ember-${i}`}
            initial={{ y: 300, x: (i * 75) % 450, opacity: 0, scale: 0.5 }}
            animate={{ y: -20, opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5 + (i % 2), delay: i * 0.35, ease: 'easeOut' }}
            className="absolute text-orange-500 text-base drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]"
          >
            🔥💥
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'sakura_breeze') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={`sakura-p-${i}`}
            initial={{ y: -20, x: (i * 65) % 450, rotate: 0, opacity: 0 }}
            animate={{ 
              y: 450, 
              x: ((i * 65) % 450) + (i % 2 === 0 ? 50 : -50), 
              rotate: 180, 
              opacity: [0, 0.95, 0] 
            }}
            transition={{ repeat: Infinity, duration: 5 + (i % 3), delay: i * 0.4, ease: 'easeInOut' }}
            className="absolute text-pink-400 text-lg drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]"
          >
            🌸
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'cyber_matrix_stream') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden font-mono text-[11px] text-emerald-400/80 font-bold">
        {Array.from({ length: 6 }).map((_, col) => (
          <motion.div
            key={`matrix-col-${col}`}
            initial={{ y: -100 }}
            animate={{ y: 400 }}
            transition={{ repeat: Infinity, duration: 2.8 + col * 0.4, ease: 'linear', delay: col * 0.3 }}
            className="absolute flex flex-col gap-1"
            style={{ left: `${15 + col * 15}%` }}
          >
            <span>0</span>
            <span>1</span>
            <span>0</span>
            <span>1</span>
            <span>1</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'cosmic_void') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          className="w-full h-full opacity-45 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/70 via-indigo-900/40 to-transparent blur-md"
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`cosmic-star-${i}`}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center text-indigo-300 text-xs"
          >
            <span style={{ transform: `translate(${(i + 1) * 35}px, ${(i + 1) * 20}px)` }}>✨</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'lightning_surge') {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.1, 0.8, 0.1, 0.9, 0.1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-full h-full bg-cyan-400/20 backdrop-blur-[1px]"
        />
      </div>
    );
  }

  return null;
});
ProfileEffectOverlay.displayName = 'ProfileEffectOverlay';

/* ========================================================
   COMPLEX AVATAR DECORATION RENDERER (SHOP PACK PERKS)
======================================================== */
const AvatarDecorationFrame = React.memo(({ decoration, isUnlocked }: { decoration: AvatarDecoration; isUnlocked: boolean }) => {
  if (decoration === 'none' || !isUnlocked) return null;

  if (decoration === 'anime_power_aura') {
    return (
      <div className="absolute -inset-3.5 rounded-full z-10 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="w-full h-full rounded-full border-2 border-amber-400/90 shadow-[0_0_22px_rgba(251,191,36,0.9)] opacity-90"
        />
        <div className="absolute top-0 right-1 w-3 h-3 bg-amber-300 rounded-full blur-xs animate-ping" />
      </div>
    );
  }

  if (decoration === 'cyber_hacker_void') {
    return (
      <div className="absolute -inset-3 rounded-full z-10 pointer-events-none">
        <div className="w-full h-full rounded-full border-2 border-emerald-400 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.9)]" />
        <div className="absolute inset-0 border border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '5s' }} />
      </div>
    );
  }

  if (decoration === 'celestial_orbit') {
    return (
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        className="absolute -inset-4 rounded-full border-2 border-dashed border-indigo-400 z-10 pointer-events-none shadow-[0_0_24px_rgba(129,140,248,0.95)]"
      >
        <div className="absolute -top-1 left-1/2 w-3.5 h-3.5 bg-indigo-300 rounded-full shadow-lg" />
      </motion.div>
    );
  }

  if (decoration === 'phoenix_flame') {
    return (
      <div className="absolute -top-4 -right-3 z-20 pointer-events-none">
        <Flame className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]" />
      </div>
    );
  }

  if (decoration === 'crown') {
    return (
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <Crown className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
      </motion.div>
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

  if (decoration === 'solar_flare') {
    return (
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="absolute -inset-3 rounded-full border-2 border-dashed border-amber-400 z-10 pointer-events-none shadow-[0_0_20px_rgba(251,191,36,0.95)]"
      />
    );
  }

  if (decoration === 'galaxy_warp') {
    return (
      <motion.div 
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute -inset-3 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 opacity-80 blur-xs z-0 pointer-events-none"
      />
    );
  }

  if (decoration === 'holographic_glitch') {
    return (
      <div className="absolute -inset-2.5 rounded-full border-2 border-pink-500 animate-pulse z-10 pointer-events-none shadow-[0_0_16px_rgba(236,72,153,0.9)] opacity-90" />
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
   HIGH-DEFINITION 3D ANIME ANIMATED BANNER ENGINES (MNC GRADE)
======================================================== */
const BannerEffectOverlay = React.memo(({ effect, isUnlocked }: { effect: BannerEffect; isUnlocked: boolean }) => {
  if (effect === 'none' || !isUnlocked) return null;

  // 1. Cyberpunk Anime City Skyline Engine
  if (effect === 'cyberpunk_anime_city') {
    return (
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-10 overflow-hidden">
        {/* Neon Cityscape Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950/80 to-slate-950" />
        
        {/* Pulsing Hologram Billboards */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute top-4 left-10 text-cyan-400 font-mono font-black text-xs tracking-widest border border-cyan-500/50 px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        >
          NEON 2077
        </motion.div>

        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-8 right-16 text-pink-400 font-mono font-black text-xs tracking-widest border border-pink-500/50 px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(236,72,153,0.8)]"
        >
          CYBER CITY
        </motion.div>

        {/* Flying Vehicles Moving Across Sky */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`cyber-car-${i}`}
            initial={{ x: -100, y: 30 + i * 25, opacity: 0 }}
            animate={{ x: 700, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 1.5, delay: i * 0.8, ease: 'linear' }}
            className="absolute flex items-center gap-1 text-cyan-300 font-bold text-xs"
          >
            <div className="h-1 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            <span className="text-[10px]">🏎️</span>
          </motion.div>
        ))}

        {/* Matrix Binary Rain Stream */}
        <div className="absolute inset-0 opacity-40 font-mono text-[10px] text-emerald-400 font-bold flex justify-around overflow-hidden">
          {Array.from({ length: 8 }).map((_, col) => (
            <motion.div
              key={`city-matrix-${col}`}
              initial={{ y: -80 }}
              animate={{ y: 280 }}
              transition={{ repeat: Infinity, duration: 2.2 + col * 0.3, ease: 'linear', delay: col * 0.2 }}
              className="flex flex-col gap-0.5"
            >
              <span>0</span>
              <span>1</span>
              <span>1</span>
              <span>0</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Fantasy Cyber Dragon Storm Void Engine
  if (effect === 'cyber_dragon_void') {
    return (
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-10 overflow-hidden">
        {/* Volumetric Dark Cloud Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-slate-950 to-indigo-950" />
        
        {/* Gliding Cyber Dragon Silhouette */}
        <motion.div
          initial={{ x: -120, y: 40 }}
          animate={{ x: 650, y: [40, 20, 50, 30] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          className="absolute text-purple-400 text-5xl drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] opacity-90"
        >
          🐉
        </motion.div>

        {/* Lightning Storm Flashes */}
        <motion.div
          animate={{ opacity: [0, 0.85, 0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="absolute inset-0 bg-purple-500/20 backdrop-blur-[1px]"
        />

        {/* Rising Fire Sparks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`dragon-spark-${i}`}
            initial={{ y: 220, x: (i * 60) % 500, opacity: 0 }}
            animate={{ y: -10, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 + (i % 2), delay: i * 0.35, ease: 'easeOut' }}
            className="absolute text-rose-500 text-xs drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]"
          >
            🔥⚡
          </motion.div>
        ))}
      </div>
    );
  }

  // 3. 3D Arcade Synthwave Sunset Horizon Engine
  if (effect === 'arcade_synthwave_sunset') {
    return (
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-10 overflow-hidden">
        {/* Synthwave Purple Sky Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900/90 to-pink-950" />
        
        {/* Giant Glowing Neon Retrowave Sun */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-t from-pink-500 via-amber-400 to-yellow-300 shadow-[0_0_40px_rgba(236,72,153,0.9)]"
        />

        {/* 3D Wireframe Laser Grid Plane Moving Infinite */}
        <motion.div
          animate={{ y: [0, 24] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="absolute bottom-0 inset-x-0 h-28 opacity-60 bg-[linear-gradient(to_right,#ec4899_1.5px,transparent_1.5px),linear-gradient(to_bottom,#ec4899_1.5px,transparent_1.5px)] [background-size:24px_24px]"
        />

        {/* Flying Synthwave Palm Silhouette */}
        <div className="absolute bottom-2 left-6 text-pink-400 text-2xl opacity-80">🌴</div>
        <div className="absolute bottom-2 right-6 text-pink-400 text-2xl opacity-80">🌴</div>
      </div>
    );
  }

  // 4. Hyperdrive Starlight Warp Nebula Engine
  if (effect === 'starlight_warp_nebula') {
    return (
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950" />
        
        {/* Swirling Nebula Cloud */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-600 to-transparent blur-xl"
        />

        {/* 3D Streaking Warp Stars */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={`warp-star-${i}`}
            initial={{ x: -60, y: (i * 18) % 220, opacity: 0 }}
            animate={{ x: 650, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 + (i % 3) * 0.3, delay: i * 0.12, ease: 'linear' }}
            className="absolute h-0.5 w-16 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_10px_rgba(34,211,238,0.9)]"
          />
        ))}
      </div>
    );
  }

  // 5. Sakura Moonlit Temple Pagoda Engine
  if (effect === 'sakura_moonlight_temple') {
    return (
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-10 overflow-hidden">
        {/* Night Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-pink-950/60" />
        
        {/* Giant Glowing Full Moon */}
        <div className="absolute top-3 right-10 w-28 h-28 rounded-full bg-slate-100 shadow-[0_0_35px_rgba(255,255,255,0.9)] opacity-90" />

        {/* Pagoda Temple Silhouette */}
        <div className="absolute bottom-2 left-8 text-pink-300 text-4xl opacity-80">⛩️</div>

        {/* Animated Falling Sakura Petals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`sakura-banner-${i}`}
            initial={{ y: -20, x: (i * 50) % 550, rotate: 0, opacity: 0 }}
            animate={{ y: 260, x: ((i * 50) % 550) + (i % 2 === 0 ? 40 : -40), rotate: 360, opacity: [0, 0.95, 0] }}
            transition={{ repeat: Infinity, duration: 4 + (i % 3), delay: i * 0.3, ease: 'easeInOut' }}
            className="absolute text-pink-300 text-sm drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]"
          >
            🌸
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'retrowave_grid') {
    return (
      <div className="absolute inset-0 bg-gradient-to-t from-pink-600/40 via-purple-950/40 to-transparent backdrop-blur-[1px] pointer-events-none z-10">
        <motion.div 
          animate={{ y: [0, 20] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-full h-full opacity-50 bg-[radial-gradient(#ec4899_2px,transparent_2px)] [background-size:24px_24px]"
        />
      </div>
    );
  }

  if (effect === 'hyperdrive_stars') {
    return (
      <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`star-streak-${i}`}
            initial={{ x: -50, y: (i * 20) % 200, opacity: 0 }}
            animate={{ x: 600, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 + (i % 3) * 0.4, delay: i * 0.15, ease: 'linear' }}
            className="absolute h-0.5 w-12 bg-gradient-to-r from-transparent via-indigo-300 to-transparent rounded-full shadow-[0_0_8px_rgba(129,140,248,0.9)]"
          />
        ))}
      </div>
    );
  }

  if (effect === 'frostbite') {
    return (
      <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`snow-${i}`}
            initial={{ y: -20, x: (i * 60) % 500, opacity: 0 }}
            animate={{ y: 250, x: ((i * 60) % 500) + (i % 2 === 0 ? 30 : -30), opacity: [0, 0.9, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 + (i % 2), delay: i * 0.3, ease: 'easeInOut' }}
            className="absolute text-cyan-200 text-sm drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
          >
            ❄️
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'lightning') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0, 0.8, 0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-full h-full bg-indigo-500/25 backdrop-blur-[1px]"
        />
      </div>
    );
  }

  if (effect === 'gold_dust') {
    return (
      <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`gold-dust-${i}`}
            initial={{ y: 220, x: (i * 55) % 500, opacity: 0 }}
            animate={{ y: -10, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 3 + (i % 2), delay: i * 0.3, ease: 'easeOut' }}
            className="absolute text-amber-300 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
          >
            ✨
          </motion.div>
        ))}
      </div>
    );
  }

  if (effect === 'nebula') {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-pink-600/30 to-indigo-600/40 backdrop-blur-[1px] animate-pulse pointer-events-none z-10" />
    );
  }

  if (effect === 'matrix') {
    return (
      <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] pointer-events-none z-10 overflow-hidden">
        <div className="w-full h-full opacity-40 bg-[radial-gradient(#34d399_2px,transparent_2px)] [background-size:18px_18px] animate-pulse" />
      </div>
    );
  }

  if (effect === 'sakura') {
    return (
      <div className="absolute inset-0 bg-pink-500/15 backdrop-blur-[1px] pointer-events-none z-10" />
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
    animatedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    animatedBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'Full-stack AI systems architect & Discord Nitro Booster ✨ Building MNC-grade web apps with Next.js, Tailwind CSS & Radix UI primitives.',
    location: 'San Francisco, CA',
    customStatus: '🎮 Streaming Next.js + Radix UI Primitives',
    customStatusEmoji: '✨',
    vanityUrl: 'discord.gg/ram',
    themeColor: '#5865F2',
    profileTheme: 'synthwave_neon',
    avatarDecoration: 'anime_power_aura',
    bannerEffect: 'retrowave_grid',
    profileEffect: 'hypesquad_explosion',
    nitroLevel: 'level3',
    subscriptionTier: 'nitro_pro',
    badges: [
      { id: 'b1', name: 'Server Booster (Level 3)', iconName: 'Zap', color: 'text-pink-400 bg-pink-950/60 border-pink-500/40', description: 'Boosting servers since 2022' },
      { id: 'b2', name: 'Nitro Pro Subscriber', iconName: 'Crown', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40', description: 'Full Discord Nitro Pro Active' },
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
    // Server Specific Profile & Server Level 1-3 Boost Overrides
    serverName: 'Next.js MNC Guild 🛡️',
    serverIcon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    animatedServerIcon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    serverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    serverBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    animatedServerBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    serverNickname: 'Ram [Lead Architect]',
    serverRoles: [
      { id: 'r1', name: '@Core Lead', colorGradient: 'from-amber-400 via-pink-400 to-purple-400', animated: true },
      { id: 'r2', name: '@MNC Architect', colorGradient: 'from-cyan-400 to-blue-500', animated: true },
      { id: 'r3', name: '@Nitro Booster', colorGradient: 'from-pink-500 to-rose-500', animated: false }
    ]
  },
  onUpdateProfile
}: UserProfileCardProps) {
  // Core Profile & Subscription State
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(initialProfile.subscriptionTier || 'nitro_pro');
  const [profileTheme, setProfileTheme] = useState<ProfileTheme>(initialProfile.profileTheme || 'synthwave_neon');
  const [profileContext, setProfileContext] = useState<ProfileContext>('global');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialProfile.stats.followers);
  const [likesCount, setLikesCount] = useState(initialProfile.stats.likes);
  const [boostCount, setBoostCount] = useState(initialProfile.stats.boostCount);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  // Super Reaction Burst Particles
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // MNC Performance: Offscreen IntersectionObserver & Tab Visibility Engine
  const [isScreenVisible, setIsScreenVisible] = useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsScreenVisible(entry.isIntersecting);
    }, { threshold: 0.05 });

    observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      if (document.hidden) setIsScreenVisible(false);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Settings Draft State
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editStatus, setEditStatus] = useState(profile.customStatus || '');
  const [editDecoration, setEditDecoration] = useState<AvatarDecoration>(profile.avatarDecoration);
  const [editBannerEffect, setEditBannerEffect] = useState<BannerEffect>(profile.bannerEffect);
  const [editProfileEffect, setEditProfileEffect] = useState<ProfileEffect>(profile.profileEffect || 'hypesquad_explosion');
  const [editTheme, setEditTheme] = useState<ProfileTheme>(profileTheme);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editAnimatedAvatar, setEditAnimatedAvatar] = useState(profile.animatedAvatar || '');
  const [editBanner, setEditBanner] = useState(profile.banner);
  const [editAnimatedBanner, setEditAnimatedBanner] = useState(profile.animatedBanner || '');

  // Feature Lock Helpers
  const isNitroPro = subscriptionTier === 'nitro_pro';

  // Theme Ambient Backlight Glow Map
  const themeClasses = useMemo(() => {
    switch (profileTheme) {
      case 'synthwave_neon': return 'border-pink-500/90 shadow-[0_0_50px_rgba(236,72,153,0.35)]';
      case 'nitro_pink': return 'border-pink-500/80 shadow-[0_0_45px_rgba(236,72,153,0.3)]';
      case 'cyber_emerald': return 'border-emerald-500/80 shadow-[0_0_45px_rgba(52,211,153,0.3)]';
      case 'solar_gold': return 'border-amber-500/80 shadow-[0_0_45px_rgba(251,191,36,0.3)]';
      case 'midnight_obsidian': return 'border-slate-700 shadow-[0_0_45px_rgba(30,41,59,0.7)]';
      default: return 'border-purple-500/80 shadow-[0_0_50px_rgba(168,85,247,0.35)]';
    }
  }, [profileTheme]);

  // Auto-Hydration from IndexedDB
  useEffect(() => {
    idbLoadProfile('userProfileState').then(stored => {
      if (stored) {
        setProfile(prev => {
          const updated = { ...prev, ...stored };
          setEditName(updated.name);
          setEditHandle(updated.handle);
          setEditBio(updated.bio);
          setEditStatus(updated.customStatus || '');
          setEditDecoration(updated.avatarDecoration);
          setEditBannerEffect(updated.bannerEffect);
          setEditProfileEffect(updated.profileEffect || 'hypesquad_explosion');
          if (updated.profileTheme) {
            setProfileTheme(updated.profileTheme);
            setEditTheme(updated.profileTheme);
          }
          return updated;
        });
        if (stored.subscriptionTier) setSubscriptionTier(stored.subscriptionTier);
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
        subscriptionTier,
        profileTheme,
        stats: { ...profile.stats, boostCount, likes: likesCount }
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [profile, subscriptionTier, profileTheme, boostCount, likesCount]);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Web Audio Synthesizer Engine with Memory Leak Cleanup
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
      osc.onended = () => {
        try { ctx.close(); } catch {}
      };
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }, [soundEnabled]);

  // Particle Blast Trigger
  const triggerParticleBlast = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left + (Math.random() * 60 - 30),
      y: e.clientY - rect.top + (Math.random() * 60 - 30)
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Select Subscription Plan Trigger with Feature Gating Reset
  const handleSelectSubscription = useCallback((tier: SubscriptionTier) => {
    playHapticSound(900, 'triangle');
    setSubscriptionTier(tier);
    setProfile(prev => {
      const hasNitroPro = tier === 'nitro_pro';
      const hasNitroBasic = tier === 'nitro_basic' || hasNitroPro;
      
      // Dynamically update Nitro Subscriber badge
      const updatedBadges = prev.badges.filter(b => b.id !== 'b2');
      if (hasNitroBasic) {
        updatedBadges.push({
          id: 'b2',
          name: hasNitroPro ? 'Nitro Pro Subscriber' : 'Nitro Basic',
          iconName: 'Crown',
          color: hasNitroPro ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' : 'text-blue-400 bg-blue-950/60 border-blue-500/40',
          description: hasNitroPro ? 'Full Discord Nitro Pro Active' : 'Nitro Basic Perks Active'
        });
      }

      return {
        ...prev,
        subscriptionTier: tier,
        avatarDecoration: hasNitroPro ? prev.avatarDecoration : 'none',
        bannerEffect: hasNitroPro ? prev.bannerEffect : 'none',
        profileEffect: hasNitroPro ? prev.profileEffect : 'none',
        badges: updatedBadges
      };
    });
    setIsSubscriptionModalOpen(false);
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
    showToast(`Subscribed to ${plan?.name}! Features Unlocked & Saved to IndexedDB 🚀`);
  }, [playHapticSound, showToast]);

  // Soundboard Player with Gating
  const playSoundboardClip = useCallback((sound: NitroSound) => {
    if (!isNitroPro && sound.category === 'Nitro Special') {
      showToast('🔒 Soundboard locked! Upgrade to Nitro Pro to unlock audio clips');
      setIsSubscriptionModalOpen(true);
      return;
    }
    playHapticSound(sound.freq, 'triangle');
    showToast(`Played Soundboard: ${sound.emoji} ${sound.name}`);
  }, [isNitroPro, playHapticSound, showToast]);

  // Nitro Super Boost
  const handleNitroBoost = useCallback((e: React.MouseEvent) => {
    if (!isNitroPro) {
      showToast('🔒 Server Boosting requires Nitro Pro Subscription');
      setIsSubscriptionModalOpen(true);
      return;
    }
    playHapticSound(880, 'square');
    triggerParticleBlast(e);
    setBoostCount(b => b + 1);
    setLikesCount(l => l + 50);
    showToast('Nitro Super Boosted Level 3! 🚀✨ (+50 Likes)');
  }, [isNitroPro, playHapticSound, triggerParticleBlast, showToast]);

  // File Upload Handlers with Discord Subscription Limit Validation
  const handleAvatarFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif') || file.name.endsWith('.apng');
    const sizeMb = file.size / (1024 * 1024);
    const maxMb = subscriptionTier === 'nitro_pro' ? 500 : subscriptionTier === 'nitro_basic' ? 50 : 8;

    if (sizeMb > maxMb) {
      showToast(`❌ File size exceeds ${maxMb}MB limit for ${subscriptionTier.toUpperCase()} plan!`);
      return;
    }

    if (isGif && subscriptionTier !== 'nitro_pro') {
      showToast('🔒 Animated GIF avatars require Full Nitro Pro subscription ($9.99/mo)');
      setIsSubscriptionModalOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isGif) {
        setEditAnimatedAvatar(result);
        setEditAvatar(result);
      } else {
        setEditAvatar(result);
      }
      showToast('Avatar image loaded into preview! ✨');
    };
    reader.readAsDataURL(file);
  }, [subscriptionTier, showToast]);

  const handleBannerFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif') || file.name.endsWith('.apng');
    const sizeMb = file.size / (1024 * 1024);
    const maxMb = subscriptionTier === 'nitro_pro' ? 500 : subscriptionTier === 'nitro_basic' ? 50 : 8;

    if (sizeMb > maxMb) {
      showToast(`❌ File size exceeds ${maxMb}MB limit for ${subscriptionTier.toUpperCase()} plan!`);
      return;
    }

    if (isGif && subscriptionTier !== 'nitro_pro') {
      showToast('🔒 Animated GIF cover banners require Full Nitro Pro subscription ($9.99/mo)');
      setIsSubscriptionModalOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isGif) {
        setEditAnimatedBanner(result);
        setEditBanner(result);
      } else {
        setEditBanner(result);
      }
      showToast('Cover Banner image loaded into preview! ✨');
    };
    reader.readAsDataURL(file);
  }, [subscriptionTier, showToast]);

  // Save Settings
  const handleSaveSettings = useCallback(() => {
    playHapticSound(750);
    setProfileTheme(editTheme);
    const updated: UserProfileData = {
      ...profile,
      name: editName.trim() || profile.name,
      handle: editHandle.trim() || profile.handle,
      bio: editBio.trim() || profile.bio,
      customStatus: editStatus.trim(),
      profileTheme: editTheme,
      avatar: editAvatar,
      animatedAvatar: isNitroPro ? editAnimatedAvatar : undefined,
      banner: editBanner,
      animatedBanner: isNitroPro ? editAnimatedBanner : undefined,
      avatarDecoration: isNitroPro ? editDecoration : 'none',
      bannerEffect: isNitroPro ? editBannerEffect : 'none',
      profileEffect: isNitroPro ? editProfileEffect : 'none'
    };
    setProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    setIsSettingsOpen(false);
    showToast('Nitro Profile Settings & Uploaded Media Saved to IndexedDB! ✨');
  }, [editName, editHandle, editBio, editStatus, editTheme, editAvatar, editAnimatedAvatar, editBanner, editAnimatedBanner, editDecoration, editBannerEffect, editProfileEffect, isNitroPro, profile, playHapticSound, showToast, onUpdateProfile]);

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
    { id: 'sb5', name: 'Super Laser Blast', emoji: '⚡', freq: 950, category: 'Nitro Special', lockedForFree: !isNitroPro }
  ], [isNitroPro]);

  const mockCollectibles: NitroSticker[] = useMemo(() => [
    { id: 's1', name: 'Cyberpunk Neon Wave', emoji: '🌌', rarity: 'Nitro Exclusive', animated: true },
    { id: 's2', name: 'Super Reaction Spark', emoji: '✨', rarity: 'Legendary', animated: true },
    { id: 's3', name: 'Golden Dragon Flame', emoji: '🐉', rarity: 'Legendary', animated: true },
    { id: 's4', name: 'HypeSquad Events Badge', emoji: '⚡', rarity: 'Rare', animated: false }
  ], []);

  const currentBanner = profileContext === 'server' ? (profile.serverBanner || profile.banner) : profile.banner;
  const currentDisplayName = profileContext === 'server' ? (profile.serverNickname || profile.name) : profile.name;
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === subscriptionTier);

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

        {/* Global vs Server Profile Switcher & Subscription Plan Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 px-2">
          
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs self-start">
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

          {/* Active Subscription Badge Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Plan: {activePlan?.name}</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>
          </div>

        </div>

        {/* MAIN PROFILE CARD WITH DYNAMIC HSL THEME & PROFILE EFFECTS */}
        <div 
          ref={containerRef}
          className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-all relative ${
            isNitroPro ? themeClasses : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          
          {/* Full Nitro Programmatic Profile Effect (Magic Spells, Glitch, Cosmic Void, Lightning, HypeSquad, Retrowave) */}
          <ProfileEffectOverlay effect={profile.profileEffect || 'hypesquad_explosion'} isUnlocked={isNitroPro && isScreenVisible} />

          {/* Interactive Super Reaction Burst Particles */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ y: -75, opacity: 0, scale: 1.9 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute z-50 text-xl pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
              style={{ left: p.x, top: p.y }}
            >
              ✨🚀👑⚡
            </motion.span>
          ))}

          {/* COVER BANNER SECTION WITH ANIMATED GIF/MP4 BANNER */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <BannerEffectOverlay effect={profile.bannerEffect} isUnlocked={isNitroPro && isScreenVisible} />
            <img
              src={isNitroPro && profile.animatedBanner ? profile.animatedBanner : currentBanner}
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
                {isNitroPro ? 'Full Nitro Pro Active' : 'Free User Profile'}
              </span>
              {isNitroPro && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                  <Zap className="w-3 h-3 text-purple-400" />
                  {boostCount} Server Boosts
                </span>
              )}
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

          {/* PROFILE HEADER & ANIMATED AVATAR SECTION */}
          <div className="px-6 sm:px-10 pb-6 relative pt-0">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              
              {/* Animated Avatar GIF/APNG with Hover Swap & Shop Decoration */}
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
                className="relative group self-start sm:self-auto z-20"
              >
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-slate-800">
                  <AvatarDecorationFrame decoration={profile.avatarDecoration} isUnlocked={isNitroPro} />
                  <img
                    src={(isNitroPro || isAvatarHovered) && profile.animatedAvatar ? profile.animatedAvatar : profile.avatar}
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
              </motion.div>

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
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                    isNitroPro ? 'bg-pink-600 hover:bg-pink-700' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isNitroPro ? <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> : <Lock className="w-3.5 h-3.5" />}
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
                    <Tooltip.Content className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg z-50 font-medium">
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
                        {/* Avatar Image & GIF Uploader with Tier Validation */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-purple-500" />
                              <span>Profile Avatar Image / GIF</span>
                            </label>
                            <span className="text-[10px] font-mono text-purple-500 font-bold">
                              Limit: {subscriptionTier === 'nitro_pro' ? '500MB (GIF Allowed)' : subscriptionTier === 'nitro_basic' ? '50MB Static' : '8MB Static'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                              <img src={editAvatar} alt="Avatar Upload Preview" className="w-full h-full object-cover" />
                            </div>

                            <label className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-3 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/40">
                              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                <Upload className="w-4 h-4 text-purple-500" />
                                <span>Upload Avatar (Static/GIF)</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {isNitroPro ? 'PNG, JPG, WEBP, GIF, APNG (Max 500MB)' : 'PNG, JPG, WEBP (GIFs require Nitro Pro)'}
                              </span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp, image/gif, image/apng" 
                                onChange={handleAvatarFileSelect}
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>

                        {/* Cover Banner Image & GIF Uploader with Tier Validation */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                              <span>Profile Cover Banner Photo / GIF</span>
                            </label>
                            <span className="text-[10px] font-mono text-pink-500 font-bold">
                              Limit: {subscriptionTier === 'nitro_pro' ? '500MB (GIF Allowed)' : subscriptionTier === 'nitro_basic' ? '50MB Static' : '8MB Static'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="h-16 rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-700">
                              <img src={editBanner} alt="Banner Upload Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-[10px] text-white font-bold">
                                Current Banner Preview
                              </div>
                            </div>

                            <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 rounded-2xl p-3 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/40">
                              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                <Upload className="w-4 h-4 text-pink-500" />
                                <span>Upload Cover Banner (Static/GIF)</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {isNitroPro ? 'Ultra HD Banner PNG, JPG, WEBP, GIF (Max 500MB)' : 'Standard Banner PNG, JPG (GIFs require Nitro Pro)'}
                              </span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp, image/gif, image/apng" 
                                onChange={handleBannerFileSelect}
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>

                        {/* Quick Preset Anime & Cyberpunk GIF Media Selector */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Quick Anime & Cyberpunk Media Presets</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Cyberpunk Girl', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
                              { label: 'Neon Tokyo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80' }
                            ].map((preset, idx) => (
                              <button
                                key={`preset-media-${idx}`}
                                type="button"
                                onClick={() => {
                                  setEditAvatar(preset.avatar);
                                  setEditBanner(preset.banner);
                                  showToast(`Loaded Preset: ${preset.label}`);
                                }}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-400 transition cursor-pointer flex items-center gap-2"
                              >
                                <img src={preset.avatar} alt={preset.label} className="w-6 h-6 rounded-full object-cover" />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom HSL Theme Selector */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-purple-500" />
                            <span>Nitro Custom HSL Theme</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'blurple', label: 'Blurple', color: 'bg-indigo-600' },
                              { id: 'synthwave_neon', label: 'Synthwave', color: 'bg-pink-600' },
                              { id: 'cyber_emerald', label: 'Cyber Emerald', color: 'bg-emerald-600' },
                              { id: 'solar_gold', label: 'Solar Gold', color: 'bg-amber-500' },
                              { id: 'midnight_obsidian', label: 'Obsidian', color: 'bg-slate-900' }
                            ].map(theme => (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => setEditTheme(theme.id as ProfileTheme)}
                                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition ${
                                  editTheme === theme.id 
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600' 
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`} />
                                <span>{theme.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Programmatic Profile Effect Picker */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Nitro Profile Effects</label>
                            {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Requires Full Nitro</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'none', label: 'None', emoji: '⚪' },
                              { id: 'hypesquad_explosion', label: 'HypeSquad Blast', emoji: '🌟' },
                              { id: 'retrowave_sunset', label: 'Retro Sunset', emoji: '🌅' },
                              { id: 'magic_spells', label: 'Magic Spells', emoji: '🔮' },
                              { id: 'cosmic_void', label: 'Cosmic Void', emoji: '🌌' },
                              { id: 'cyber_matrix_stream', label: 'Matrix Stream', emoji: '💻' },
                              { id: 'autumn_leaves', label: 'Autumn Leaves', emoji: '🍂' },
                              { id: 'neon_glitch', label: 'Neon Glitch', emoji: '⚡' },
                              { id: 'dragon_fire', label: 'Dragon Fire', emoji: '🔥' },
                              { id: 'sakura_breeze', label: 'Sakura Breeze', emoji: '🌸' },
                              { id: 'lightning_surge', label: 'Lightning Surge', emoji: '⚡' }
                            ].map((item) => (
                              <button
                                key={`peffect-opt-${item.id}`}
                                type="button"
                                onClick={() => {
                                  if (!isNitroPro && item.id !== 'none') {
                                    showToast('🔒 Requires Full Nitro Subscription');
                                    setIsSubscriptionModalOpen(true);
                                    return;
                                  }
                                  setEditProfileEffect(item.id as ProfileEffect);
                                }}
                                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition ${
                                  editProfileEffect === item.id 
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

                        {/* Avatar Decoration Picker */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Shop Avatar Animations</label>
                            {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Requires Full Nitro</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'none', label: 'None', emoji: '⚪' },
                              { id: 'anime_power_aura', label: 'Anime Power', emoji: '⚡' },
                              { id: 'cyber_hacker_void', label: 'Hacker Void', emoji: '💻' },
                              { id: 'celestial_orbit', label: 'Celestial Orbit', emoji: '✨' },
                              { id: 'phoenix_flame', label: 'Phoenix Flame', emoji: '🔥' },
                              { id: 'solar_flare', label: 'Solar Flare', emoji: '☀️' },
                              { id: 'galaxy_warp', label: 'Galaxy Warp', emoji: '🔮' },
                              { id: 'crown', label: 'Gold Crown', emoji: '👑' },
                              { id: 'neon', label: 'Cyber Neon', emoji: '⚡' },
                              { id: 'diamond', label: 'Diamond Aura', emoji: '💎' },
                              { id: 'sakura', label: 'Sakura Petals', emoji: '🌸' },
                              { id: 'matrix', label: 'Matrix Code', emoji: '💻' },
                              { id: 'holographic_glitch', label: 'Holo Glitch', emoji: '⚡' },
                              { id: 'flame', label: 'Flame Ring', emoji: '🔥' },
                              { id: 'sparkle', label: 'Sparkles', emoji: '✨' }
                            ].map((item) => (
                              <button
                                key={`dec-opt-${item.id}`}
                                type="button"
                                onClick={() => {
                                  if (!isNitroPro && item.id !== 'none') {
                                    showToast('🔒 Requires Full Nitro Subscription');
                                    setIsSubscriptionModalOpen(true);
                                    return;
                                  }
                                  setEditDecoration(item.id as AvatarDecoration);
                                }}
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
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nitro Animated Banner</label>
                            {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Requires Full Nitro</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'none', label: 'None', emoji: '🚫' },
                              { id: 'cyberpunk_anime_city', label: 'Cyber City 2077', emoji: '🏎️' },
                              { id: 'cyber_dragon_void', label: 'Cyber Dragon Void', emoji: '🐉' },
                              { id: 'arcade_synthwave_sunset', label: '3D Arcade Sunset', emoji: '🌐' },
                              { id: 'starlight_warp_nebula', label: '3D Starlight Warp', emoji: '✨' },
                              { id: 'sakura_moonlight_temple', label: 'Sakura Temple Moon', emoji: '⛩️' },
                              { id: 'retrowave_grid', label: 'Synthwave Grid', emoji: '🌐' },
                              { id: 'hyperdrive_stars', label: 'Hyperdrive Stars', emoji: '✨' },
                              { id: 'frostbite', label: 'Frostbite Blizzard', emoji: '❄️' },
                              { id: 'lightning', label: 'Lightning Storm', emoji: '⚡' },
                              { id: 'gold_dust', label: 'Gold Dust', emoji: '✨' },
                              { id: 'matrix', label: 'Matrix Grid', emoji: '💻' },
                              { id: 'nebula', label: 'Deep Nebula', emoji: '🌌' },
                              { id: 'sakura', label: 'Sakura Falling', emoji: '🌸' }
                            ].map((item) => (
                              <button
                                key={`banner-opt-${item.id}`}
                                type="button"
                                onClick={() => {
                                  if (!isNitroPro && item.id !== 'none') {
                                    showToast('🔒 Requires Full Nitro Subscription');
                                    setIsSubscriptionModalOpen(true);
                                    return;
                                  }
                                  setEditBannerEffect(item.id as BannerEffect);
                                }}
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

                        {/* LIVE MINI-PREVIEW BOX IN MODAL */}
                        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-700/80 flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full bg-slate-800 shrink-0">
                            <AvatarDecorationFrame decoration={editDecoration} isUnlocked={true} />
                            <img src={profile.avatar} alt="Live Mini Preview" className="w-full h-full rounded-full object-cover relative z-10" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                              <span>Live Preview</span>
                              <span className="text-[9px] bg-purple-600 text-white px-2 py-0.2 rounded-full">Realtime</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Decoration: <span className="text-purple-400 font-bold">{editDecoration}</span> • Banner: <span className="text-pink-400 font-bold">{editBannerEffect}</span>
                            </div>
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

            {/* Name with Holographic Shimmer Effect */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-1.5 ${
                  isNitroPro ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent animate-pulse' : 'text-slate-900 dark:text-white'
                }`}>
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

            {/* SERVER LEVEL 1-3 BOOST FEATURES ROW (Holographic Gradient Roles) */}
            {profileContext === 'server' && profile.serverRoles && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Server Roles (Level 1 Revamp):</span>
                {profile.serverRoles.map(role => (
                  <span
                    key={role.id}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm border border-slate-700/40 ${
                      role.animated 
                        ? `bg-gradient-to-r ${role.colorGradient} bg-clip-text text-transparent animate-pulse` 
                        : 'text-purple-400 bg-purple-950/40'
                    }`}
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            )}

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
              {profile.badges.map((badge, idx) => (
                <Tooltip.Root key={`badge-${badge.id}-${idx}`}>
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
                    value="server_preview"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'server_preview'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-pink-500" />
                    <span>Server Boost Preview</span>
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
                    value="subscription"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeTab === 'subscription'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'text-purple-600 dark:text-purple-400 hover:text-purple-800'
                    }`}
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Nitro Tiers</span>
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

              {/* SERVER BOOST LEVEL 1-3 PREVIEW TAB */}
              <Tabs.Content value="server_preview" className="outline-none space-y-4">
                <div className="bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
                  
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-pink-500 fill-pink-500" />
                      Server Boost Level 1-3 Community Container Animations
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Applying Nitro Server Boosts unlocks physical animations for the entire community server sidebar & header:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Level 1: Animated Server Sidebar Icon */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">Level 1 Boost</span>
                        <Crown className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500 animate-spin" style={{ animationDuration: '10s' }}>
                          <img src={profile.animatedServerIcon || profile.serverIcon} alt="Animated Server Icon" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">Animated Server Bubble</div>
                          <div className="text-[10px] text-slate-400">Looping GIF on sidebar hover</div>
                        </div>
                      </div>
                    </div>

                    {/* Level 1: Holographic Gradient Roles */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">Level 1 Revamp</span>
                        <Award className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Animated Gradient Roles</div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-extrabold bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                            @Core Lead
                          </span>
                          <span className="text-xs font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                            @MNC Architect
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Level 3: Animated Server Sidebar Banner */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 dark:bg-pink-950 px-2 py-0.5 rounded-full">Level 3 Boost</span>
                        <Zap className="w-4 h-4 text-pink-500 fill-pink-500" />
                      </div>
                      <div className="h-16 rounded-xl overflow-hidden relative bg-slate-950">
                        <img src={profile.animatedServerBanner || profile.serverBanner} alt="Animated Server Banner" className="w-full h-full object-cover animate-pulse" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[11px] font-bold text-white">
                          Animated Server Header Banner
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </Tabs.Content>

              {/* SOUNDBOARD TAB CONTENT */}
              <Tabs.Content value="soundboard" className="outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {mockSoundboard.map(sound => (
                    <button
                      key={sound.id}
                      type="button"
                      onClick={() => playSoundboardClip(sound)}
                      className={`p-4 rounded-2xl border flex items-center justify-between text-left transition cursor-pointer group ${
                        sound.lockedForFree 
                          ? 'bg-slate-100/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60' 
                          : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-125 transition transform">{sound.emoji}</span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                            {sound.name}
                            {sound.lockedForFree && <Lock className="w-3 h-3 text-amber-500" />}
                          </div>
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
                    <div key={`media-item-${idx}`} className="aspect-square rounded-2xl overflow-hidden bg-slate-900 group relative cursor-pointer">
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
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              {/* NITRO SUBSCRIPTION TIERS TAB CONTENT */}
              <Tabs.Content value="subscription" className="outline-none space-y-4">
                <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                    Upgrade Your Profile to Full Discord Nitro
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecting a subscription plan instantly unlocks all avatar decorations, banner effects, soundboard clips, and persists state in IndexedDB!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {SUBSCRIPTION_PLANS.map(plan => {
                    const isSelected = subscriptionTier === plan.id;
                    return (
                      <div 
                        key={plan.id}
                        className={`rounded-3xl p-6 border flex flex-col justify-between relative transition-all duration-300 ${plan.color} ${
                          isSelected ? 'ring-2 ring-purple-500 shadow-2xl scale-102' : 'hover:border-purple-400/60'
                        }`}
                      >
                        {plan.recommended && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-900 font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-full shadow-lg">
                            FULL NITRO UNLOCKED
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                              {plan.badge}
                            </span>
                            <h4 className="text-lg font-extrabold mt-3">{plan.name}</h4>
                            <div className="text-2xl font-black mt-1">
                              {plan.price} <span className="text-xs font-normal opacity-80">/{plan.period}</span>
                            </div>
                          </div>

                          <ul className="space-y-2.5 text-xs font-medium">
                            {plan.features.map((feat, idx) => (
                              <li key={`${plan.id}-feat-${idx}`} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectSubscription(plan.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition cursor-pointer shadow-md ${
                            isSelected 
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {isSelected ? 'Active Plan (IndexedDB Saved)' : `Switch to ${plan.name}`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Tabs.Content>

            </Tabs.Root>

          </div>

        </div>

      </div>

      {/* RADIX UI DIALOG MODAL FOR NITRO SUBSCRIPTION PAYWALL */}
      <Dialog.Root open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                Unlock Discord Nitro Pro Perks
              </Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Select a subscription plan below to unlock all avatar decorations, animated banners, full soundboard clips, and server boost perks! State is saved to IndexedDB.
              </p>

              <div className="space-y-3">
                {SUBSCRIPTION_PLANS.map(plan => {
                  const isSelected = subscriptionTier === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-purple-400'
                      }`}
                      onClick={() => handleSelectSubscription(plan.id)}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          {plan.name}
                          {isSelected && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full font-bold">Active</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{plan.price} / {plan.period}</div>
                      </div>

                      <button
                        type="button"
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                          isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-purple-600 text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </Tooltip.Provider>
  );
}
