import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus,
  Send, 
  Pin, 
  X, 
  Paperclip, 
  Sparkles,
  Volume2,
  VolumeX,
  Crown,
  SmilePlus,
  Music,
  FileText,
  Check,
  CheckCheck,
  Clock,
  Hash,
  Reply,
  Edit2,
  Trash2,
  Phone,
  Mic,
  MicOff,
  PhoneOff
} from 'lucide-react';
import type { 
  ChatItem, 
  ChatListCardProps, 
  Message, 
  MessageAttachment, 
  MessageReaction, 
  MessageReplyPreview,
  SubscriptionTier, 
  AvatarDecoration 
} from './types';

export type { ChatItem, ChatListCardProps, Message, MessageAttachment, MessageReaction, MessageReplyPreview, SubscriptionTier, AvatarDecoration };

/* ========================================================
   INDEXEDDB PERSISTENCE ENGINE FOR DISCORD CHAT LIST
======================================================== */
const DB_NAME = 'DiscordChatListDB';
const DB_VERSION = 1;
const STORE_CHATS = 'chatsData';

let dbPromiseCache: Promise<IDBDatabase> | null = null;

function openChatDB(): Promise<IDBDatabase> {
  if (!dbPromiseCache) {
    dbPromiseCache = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_CHATS)) {
          db.createObjectStore(STORE_CHATS);
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

async function idbSaveChats(key: string, data: any) {
  try {
    const db = await openChatDB();
    const tx = db.transaction(STORE_CHATS, 'readwrite');
    tx.objectStore(STORE_CHATS).put(data, key);
  } catch (err) {
    console.warn('IndexedDB save skipped:', err);
  }
}

async function idbLoadChats(key: string): Promise<any> {
  try {
    const db = await openChatDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CHATS, 'readonly');
      const req = tx.objectStore(STORE_CHATS).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/* ========================================================
   DISCORD NITRO CUSTOM EMOJIS & STICKERS CATALOG
======================================================== */
const NITRO_CUSTOM_EMOJIS = [
  { code: ':pepe_hype:', emoji: '🐸⚡', name: 'Pepe Hype', isNitro: true },
  { code: ':cat_jam:', emoji: '🐱🎶', name: 'Cat Jam', isNitro: true },
  { code: ':blob_bounce:', emoji: '🍮✨', name: 'Blob Bounce', isNitro: true },
  { code: ':anime_dance:', emoji: '💃🌸', name: 'Anime Dance', isNitro: true },
  { code: ':fire_hypesquad:', emoji: '🔥🌟', name: 'HypeSquad Fire', isNitro: true },
  { code: ':heart_sparkles:', emoji: '💖✨', name: 'Heart Sparkles', isNitro: false },
  { code: ':thumbs_up:', emoji: '👍', name: 'Thumbs Up', isNitro: false },
  { code: ':rocket_boost:', emoji: '🚀', name: 'Rocket Boost', isNitro: false }
];

const NITRO_ANIMATED_STICKERS = [
  { id: 'st1', name: 'Cyberpunk Neon Wave', emoji: '🌌', isNitroPro: true },
  { id: 'st2', name: 'Golden Dragon Flame', emoji: '🐉', isNitroPro: true },
  { id: 'st3', name: 'Sakura Petal Breeze', emoji: '🌸', isNitroPro: true }
];

const NITRO_SOUNDBOARD_CLIPS = [
  { id: 'sb1', name: 'Airhorn Blast', emoji: '📢', freq: 750, isNitroPro: true },
  { id: 'sb2', name: 'Quack Quack', emoji: '🦆', freq: 440, isNitroPro: true },
  { id: 'sb3', name: 'Victory Horn', emoji: '🎺', freq: 880, isNitroPro: true },
  { id: 'sb4', name: 'Laser Super Shot', emoji: '⚡', freq: 950, isNitroPro: true }
];

const INITIAL_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    animatedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarDecoration: 'anime_power_aura',
    lastMessage: 'Check out these custom Nitro animated emojis 🚀',
    timestamp: '1h ago',
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    isTyping: true,
    category: 'dm',
    statusText: 'Streaming Next.js + Radix UI',
    messages: [
      { 
        id: 'm1', 
        senderId: '1', 
        senderName: 'Priya Sharma', 
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        animatedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        avatarDecoration: 'anime_power_aura',
        text: 'Hey Ray! Did you test our new Nitro Chat list Super Reactions engine? 🐸⚡', 
        timestamp: '1:15 PM',
        status: 'read',
        isPinned: true
      },
      { 
        id: 'm2', 
        senderId: 'me', 
        senderName: 'You', 
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Yes! Super Reactions trigger explosive Framer Motion particle bursts 🔥', 
        timestamp: '1:18 PM', 
        isMe: true, 
        status: 'read', 
        reactions: [
          { emoji: '⚡🌟', count: 4, users: ['1'], isSuperReaction: true }
        ] 
      },
      { 
        id: 'm3', 
        senderId: '1', 
        senderName: 'Priya Sharma', 
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Check out these custom Nitro animated emojis 🚀', 
        timestamp: '1:20 PM', 
        status: 'read',
        reactions: [{ emoji: '❤️', count: 2, users: ['me'] }] 
      }
    ]
  },
  {
    id: 'c1',
    name: 'general-lounge',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Welcome everyone to the Nitro Community lounge!',
    timestamp: '2h ago',
    unreadCount: 5,
    category: 'channel',
    serverIcon: '🌐',
    statusText: 'Official Community Lounge',
    messages: [
      {
        id: 'cm1',
        senderId: 'bot',
        senderName: 'Nitro Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        text: 'Welcome everyone to the Nitro Community lounge! 🚀 Enjoy HD file uploads & soundboards.',
        timestamp: '11:00 AM',
        status: 'read',
        isPinned: true
      }
    ]
  },
  {
    id: '2',
    name: 'James Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    animatedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarDecoration: 'cyber_hacker_void',
    lastMessage: 'Let me check and get back to you.',
    timestamp: 'Yesterday',
    isOnline: true,
    category: 'dm',
    statusText: 'Online',
    messages: [
      { id: 'm1', senderId: '2', senderName: 'James Okonkwo', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'Can we schedule the review meeting tomorrow?', timestamp: 'Yesterday', status: 'read' }
    ]
  }
];

