import { VirtualizedSidebarList } from "./virtualized-sidebar-list";
import { VirtualizedMessageStream } from './virtualized-message-stream';
import { AvatarWithFallback } from './avatar-with-fallback';
import { ChatInputEditor } from './chat-input-editor';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Pin, 
  PinOff,
  X, 
  Paperclip, 
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Share2,
  Ban,
  Trash2,
  SmilePlus,
  FileText,
  Crown,
  Music,
  Mic,
  Square,
  Palette,
  Sticker
} from 'lucide-react';
import type { 
  ChatItem, 
  ChatListCardProps, 
  Message, 
  MessageAttachment, 
  MessageReaction,
  SubscriptionTier,
  NitroCustomEmoji,
  NitroSoundClip,
  ChatTheme,
  ChatThemeId,
  NitroSticker,
  VoiceNote
} from './types';

export type { 
  ChatItem, 
  ChatListCardProps, 
  Message, 
  MessageAttachment, 
  MessageReaction, 
  SubscriptionTier, 
  NitroCustomEmoji, 
  NitroSoundClip,
  ChatTheme,
  ChatThemeId,
  NitroSticker,
  VoiceNote
};



const CHAT_THEMES: ChatTheme[] = [
  { id: 'default', name: 'Discord Slate', gradient: 'from-slate-900 via-slate-900 to-slate-900', cardBg: 'bg-white dark:bg-slate-900', textAccent: 'text-blue-500', isNitroOnly: false },
  { id: 'synthwave', name: 'Synthwave Neon', gradient: 'from-purple-950 via-slate-900 to-pink-950', cardBg: 'bg-purple-950/60 dark:bg-purple-950/80', textAccent: 'text-pink-400', isNitroOnly: true },
  { id: 'emerald', name: 'Cyber Emerald', gradient: 'from-emerald-950 via-slate-900 to-teal-950', cardBg: 'bg-emerald-950/60 dark:bg-emerald-950/80', textAccent: 'text-emerald-400', isNitroOnly: true },
  { id: 'obsidian', name: 'Midnight Obsidian', gradient: 'from-slate-950 via-black to-slate-950', cardBg: 'bg-slate-950 dark:bg-black', textAccent: 'text-cyan-400', isNitroOnly: true },
  { id: 'solar', name: 'Solar Gold', gradient: 'from-amber-950 via-slate-900 to-orange-950', cardBg: 'bg-amber-950/60 dark:bg-amber-950/80', textAccent: 'text-amber-400', isNitroOnly: true },
  { id: 'sakura', name: 'Sakura Moonlight', gradient: 'from-rose-950 via-slate-900 to-indigo-950', cardBg: 'bg-rose-950/60 dark:bg-rose-950/80', textAccent: 'text-rose-400', isNitroOnly: true }
];