/* ========================================================
   SHOP AVATAR DECORATIONS FRAME RENDERER
======================================================== */
const AvatarDecorationFrame = React.memo(({ decoration, isUnlocked }: { decoration?: AvatarDecoration; isUnlocked: boolean }) => {
  if (!decoration || decoration === 'none' || !isUnlocked) return null;

  if (decoration === 'anime_power_aura') {
    return (
      <div className="absolute -inset-2.5 rounded-full z-10 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="w-full h-full rounded-full border-2 border-amber-400/90 shadow-[0_0_18px_rgba(251,191,36,0.9)] opacity-90"
        />
        <div className="absolute top-0 right-1 w-2.5 h-2.5 bg-amber-300 rounded-full blur-xs animate-ping" />
      </div>
    );
  }

  if (decoration === 'cyber_hacker_void') {
    return (
      <div className="absolute -inset-2 rounded-full z-10 pointer-events-none">
        <div className="w-full h-full rounded-full border-2 border-emerald-400 animate-pulse shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
        <div className="absolute inset-0 border border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '5s' }} />
      </div>
    );
  }

  if (decoration === 'celestial_orbit') {
    return (
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        className="absolute -inset-3 rounded-full border-2 border-dashed border-indigo-400 z-10 pointer-events-none shadow-[0_0_18px_rgba(129,140,248,0.95)]"
      >
        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-indigo-300 rounded-full shadow-lg" />
      </motion.div>
    );
  }

  return null;
});
AvatarDecorationFrame.displayName = 'AvatarDecorationFrame';