const NITRO_STICKERS: NitroSticker[] = [
  { id: 'st1', name: 'Wumpus Hype', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', category: 'Wumpus', isNitroOnly: false },
  { id: 'st2', name: 'Clyde Dance', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80', category: 'Clyde', isNitroOnly: true },
  { id: 'st3', name: 'Nitro Flame', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80', category: 'Nitro', isNitroOnly: true },
  { id: 'st4', name: 'Hyper Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80', category: 'Meme', isNitroOnly: true }
];

const NITRO_EMOJIS: NitroCustomEmoji[] = [
  { id: 'ne1', name: 'Nitro Boost', emoji: '🚀', category: 'Nitro Exclusive', animated: true, isNitroOnly: true },
  { id: 'ne2', name: 'HypeSquad Fire', emoji: '⚡', category: 'Nitro Exclusive', animated: true, isNitroOnly: true },
  { id: 'ne3', name: 'Cyber Dragon', emoji: '🐉', category: 'Legendary', animated: true, isNitroOnly: true },
  { id: 'ne4', name: 'Sakura Breeze', emoji: '🌸', category: 'Rare', animated: true, isNitroOnly: false },
  { id: 'ne5', name: 'Cat Jam', emoji: '🐱', category: 'Meme', animated: true, isNitroOnly: true },
  { id: 'ne6', name: 'Party Blob', emoji: '🥳', category: 'Meme', animated: true, isNitroOnly: false }
];

const NITRO_SOUNDS: NitroSoundClip[] = [
  { id: 'ns1', name: 'Airhorn Blast', emoji: '📢', freq: 750, isNitroOnly: false },
  { id: 'ns2', name: 'Quack Quack', emoji: '🦆', freq: 440, isNitroOnly: false },
  { id: 'ns3', name: 'Victory Horn', emoji: '🎺', freq: 880, isNitroOnly: true },
  { id: 'ns4', name: 'Super Laser', emoji: '⚡', freq: 950, isNitroOnly: true }
];

const INITIAL_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: "I've sent the files over.",
    timestamp: '1h ago',
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    statusText: 'Active now',
    nitroTier: 'nitro_pro',
    badge: '👑 Nitro Pro',
    messages: [
      { id: 'm1', senderId: '1', senderName: 'Priya Sharma', text: 'Hey Ray! Did you check the latest design assets?', timestamp: '1:15 PM' },
      { id: 'm2', senderId: 'me', senderName: 'You', text: 'Yes, looking at them now. They look great!', timestamp: '1:18 PM', isMe: true, status: 'read', reactions: [{ emoji: '👍', count: 1, users: ['1'] }] },
      { id: 'm3', senderId: '1', senderName: 'Priya Sharma', text: "I've sent the files over.", timestamp: '1:20 PM', reactions: [{ emoji: '❤️', count: 1, users: ['me'] }] }
    ]
  },
  {
    id: '2',
    name: 'James Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Let me check and get back to you.',
    timestamp: 'Yesterday',
    isOnline: true,
    statusText: 'Online',
    messages: [
      { id: 'm1', senderId: '2', senderName: 'James Okonkwo', text: 'Can we schedule the review meeting tomorrow?', timestamp: 'Yesterday' },
      { id: 'm2', senderId: 'me', senderName: 'You', text: 'Sure, let me know what time works best.', timestamp: 'Yesterday', isMe: true, status: 'read' },
      { id: 'm3', senderId: '2', senderName: 'James Okonkwo', text: 'Let me check and get back to you.', timestamp: 'Yesterday' }
    ]
  },
  {
    id: '3',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'The meeting link is in the calendar.',
    timestamp: 'Yesterday',
    isOnline: false,
    statusText: 'Last seen yesterday',
    messages: [
      { id: 'm1', senderId: '3', senderName: 'Elena Vasquez', text: 'The meeting link is in the calendar.', timestamp: 'Yesterday' }
    ]
  },
  {
    id: '4',
    name: 'Alex Turner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Sure, no problem at all.',
    timestamp: 'Mon',
    isOnline: false,
    statusText: 'Last seen Mon',
    messages: [
      { id: 'm1', senderId: '4', senderName: 'Alex Turner', text: 'Sure, no problem at all.', timestamp: 'Mon' }
    ]
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Looking forward to the demo.',
    timestamp: 'Mon',
    isOnline: true,
    statusText: 'Online',
    messages: [
      { id: 'm1', senderId: '5', senderName: 'Yuki Tanaka', text: 'Looking forward to the demo.', timestamp: 'Mon' }
    ]
  }
];


/* ========================================================
   MEMOIZED CHAT ROW ITEM
======================================================== */



/* ========================================================
   IndexedDB PERSISTENCE LAYER (MNC-GRADE)
======================================================== */
const IDB_NAME = 'ChatStressTestDB';
const IDB_STORE = 'chats';
const IDB_VERSION = 1;

function openStressDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      try {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      } catch (err) {
        reject(err);
      }
    };
    req.onblocked = () => {
      console.warn('IDB Blocked: Please close other tabs.');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Write Queue to prevent concurrent save race conditions
let saveQueue = Promise.resolve();

function idbSaveChats(chats: ChatItem[]): Promise<void> {
  saveQueue = saveQueue.then(() => 
    openStressDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(new Error('IDB Transaction aborted'));
          tx.onerror = () => reject(tx.error);
          
          tx.objectStore(IDB_STORE).put(chats, 'data');
        } catch (err) {
          reject(err);
        } finally {
          // In IDB, tx.oncomplete/onerror handles connection lifecycle in the Promise,
          // but if tx creation itself throws, we close immediately.
          if (db && !db.objectStoreNames) db.close(); 
        }
      }).finally(() => {
        db.close();
      });
    }).catch(err => {
      console.error('Save failed:', err);
    })
  );
  return saveQueue;
}

function idbLoadChats(): Promise<ChatItem[] | null> {
  return openStressDB().then(db => {
    return new Promise<ChatItem[] | null>((resolve, reject) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get('data');
        tx.oncomplete = () => {
          const val = req.result;
          if (Array.isArray(val) && val.length > 0) resolve(val);
          else resolve(null);
        };
        tx.onabort = () => reject(new Error('IDB Transaction aborted'));
        tx.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    }).finally(() => {
      db.close();
    });
  });
}

function idbClearChats(): Promise<void> {
  saveQueue = saveQueue.then(() => 
    openStressDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(new Error('IDB Transaction aborted'));
          tx.onerror = () => reject(tx.error);
          
          tx.objectStore(IDB_STORE).delete('data');
        } catch (err) {
          reject(err);
        }
      }).finally(() => {
        db.close();
      });
    }).catch(err => {
      console.error('Clear failed:', err);
    })
  );
  return saveQueue;
}

/* ========================================================
   MAIN CHAT LIST CARD COMPONENT (EXPANDED MNC PRO GRADE)
======================================================== */
export function ChatListCard({
  title = "Messages",
  chats = INITIAL_CHATS,
  subscriptionTier: initialTier = 'nitro_pro',
  onSubscriptionChange
}: ChatListCardProps) {
  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [tier, setTier] = useState<SubscriptionTier>(initialTier);
  const [activeTheme, setActiveTheme] = useState<ChatThemeId>('synthwave');
  const [showNitroModal, setShowNitroModal] = useState(false);
  const [showNitroEmojiPicker, setShowNitroEmojiPicker] = useState(false);
  const [showNitroSoundPicker, setShowNitroSoundPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  // Voice Note Recording State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);

  // Super Reaction Particle Engine State
  const [superParticles, setSuperParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const isNitroPro = tier === 'nitro_pro';
  const isNitroBasic = tier === 'nitro_basic' || isNitroPro;

  const currentThemeObj = useMemo(() => 
    CHAT_THEMES.find(t => t.id === activeTheme) || CHAT_THEMES[0],
  [activeTheme]);

  // Voice Recording Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => setRecordingSecs(s => s + 1), 1000);
    } else {
      setRecordingSecs(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const selectedChat = useMemo(() => 
    chatList.find(c => c.id === selectedChatId) || chatList[0],
  [chatList, selectedChatId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'pinned'>('all');
  const [newMessageText, setNewMessageText] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);
  const [isDBReady, setIsDBReady] = useState(false);
  const [typingState, setTypingState] = useState<Record<string, boolean>>({});
  
  const chatListRef = useRef<ChatItem[]>(chatList);
  useEffect(() => { chatListRef.current = chatList; }, [chatList]);

  // File Upload Draft State
  const [draftAttachment, setDraftAttachment] = useState<MessageAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // File Upload Validation with Subscription Tier Limits
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
    const sizeMb = file.size / (1024 * 1024);
    const maxMb = tier === 'nitro_pro' ? 500 : tier === 'nitro_basic' ? 50 : 8;

    if (sizeMb > maxMb) {
      setToastMessage(`❌ File size exceeds ${maxMb}MB limit for ${tier.toUpperCase()} plan!`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (isGif && tier !== 'nitro_pro') {
      setToastMessage('🔒 Animated GIF uploads require Nitro Pro subscription ($9.99/mo)');
      setShowNitroModal(true);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setDraftAttachment({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: `${sizeMb.toFixed(1)} MB`,
      isNitroClip: isGif
    });
    setToastMessage('Attachment uploaded! Ready to send ✨');
    setTimeout(() => setToastMessage(null), 2500);
    e.target.value = '';
  }, [tier, showToast]);



  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiReplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // MNC-Grade: Global Timer Cleanup to prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (particlesTimerRef.current) clearTimeout(particlesTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (aiReplyTimerRef.current) clearTimeout(aiReplyTimerRef.current);
    };
  }, []);

  // Progressive Hydration
  useEffect(() => {
    let cancelled = false;
    idbLoadChats()
      .then(stored => {
        if (cancelled) return;
        if (stored && stored.length > 0) {
          setChatList(stored.slice(0, 50));
          setSelectedChatId(stored[0]?.id || '1');
          setIsLoadingFromDB(false);

          if (stored.length > 50 || stored.some(c => c.messages.length > 50)) {
            const timer = setTimeout(() => {
              if (!cancelled) {
                setChatList(stored);
                setIsDBReady(true);
              }
            }, 30);
            return () => clearTimeout(timer);
          } else {
            setIsDBReady(true);
          }
        } else {
          setIsLoadingFromDB(false);
          setIsDBReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoadingFromDB(false);
          setIsDBReady(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Debounced Auto-Save
  useEffect(() => {
    if (!isDBReady) return;
    const saveTimer = setTimeout(() => {
      if (chatList.length === INITIAL_CHATS.length && chatList === INITIAL_CHATS) {
        idbClearChats().catch(() => {});
      } else {
        idbSaveChats(chatList).catch(() => {});
      }
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [chatList, isDBReady]);

  // Outside click listener for context menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);



  // Audio Haptic Synthesizer (MNC-Grade, single AudioContext to prevent exhaustion)
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const playSoundEffect = useCallback((type: 'send' | 'select' | 'pop' = 'send') => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'send' ? 660 : type === 'pop' ? 880 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }, []); // Empty dependencies ensures perfect stability for handleSelectChat

  // Filter & Smart Pin Sorting (Pinned items float to top)
  const filteredChats = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    const list = chatList.filter(c => {
      if (filterTab === 'unread') return (c.unreadCount || 0) > 0;
      if (filterTab === 'pinned') return c.isPinned;
      if (query) {
        return c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query);
      }
      return true;
    });

    // Sort pinned to top
    return [...list].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [chatList, debouncedQuery, filterTab]);




  // Super Reaction Particle Explosion Generator
  const triggerSuperParticles = useCallback((emoji: string) => {
    if (particlesTimerRef.current) clearTimeout(particlesTimerRef.current);
    const newParticles = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      emoji
    }));
    setSuperParticles(newParticles);
    particlesTimerRef.current = setTimeout(() => setSuperParticles([]), 1800);
  }, []);

  // Deep Logic: Message Emoji Reaction Toggle Handler
  const handleToggleReaction = useCallback((msgId: string, emoji: string) => {
    if (!selectedChatId) return;
    playSoundEffect('pop');
    triggerSuperParticles(emoji);

    setChatList(prev => prev.map(c => {
      if (c.id === selectedChatId) {
        const updatedMessages = c.messages.map(m => {
          if (m.id === msgId) {
            const currentReactions = m.reactions || [];
            const existingIndex = currentReactions.findIndex(r => r.emoji === emoji);

            let newReactions: MessageReaction[] = [];
            if (existingIndex >= 0) {
              const r = currentReactions[existingIndex];
              const hasMe = r.users.includes('me');
              if (hasMe && r.count === 1) {
                newReactions = currentReactions.filter(x => x.emoji !== emoji);
              } else if (hasMe) {
                newReactions = currentReactions.map(x => x.emoji === emoji ? { ...x, count: x.count - 1, users: x.users.filter(u => u !== 'me') } : x);
              } else {
                newReactions = currentReactions.map(x => x.emoji === emoji ? { ...x, count: x.count + 1, users: [...x.users, 'me'] } : x);
              }
            } else {
              newReactions = [...currentReactions, { emoji, count: 1, users: ['me'], isSuperReaction: true }];
            }
            return { ...m, reactions: newReactions };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    }));
  }, [selectedChatId, playSoundEffect, triggerSuperParticles]);

  // Deep Logic: Send Message & Trigger AI Responder
  const handleSendMessage = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessageText.trim() && !draftAttachment) || !selectedChatId) return;

    playSoundEffect('send');

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      text: newMessageText.trim() || (draftAttachment ? `Shared attachment: ${draftAttachment.name}` : ''),
      timestamp: 'Just now',
      isMe: true,
      status: 'read',
      attachment: draftAttachment || undefined
    };

    setChatList(prev => prev.map(c => {
      if (c.id === selectedChatId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          timestamp: 'Just now',
          unreadCount: 0,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setNewMessageText('');
    setDraftAttachment(null);

    // AI Auto-Responder Deep Logic (MNC-grade decoupled from UI render cycle)
    const targetChatId = selectedChatId;
    const currentContactName = chatListRef.current.find(c => c.id === targetChatId)?.name || 'Contact';

    // We don't clear previous timers so multiple chats can be auto-responding concurrently in the background
    setTimeout(() => {
      setTypingState(prev => ({ ...prev, [targetChatId]: true }));
    }, 400);

    setTimeout(() => {
      setTypingState(prev => {
        const next = { ...prev };
        delete next[targetChatId];
        return next;
      });
      playSoundEffect('pop');

      const aiReplies = [
        `Thanks for sending that over! Checking it right now. 👍`,
        `Got it! Looks great on my end. Let's sync on tomorrow's call. 🚀`,
        `Appreciate the update! I will review and get back to you shortly.`,
        `Perfect! I've logged this in the project tracker.`
      ];
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

      const autoMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: targetChatId,
        senderName: currentContactName,
        text: randomReply,
        timestamp: 'Just now',
        status: 'read'
      };

      setChatList(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return {
            ...c,
            lastMessage: autoMsg.text,
            timestamp: 'Just now',
            unreadCount: (selectedChatId === targetChatId) ? 0 : (c.unreadCount || 0) + 1,
            messages: [...c.messages, autoMsg]
          };
        }
        return c;
      }));
    }, 1800);
  }, [newMessageText, draftAttachment, selectedChatId, playSoundEffect]);

  const handleSelectChat = useCallback((id: string) => {
    playSoundEffect('select');
    setSelectedChatId(id);
    setShowContextMenu(false);
    setChatList(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  }, [playSoundEffect]);

  const handleCreateNewChat = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;

    playSoundEffect('send');

    const newChat: ChatItem = {
      id: Date.now().toString(),
      name: newChatName.trim(),
      avatar: '',
      lastMessage: 'Chat started',
      timestamp: 'Just now',
      isOnline: true,
      statusText: 'Active now',
      messages: [
        { id: Date.now().toString(), senderId: 'me', senderName: 'You', text: 'Hello! 👋', timestamp: 'Just now', isMe: true }
      ]
    };

    setChatList(prev => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setNewChatName('');
    setShowNewChatModal(false);
  }, [newChatName, playSoundEffect]);

  /* Context Menu Handlers */
  const handleViewProfile = () => {
    setShowContextMenu(false);
    setShowProfileModal(true);
  };

  const handleShareChat = () => {
    setShowContextMenu(false);
    navigator.clipboard.writeText(`https://chat.example.com/c/${selectedChat?.id}`);
    showToast('Chat link copied to clipboard 🔗');
  };

  const handleTogglePinChat = () => {
    setShowContextMenu(false);
    if (!selectedChat) return;

    const newPinState = !selectedChat.isPinned;
    setChatList(prev => prev.map(c => c.id === selectedChat.id ? { ...c, isPinned: newPinState } : c));
    showToast(newPinState ? `Pinned chat with ${selectedChat.name} 📌` : `Unpinned chat 📍`);
  };

  const handleBlockUser = () => {
    setShowContextMenu(false);
    showToast(`Blocked ${selectedChat?.name} 🚫`);
  };

  const handleDeleteChat = () => {
    setShowContextMenu(false);
    if (!selectedChatId) return;
    const chatName = chatList.find(c => c.id === selectedChatId)?.name || 'Chat';
    const deletedId = selectedChatId;
    showToast(`Deleted chat with ${chatName} 🗑️`);
    
    setChatList(prev => {
      const remaining = prev.filter(c => c.id !== selectedChatId);
      if (remaining.length > 0) {
        setSelectedChatId(remaining[0]?.id || null);
      } else {
        setSelectedChatId(null);
      }
      return remaining;
    });

    setTypingState(prev => {
      const newState = { ...prev };
      delete newState[deletedId];
      return newState;
    });

  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed top-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          {toastMessage}
        </div>
      )}

      {/* EXPANDED DESKTOP WIDESCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        
        {/* Left Side: Chats Sidebar Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 h-full">
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowNitroModal(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-xs ${
                    tier === 'nitro_pro'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white border-purple-400/50 animate-pulse'
                      : tier === 'nitro_basic'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>{tier === 'nitro_pro' ? 'Nitro Pro' : tier === 'nitro_basic' ? 'Nitro Basic' : 'Free Plan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-blue-500" /> : <VolumeX className="w-4.5 h-4.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewChatModal(true)}
                  aria-label="Start new chat"
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border-none pl-10 pr-4 py-2.5 rounded-full text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>

            {/* Filter Tabs (All / Unread / Pinned) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${filterTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                All ({chatList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('unread')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${filterTab === 'unread' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Unread
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('pinned')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${filterTab === 'pinned' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Pinned
              </button>
            </div>
          </div>

          {/* VIRTUALIZED CHAT STREAM */}
          <VirtualizedSidebarList
            isLoadingFromDB={isLoadingFromDB}
            filteredChats={filteredChats}
            selectedChatId={selectedChatId}
            handleSelectChat={handleSelectChat}
          />
        </div>

        {/* Right Side: Active Messenger Thread Card */}
        <div className={`lg:col-span-7 ${currentThemeObj.cardBg} border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500`}>
          
          {/* Super Reaction Particle Canvas Overlay */}
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
              {superParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, scale: 0.5, x: `${p.x}%`, y: `${p.y}%` }}
                  animate={{ opacity: 0, scale: 2.2, y: `${p.y - 35}%`, rotate: Math.random() * 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="absolute text-3xl select-none"
                >
                  {p.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {selectedChat ? (
            <>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <AvatarWithFallback name={selectedChat.name} src={selectedChat.avatar} size="w-11 h-11" />
                    {selectedChat.isOnline && <span className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0 z-10" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {selectedChat.name}
                      {selectedChat.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                    </h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {typingState[selectedChat.id] ? (<span className="animate-pulse font-bold text-blue-500">Typing a reply...</span>) : (selectedChat.statusText || 'Active now')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400" ref={contextMenuRef}>
                  {/* Nitro Chat Color Theme Picker Trigger */}
                  <button 
                    type="button" 
                    onClick={() => setShowThemePicker(!showThemePicker)} 
                    aria-label="Change Chat Theme" 
                    className="p-2 hover:text-purple-400 transition cursor-pointer"
                  >
                    <Palette className="w-4.5 h-4.5 text-purple-400" />
                  </button>

                  <button type="button" onClick={() => showToast(`Calling ${selectedChat.name}... 📞`)} aria-label="Call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Phone className="w-4.5 h-4.5" /></button>
                  <button type="button" onClick={() => showToast(`Starting video call with ${selectedChat.name}... 📹`)} aria-label="Video call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Video className="w-4.5 h-4.5" /></button>

                  {/* Nitro Chat Theme Popover */}
                  {showThemePicker && (
                    <div className="absolute top-12 right-12 z-50 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 space-y-2 animate-in fade-in zoom-in-95">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                        <span>Nitro Chat Themes</span>
                        <button type="button" onClick={() => setShowThemePicker(false)} className="text-slate-400"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="space-y-1">
                        {CHAT_THEMES.map(t => {
                          const isLocked = t.isNitroOnly && !isNitroPro;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                if (isLocked) {
                                  showToast('🔒 Nitro Pro required for Custom Chat Themes!');
                                  setShowNitroModal(true);
                                } else {
                                  setActiveTheme(t.id);
                                  setShowThemePicker(false);
                                  showToast(`Applied ${t.name} Chat Theme 🎨`);
                                }
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                                activeTheme === t.id ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <span>{t.name}</span>
                              {isLocked && <Crown className="w-3 h-3 text-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* THREE DOTS CONTEXT MENU */}
                  <button 
                    type="button" 
                    onClick={() => setShowContextMenu(!showContextMenu)}
                    aria-label="More options" 
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                  >
                    <MoreHorizontal className="w-4.5 h-4.5" />
                  </button>

                  {/* CONTEXT MENU POPOVER */}
                  {showContextMenu && (
                    <div className="absolute top-12 right-0 z-50 w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={handleViewProfile}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>View Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTogglePinChat}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        {selectedChat.isPinned ? <PinOff className="w-4 h-4 text-amber-500 shrink-0" /> : <Pin className="w-4 h-4 text-slate-500 shrink-0" />}
                        <span>{selectedChat.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShareChat}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Share Chat Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBlockUser}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Ban className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Block User</span>
                      </button>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={handleDeleteChat}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* MESSAGES STREAM (VIRTUALIZED) — scroll state is local to this component */}
              <VirtualizedMessageStream
                messages={selectedChat.messages}
                isTyping={typingState[selectedChat.id] || false}
                selectedChatId={selectedChatId ?? ''}
                selectedChatName={selectedChat.name}
                selectedChatAvatar={selectedChat.avatar}
                onToggleReaction={handleToggleReaction}
                chatListVersion={chatList.length}
              />

              {/* DRAFT ATTACHMENT PREVIEW BAR */}
              {draftAttachment && (
                <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-700 animate-in fade-in">
                  <div className="flex items-center gap-2 min-w-0">
                    {draftAttachment.type === 'image' ? (
                      <img src={draftAttachment.url} alt="Draft" className="w-8 h-8 rounded-md object-cover" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                    <span className="text-xs text-slate-700 dark:text-slate-200 truncate font-medium">{draftAttachment.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">({draftAttachment.size})</span>
                  </div>
                  <button type="button" onClick={() => setDraftAttachment(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

                {/* Nitro Custom Emoji Picker Popover */}
                {showNitroEmojiPicker && (
                  <div className="absolute bottom-16 right-16 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 w-64 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        Nitro Custom Emojis
                      </span>
                      <button type="button" onClick={() => setShowNitroEmojiPicker(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {NITRO_EMOJIS.map(emojiItem => {
                        const isLocked = emojiItem.isNitroOnly && !isNitroBasic;
                        return (
                          <button
                            key={emojiItem.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setToastMessage('🔒 Upgrade to Nitro to unlock Custom Animated Emojis!');
                                setShowNitroModal(true);
                              } else {
                                setNewMessageText(t => t + ` ${emojiItem.emoji}`);
                                playSoundEffect('pop');
                                setShowNitroEmojiPicker(false);
                              }
                            }}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                              isLocked 
                                ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60' 
                                : 'bg-purple-50/50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 hover:scale-105'
                            }`}
                          >
                            <span className="text-xl">{emojiItem.emoji}</span>
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 truncate w-full text-center">{emojiItem.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nitro Soundboard Picker Popover */}
                {showNitroSoundPicker && (
                  <div className="absolute bottom-16 right-24 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 w-64 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-purple-500" />
                        Nitro Soundboard Clips
                      </span>
                      <button type="button" onClick={() => setShowNitroSoundPicker(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {NITRO_SOUNDS.map(sound => {
                        const isLocked = sound.isNitroOnly && !isNitroPro;
                        return (
                          <button
                            key={sound.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setToastMessage('🔒 Nitro Pro required for Soundboard Audio Clips!');
                                setShowNitroModal(true);
                              } else {
                                playSoundEffect('pop');
                                setNewMessageText(t => t + ` ${sound.emoji} [Soundboard: ${sound.name}]`);
                                setShowNitroSoundPicker(false);
                              }
                            }}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                              isLocked 
                                ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60' 
                                : 'bg-purple-50/50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 hover:scale-105'
                            }`}
                          >
                            <span className="text-lg">{sound.emoji}</span>
                            <div className="text-left min-w-0">
                              <div className="text-[10px] font-bold text-slate-800 dark:text-white truncate">{sound.name}</div>
                              {isLocked && <span className="text-[8px] font-bold text-purple-500">Nitro Pro</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nitro 3D Sticker Picker Popover */}
                {showStickerPicker && (
                  <div className="absolute bottom-16 right-32 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 w-64 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Sticker className="w-3.5 h-3.5 text-pink-500" />
                        Nitro 3D Stickers
                      </span>
                      <button type="button" onClick={() => setShowStickerPicker(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {NITRO_STICKERS.map(sticker => {
                        const isLocked = sticker.isNitroOnly && !isNitroBasic;
                        return (
                          <button
                            key={sticker.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                showToast('🔒 Nitro required for 3D Stickers!');
                                setShowNitroModal(true);
                              } else {
                                playSoundEffect('send');
                                const newMsg: Message = {
                                  id: Date.now().toString(),
                                  senderId: 'me',
                                  senderName: 'You',
                                  text: `Sent a sticker: ${sticker.name}`,
                                  timestamp: 'Just now',
                                  isMe: true,
                                  status: 'read',
                                  sticker
                                };
                                setChatList(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMsg.text, messages: [...c.messages, newMsg] } : c));
                                setShowStickerPicker(false);
                              }
                            }}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                              isLocked ? 'opacity-50 border-slate-200 dark:border-slate-800' : 'hover:scale-105 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/40'
                            }`}
                          >
                            <img src={sticker.image} alt={sticker.name} className="w-12 h-12 rounded-lg object-cover" />
                            <span className="text-[9px] font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">{sticker.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Controls Row */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0 relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,image/gif,.pdf,.doc,.txt"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach file"
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                  >
                    <Paperclip className="w-4.5 h-4.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowNitroEmojiPicker(!showNitroEmojiPicker); setShowNitroSoundPicker(false); setShowStickerPicker(false); }}
                    aria-label="Nitro Custom Emojis"
                    className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer"
                  >
                    <SmilePlus className="w-4.5 h-4.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowStickerPicker(!showStickerPicker); setShowNitroEmojiPicker(false); setShowNitroSoundPicker(false); }}
                    aria-label="Nitro 3D Stickers"
                    className="p-2 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition cursor-pointer"
                  >
                    <Sticker className="w-4.5 h-4.5 text-pink-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowNitroSoundPicker(!showNitroSoundPicker); setShowNitroEmojiPicker(false); setShowStickerPicker(false); }}
                    aria-label="Nitro Soundboard Clips"
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                  >
                    <Music className="w-4.5 h-4.5" />
                  </button>

                  {/* Voice Note Recorder Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isRecordingVoice) {
                        setIsRecordingVoice(true);
                        showToast('🎙️ Recording voice note...');
                      } else {
                        setIsRecordingVoice(false);
                        playSoundEffect('send');
                        
                        const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
                        const finalSecs = Math.max(3, recordingSecs);
                        const durationStr = formatTime(finalSecs);
                        
                        const newMsg: Message = {
                          id: Date.now().toString(),
                          senderId: 'me',
                          senderName: 'You',
                          text: `Voice note (${durationStr})`,
                          timestamp: 'Just now',
                          isMe: true,
                          status: 'read',
                          voiceNote: { duration: durationStr, waveform: [40, 80, 60, 100, 30, 70, 90, 50] }
                        };
                        setChatList(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMsg.text, messages: [...c.messages, newMsg] } : c));
                        showToast('Voice note sent! 🎙️');
                      }
                    }}
                    aria-label="Record voice note"
                    className={`p-2 transition cursor-pointer rounded-full ${isRecordingVoice ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    {isRecordingVoice ? <Square className="w-4.5 h-4.5 fill-white" /> : <Mic className="w-4.5 h-4.5" />}
                  </button>

                  <ChatInputEditor
                    placeholder={isRecordingVoice ? `Recording voice note (${Math.floor(recordingSecs / 60)}:${(recordingSecs % 60).toString().padStart(2, '0')})...` : `Message ${selectedChat.name}...`}
                    value={newMessageText}
                    onChange={(val) => setNewMessageText(val)}
                    onSubmit={() => handleSendMessage()}
                    disabled={isRecordingVoice}
                    maxLength={tier === 'nitro_pro' ? 8000 : tier === 'nitro_basic' ? 4000 : 2000}
                  />

                  <button type="submit" aria-label="Send message" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-xs cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-xs">
                Select a conversation to start messaging
              </div>
            )}
          </div>

        </div>

        {/* Nitro Subscription Tier Upgrade Modal */}
        <Dialog.Root open={showNitroModal} onOpenChange={setShowNitroModal}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <Dialog.Title className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Discord Nitro Perks & Subscriptions
                  </Dialog.Title>
                </div>
                <Dialog.Close className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </Dialog.Close>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Free Tier */}
                <div 
                  onClick={() => { setTier('free'); onSubscriptionChange?.('free'); setShowNitroModal(false); showToast('Switched to Free Tier ($0)'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${tier === 'free' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'}`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Free</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">$0 / mo</div>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <li>• Standard Emojis</li>
                    <li>• 8MB Max Attachment</li>
                    <li>• Basic Chat List</li>
                  </ul>
                </div>

                {/* Nitro Basic */}
                <div 
                  onClick={() => { setTier('nitro_basic'); onSubscriptionChange?.('nitro_basic'); setShowNitroModal(false); showToast('Switched to Nitro Basic ($2.99/mo) 🎉'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${tier === 'nitro_basic' ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40' : 'border-slate-200 dark:border-slate-800 hover:border-purple-400'}`}
                >
                  <div className="font-bold text-sm text-purple-600 dark:text-purple-300">Nitro Basic</div>
                  <div className="text-xs text-purple-500 font-mono mt-0.5">$2.99 / mo</div>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-purple-700 dark:text-purple-300">
                    <li>• Custom Emojis Anywhere</li>
                    <li>• 50MB File Attachments</li>
                    <li>• Nitro Chat Badge</li>
                  </ul>
                </div>

                {/* Nitro Pro */}
                <div 
                  onClick={() => { setTier('nitro_pro'); onSubscriptionChange?.('nitro_pro'); setShowNitroModal(false); showToast('Switched to Nitro Pro ($9.99/mo) 👑'); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${tier === 'nitro_pro' ? 'border-amber-500 bg-gradient-to-br from-purple-950/60 to-indigo-950/60' : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'}`}
                >
                  <div className="font-bold text-sm text-amber-400 flex items-center gap-1">
                    👑 Nitro Pro
                  </div>
                  <div className="text-xs text-amber-300 font-mono mt-0.5">$9.99 / mo</div>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-amber-200">
                    <li>• 500MB Animated Uploads</li>
                    <li>• Custom Soundboard Clips</li>
                    <li>• Super Reaction Effects</li>
                  </ul>
                </div>
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      {/* User Profile Modal */}
      {showProfileModal && selectedChat && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowProfileModal(false)} className="cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="mx-auto flex justify-center">
              <AvatarWithFallback name={selectedChat.name} src={selectedChat.avatar} size="w-20 h-20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedChat.name}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">{selectedChat.statusText || 'Active now'}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer • Product Design • San Francisco, CA</p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Message</button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Start New Conversation
              </h3>
              <button type="button" onClick={() => setShowNewChatModal(false)} className="cursor-pointer"><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateNewChat} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  autoFocus
                />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
                Start Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