/* ========================================================
   MAIN MNC DISCORD NITRO CHAT LIST CARD COMPONENT
======================================================== */
export function ChatListCard({
  title = "Discord Nitro Channels & DMs",
  chats: initialChatsProp,
  initialSubscriptionTier = 'nitro_pro',
  onSelectChat,
  onNewChat
}: ChatListCardProps) {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(initialSubscriptionTier);
  const [chats, setChats] = useState<ChatItem[]>(initialChatsProp || INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '1');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Voice Call Active State Overlay
  const [activeVoiceCall, setActiveVoiceCall] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);

  // Replying Quote State
  const [replyTarget, setReplyTarget] = useState<MessageReplyPreview | null>(null);

  // Editing Message State
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);

  // Super Reaction Burst Particles
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Soundboard Active Playing Animation State
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);

  const isNitroPro = subscriptionTier === 'nitro_pro';
  const isNitroBasic = subscriptionTier === 'nitro_basic' || isNitroPro;

  // Selected Active Chat Object
  const activeChat = useMemo(() => chats.find(c => c.id === selectedChatId) || chats[0], [chats, selectedChatId]);

  // Filtered Chats by Search Query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  // Pinned Messages in Active Chat Thread
  const pinnedMessages = useMemo(() => {
    return activeChat.messages.filter(m => m.isPinned);
  }, [activeChat]);

  // Toast Notification Trigger
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Web Audio Synthesizer Engine
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
      osc.onended = () => { try { ctx.close(); } catch {} };
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }, [soundEnabled]);

  // Auto-Hydrate from IndexedDB on mount
  useEffect(() => {
    idbLoadChats('discordChatListState').then(stored => {
      if (stored) {
        if (stored.chats && stored.chats.length > 0) setChats(stored.chats);
        if (stored.subscriptionTier) setSubscriptionTier(stored.subscriptionTier);
      }
    });
  }, []);

  // Auto-Save to IndexedDB
  useEffect(() => {
    const handler = setTimeout(() => {
      idbSaveChats('discordChatListState', { chats, subscriptionTier });
    }, 500);
    return () => clearTimeout(handler);
  }, [chats, subscriptionTier]);

  // Super Reaction Trigger Particle Blast
  const triggerSuperReactionBlast = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left + (Math.random() * 80 - 40),
      y: e.clientY - rect.top + (Math.random() * 80 - 40)
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Send or Edit Message Logic with Real-Time Status Lifecycle
  const handleSendMessage = useCallback((overrideText?: string, attachment?: MessageAttachment) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend && !attachment) return;

    playHapticSound(750, 'triangle');

    // If Editing Existing Message
    if (editingMsgId) {
      setChats(prev => prev.map(c => {
        if (c.id !== activeChat.id) return c;
        return {
          ...c,
          messages: c.messages.map(m => m.id === editingMsgId ? { ...m, text: textToSend, isEdited: true } : m)
        };
      }));
      setEditingMsgId(null);
      setInputText('');
      showToast('Edited message updated!');
      return;
    }

    const msgId = 'm-' + Date.now();
    const newMsg: Message = {
      id: msgId,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      animatedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      avatarDecoration: isNitroPro ? 'anime_power_aura' : 'none',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sending',
      replyToMessage: replyTarget || undefined,
      attachment
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          lastMessage: textToSend || (attachment?.name ? `Sent ${attachment.type}` : 'Attachment'),
          timestamp: 'Just now',
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));

    if (!overrideText) setInputText('');
    setReplyTarget(null);

    // Simulate MNC status delivery transitions (sending -> delivered -> read)
    setTimeout(() => {
      setChats(prev => prev.map(c => ({
        ...c,
        messages: c.messages.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m)
      })));
    }, 600);

    setTimeout(() => {
      setChats(prev => prev.map(c => ({
        ...c,
        messages: c.messages.map(m => m.id === msgId ? { ...m, status: 'read' } : m)
      })));
    }, 1500);

    showToast('Message sent & saved to IndexedDB 🚀');
  }, [inputText, editingMsgId, activeChat.id, isNitroPro, replyTarget, playHapticSound, showToast]);

  // File Attachment Upload Handler with Tier Validation
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    const maxMb = subscriptionTier === 'nitro_pro' ? 500 : subscriptionTier === 'nitro_basic' ? 50 : 8;

    if (sizeMb > maxMb) {
      showToast(`❌ File size exceeds ${maxMb}MB limit for ${subscriptionTier.toUpperCase()} plan!`);
      setIsSubscriptionModalOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      handleSendMessage(`Sent file attachment: ${file.name}`, {
        name: file.name,
        url: result,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: `${sizeMb.toFixed(1)} MB`
      });
    };
    reader.readAsDataURL(file);
  }, [subscriptionTier, handleSendMessage, showToast]);

  // Send Nitro Custom Emoji
  const handleInsertEmoji = useCallback((emojiObj: typeof NITRO_CUSTOM_EMOJIS[0]) => {
    if (emojiObj.isNitro && !isNitroBasic) {
      showToast('🔒 Custom Nitro Emojis require Nitro Basic or Nitro Pro subscription');
      setIsSubscriptionModalOpen(true);
      return;
    }
    setInputText(prev => prev + ' ' + emojiObj.emoji);
    showToast(`Inserted Custom Emoji ${emojiObj.emoji}`);
  }, [isNitroBasic, showToast]);

  // Send Soundboard Clip to Chat
  const handleSendSoundboardClip = useCallback((sound: typeof NITRO_SOUNDBOARD_CLIPS[0]) => {
    if (sound.isNitroPro && !isNitroPro) {
      showToast('🔒 Soundboard Audio Clips require Nitro Pro subscription ($9.99/mo)');
      setIsSubscriptionModalOpen(true);
      return;
    }
    playHapticSound(sound.freq, 'triangle');
    setPlayingSoundId(sound.id);
    setTimeout(() => setPlayingSoundId(null), 1800);

    handleSendMessage(`Posted Soundboard Clip: ${sound.emoji} ${sound.name}`, {
      name: sound.name,
      url: '',
      type: 'soundboard',
      soundFreq: sound.freq,
      soundEmoji: sound.emoji
    });
  }, [isNitroPro, handleSendMessage, playHapticSound, showToast]);

  // Add Reaction to Message
  const handleAddReactionToMessage = useCallback((msgId: string, emoji: string, isSuper = false) => {
    playHapticSound(620);
    setChats(prev => prev.map(c => {
      if (c.id !== activeChat.id) return c;
      return {
        ...c,
        messages: c.messages.map(m => {
          if (m.id !== msgId) return m;
          const rxList = m.reactions || [];
          const existing = rxList.find(r => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: rxList.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
            };
          }
          return {
            ...m,
            reactions: [...rxList, { emoji, count: 1, users: ['me'], isSuperReaction: isSuper }]
          };
        })
      };
    }));
    showToast(`Added reaction ${emoji}`);
  }, [activeChat.id, playHapticSound, showToast]);

  // Delete Message Handler
  const handleDeleteMessage = useCallback((msgId: string) => {
    playHapticSound(300);
    setChats(prev => prev.map(c => {
      if (c.id !== activeChat.id) return c;
      return {
        ...c,
        messages: c.messages.filter(m => m.id !== msgId)
      };
    }));
    showToast('Message deleted');
  }, [activeChat.id, playHapticSound, showToast]);

  // Toggle Pin Message Handler
  const handleTogglePinMessage = useCallback((msgId: string) => {
    playHapticSound(580);
    setChats(prev => prev.map(c => {
      if (c.id !== activeChat.id) return c;
      return {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
      };
    }));
    showToast('Updated pinned message');
  }, [activeChat.id, playHapticSound, showToast]);

  return (
    <Tooltip.Provider>
      <div className="w-full max-w-6xl mx-auto font-sans selection:bg-purple-500 selection:text-white relative">
        
        {/* Toast Notification Pill */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              role="status"
              className="fixed top-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700/50 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP DISCORD NITRO SUBSCRIPTION HEADER PILL */}
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
              {title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition transform hover:scale-105 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Active Plan: {subscriptionTier.toUpperCase()}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </button>
        </div>

        {/* MAIN CONTAINER: SIDEBAR CHAT LIST + CHAT THREAD VIEW */}
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[720px] backdrop-blur-xl relative">
          
          {/* Super Reaction Particle Explosion Burst Overlay */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ y: -80, opacity: 0, scale: 2 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute z-50 text-2xl pointer-events-none drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              style={{ left: p.x, top: p.y }}
            >
              ⚡🌟🔥💖
            </motion.span>
          ))}

          {/* LEFT SIDEBAR: CHANNEL & DIRECT MESSAGE CHAT LIST */}
          <div className="w-full md:w-80 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
            
            {/* Search Header */}
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search channel or DMs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onNewChat) onNewChat();
                  showToast('Creating new DM channel...');
                }}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer transition shadow-xs shrink-0"
                title="New Chat DM"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Chat List Items Filtered by Search */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredChats.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No channels or DMs found matching "{searchQuery}"
                </div>
              ) : (
                filteredChats.map(chat => {
                  const isSelected = chat.id === selectedChatId;
                  const isChannel = chat.category === 'channel';
                  return (
                    <div
                      key={chat.id}
                      onClick={() => { playHapticSound(450); setSelectedChatId(chat.id); if (onSelectChat) onSelectChat(chat); }}
                      className={`p-3 rounded-2xl cursor-pointer transition flex items-center gap-3 relative ${
                        isSelected 
                          ? 'bg-purple-600/10 dark:bg-purple-950/40 border border-purple-500/40 shadow-xs' 
                          : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      {/* Avatar or Channel Icon */}
                      <div className="relative shrink-0 w-11 h-11">
                        {isChannel ? (
                          <div className="w-full h-full rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-base">
                            <Hash className="w-5 h-5 text-purple-400" />
                          </div>
                        ) : (
                          <>
                            <AvatarDecorationFrame decoration={chat.avatarDecoration} isUnlocked={isNitroPro} />
                            <img
                              src={isNitroPro && chat.animatedAvatar ? chat.animatedAvatar : chat.avatar}
                              alt={chat.name}
                              className="w-full h-full rounded-full object-cover relative z-10"
                            />
                            {chat.isOnline && (
                              <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 absolute bottom-0 right-0 z-20" />
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                            {isChannel ? `# ${chat.name}` : chat.name}
                            {chat.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{chat.timestamp}</span>
                        </div>

                        {chat.isTyping ? (
                          <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1 animate-pulse">
                            <span>typing</span>
                            <span className="w-1 h-1 bg-purple-400 rounded-full animate-ping" />
                          </span>
                        ) : (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                        )}
                      </div>

                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="bg-purple-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT VIEW: ACTIVE CHAT THREAD & MESSAGES FEED */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            
            {/* Active Channel Header */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  {activeChat.category === 'channel' ? (
                    <div className="w-full h-full rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-base">
                      <Hash className="w-5 h-5 text-purple-400" />
                    </div>
                  ) : (
                    <>
                      <AvatarDecorationFrame decoration={activeChat.avatarDecoration} isUnlocked={isNitroPro} />
                      <img src={isNitroPro && activeChat.animatedAvatar ? activeChat.animatedAvatar : activeChat.avatar} alt={activeChat.name} className="w-full h-full rounded-full object-cover relative z-10" />
                    </>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    {activeChat.category === 'channel' ? `# ${activeChat.name}` : activeChat.name}
                    {isNitroPro && (
                      <span className="text-[9px] font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.2 rounded-full shadow-xs">
                        NITRO MEMBER
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">{activeChat.statusText || 'Active in channel'}</div>
                </div>
              </div>

              {/* Header Action Controls (Voice Call, Pinned Drawer, Audio Haptics) */}
              <div className="flex items-center gap-2">
                
                {/* Start Voice Call Button */}
                <button
                  type="button"
                  onClick={() => {
                    playHapticSound(activeVoiceCall ? 400 : 800);
                    setActiveVoiceCall(!activeVoiceCall);
                    showToast(!activeVoiceCall ? 'Connected to Voice Channel 🎧' : 'Disconnected Voice Call');
                  }}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    activeVoiceCall 
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md animate-pulse' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Toggle Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* Pinned Messages Popover Drawer */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button type="button" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition">
                      <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl z-50 w-72 text-white space-y-3">
                      <div className="font-bold text-xs flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          Pinned Channel Messages ({pinnedMessages.length})
                        </span>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {pinnedMessages.length === 0 ? (
                          <div className="text-[11px] text-slate-400">No pinned messages yet.</div>
                        ) : (
                          pinnedMessages.map(pm => (
                            <div key={pm.id} className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                              <div className="font-bold text-purple-400 text-[10px]">{pm.senderName} • {pm.timestamp}</div>
                              <p className="text-slate-200 text-[11px] mt-0.5">{pm.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Sound Haptics Toggle */}
                <button type="button" onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Active Voice Call Floating Banner */}
            <AnimatePresence>
              {activeVoiceCall && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2.5 flex items-center justify-between backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Voice Connected / 24ms RTC Latency
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isMicMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-emerald-300'
                      }`}
                    >
                      {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveVoiceCall(false)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Feed Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map((msg) => {
                return (
                  <div key={msg.id} className={`flex items-start gap-3 group relative ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Clickable Mini Profile Popover Avatar */}
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button type="button" className="relative w-9 h-9 shrink-0 cursor-pointer">
                          <AvatarDecorationFrame decoration={msg.avatarDecoration} isUnlocked={isNitroPro} />
                          <img src={isNitroPro && msg.animatedAvatar ? msg.animatedAvatar : msg.senderAvatar} alt={msg.senderName} className="w-full h-full rounded-full object-cover relative z-10 hover:ring-2 hover:ring-purple-500 transition" />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl z-50 w-60 text-white space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={msg.senderAvatar} alt={msg.senderName} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500" />
                            <div>
                              <div className="font-bold text-xs">{msg.senderName}</div>
                              <div className="text-[10px] text-purple-400 font-mono">@member</div>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-300 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
                            💬 Active in Discord Nitro Community
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast(`Direct Messaging ${msg.senderName}...`)}
                            className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer"
                          >
                            Send Direct Message
                          </button>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                    <div className={`max-w-md space-y-1 ${msg.isMe ? 'items-end text-right' : ''}`}>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>

                        {msg.isEdited && <span className="text-[9px] text-slate-400 italic">(edited)</span>}

                        {/* Real-Time Message Status Delivery Indicators */}
                        {msg.isMe && (
                          <span className="ml-1 text-[10px]">
                            {msg.status === 'sending' && <Clock className="w-3 h-3 text-amber-400 inline animate-spin" />}
                            {msg.status === 'delivered' && <Check className="w-3 h-3 text-slate-400 inline" />}
                            {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-cyan-400 inline" />}
                          </span>
                        )}
                      </div>

                      {/* Quoted Reply Preview */}
                      {msg.replyToMessage && (
                        <div className="text-[10px] bg-slate-200/80 dark:bg-slate-800/80 border-l-2 border-purple-500 px-2.5 py-1 rounded-r-lg text-slate-600 dark:text-slate-300 font-medium">
                          Replying to <span className="font-bold text-purple-400">{msg.replyToMessage.senderName}</span>: "{msg.replyToMessage.text}"
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border relative shadow-xs ${
                        msg.isMe 
                          ? 'bg-purple-600 text-white border-purple-500' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200/80 dark:border-slate-700/60'
                      }`}>
                        <p>{msg.text}</p>

                        {/* File Attachment Card */}
                        {msg.attachment && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {msg.attachment.type === 'soundboard' ? (
                                <Music className="w-4 h-4 text-amber-300" />
                              ) : (
                                <FileText className="w-4 h-4 text-cyan-300" />
                              )}
                              <div className="text-[11px] font-bold text-white truncate">{msg.attachment.name}</div>
                            </div>

                            {msg.attachment.type === 'soundboard' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (msg.attachment?.soundFreq) playHapticSound(msg.attachment.soundFreq, 'triangle');
                                  showToast(`Playing Soundboard: ${msg.attachment?.name}`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                              >
                                Play Audio 🔊
                              </button>
                            )}
                          </div>
                        )}

                        {/* Reactions Row */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {msg.reactions.map((rx, idx) => (
                              <button
                                key={`rx-${idx}`}
                                type="button"
                                onClick={(e) => {
                                  if (rx.isSuperReaction) triggerSuperReactionBlast(e);
                                  playHapticSound(600);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border cursor-pointer ${
                                  rx.isSuperReaction 
                                    ? 'bg-gradient-to-r from-amber-500/30 to-pink-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse' 
                                    : 'bg-black/20 border-white/20 text-white'
                                }`}
                              >
                                <span>{rx.emoji}</span>
                                <span>{rx.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Reaction & Quick Action Bar */}
                    <div className="hidden group-hover:flex items-center gap-1 bg-slate-900 text-white p-1 rounded-xl shadow-lg border border-slate-800 text-[10px] absolute -top-3 right-4 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          triggerSuperReactionBlast(e);
                          handleAddReactionToMessage(msg.id, '⚡🌟', true);
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-amber-400 font-bold cursor-pointer"
                        title="Add Super Reaction"
                      >
                        ⚡🌟
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTarget({ id: msg.id, senderName: msg.senderName, text: msg.text });
                          showToast(`Replying to ${msg.senderName}`);
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-purple-400 cursor-pointer"
                        title="Reply to message"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      {msg.isMe && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMsgId(msg.id);
                            setInputText(msg.text);
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-blue-400 cursor-pointer"
                          title="Edit message"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTogglePinMessage(msg.id)}
                        className="p-1 hover:bg-slate-800 rounded text-amber-400 cursor-pointer"
                        title="Pin message"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      {msg.isMe && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 hover:bg-slate-800 rounded text-rose-400 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Replying Preview Banner Above Input */}
            {replyTarget && (
              <div className="bg-purple-950/40 border-t border-purple-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-purple-300">
                <span>Replying to <strong>{replyTarget.senderName}</strong>: "{replyTarget.text.slice(0, 30)}..."</span>
                <button type="button" onClick={() => setReplyTarget(null)} className="p-1 hover:text-white cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* CHAT INPUT BAR WITH EMOJI & SOUNDBOARD DRAWERS */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
              
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                
                {/* File Upload Button */}
                <label className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition">
                  <Paperclip className="w-4 h-4 text-purple-500" />
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Custom Nitro Emojis Popover Drawer */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition">
                      <SmilePlus className="w-4 h-4 text-pink-500" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-2xl z-50 w-64 space-y-2">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Nitro Custom Emojis</span>
                        <span className="text-[9px] font-mono text-purple-400">{isNitroBasic ? 'UNLOCKED' : 'LOCKED'}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {NITRO_CUSTOM_EMOJIS.map((em, idx) => (
                          <button
                            key={`em-${idx}`}
                            type="button"
                            onClick={() => handleInsertEmoji(em)}
                            className="p-2 rounded-xl hover:bg-slate-800 text-lg transition flex items-center justify-center cursor-pointer"
                          >
                            {em.emoji}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Animated Nitro Stickers</div>
                        <div className="grid grid-cols-3 gap-1">
                          {NITRO_ANIMATED_STICKERS.map((stk) => (
                            <button
                              key={stk.id}
                              type="button"
                              onClick={() => {
                                if (!isNitroPro) {
                                  showToast('🔒 Animated Stickers require Nitro Pro ($9.99/mo)');
                                  setIsSubscriptionModalOpen(true);
                                  return;
                                }
                                handleSendMessage(`Posted Sticker: ${stk.emoji} ${stk.name}`);
                                showToast(`Posted Sticker ${stk.name}`);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-purple-300 flex items-center justify-center cursor-pointer border border-purple-500/20"
                            >
                              <span>{stk.emoji}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Nitro Soundboard Clips Popover Drawer */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition">
                      <Music className="w-4 h-4 text-amber-400" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-2xl z-50 w-64 space-y-2">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Nitro Soundboard Clips</span>
                        <span className="text-[9px] font-mono text-amber-400">{isNitroPro ? 'UNLOCKED' : 'LOCKED'}</span>
                      </div>
                      <div className="space-y-1">
                        {NITRO_SOUNDBOARD_CLIPS.map((sound) => (
                          <button
                            key={sound.id}
                            type="button"
                            onClick={() => handleSendSoundboardClip(sound)}
                            className="w-full p-2 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between transition cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{sound.emoji} {sound.name}</span>
                              {playingSoundId === sound.id && (
                                <span className="flex items-center gap-0.5 text-amber-400 animate-pulse">
                                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                                  <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce delay-100" />
                                </span>
                              )}
                            </span>
                            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                <input
                  type="text"
                  placeholder={`Message #${activeChat.name}... (${subscriptionTier.toUpperCase()} Mode)`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{editingMsgId ? 'Save' : 'Send'}</span>
                </button>

              </form>
            </div>

          </div>

        </div>

        {/* RADIX UI DIALOG MODAL FOR NITRO SUBSCRIPTION TIER SELECTION */}
        <Dialog.Root open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Discord Nitro Subscription Tiers
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'free', name: 'Free Tier', price: '$0', desc: 'Standard chat list, max 8MB uploads' },
                  { id: 'nitro_basic', name: 'Nitro Basic', price: '$2.99/mo', desc: 'Custom Nitro Emojis everywhere, 50MB uploads' },
                  { id: 'nitro_pro', name: 'Nitro Pro (Full Nitro)', price: '$9.99/mo', desc: 'Animated GIF Avatars, Super Reactions, Soundboard clips, 500MB uploads' }
                ].map(plan => {
                  const isSelected = subscriptionTier === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        setSubscriptionTier(plan.id as SubscriptionTier);
                        setIsSubscriptionModalOpen(false);
                        showToast(`Switched plan to ${plan.name}! Perks unlocked 🚀`);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          {plan.name}
                          {isSelected && <span className="text-[9px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full">ACTIVE</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{plan.desc}</div>
                      </div>
                      <span className="font-black text-xs text-purple-500">{plan.price}</span>
                    </button>
                  );
                })}
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>
    </Tooltip.Provider>
  );
}
