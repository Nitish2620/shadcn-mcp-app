import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Pin, 
  PinOff,
  CheckCheck, 
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
  FileText
} from 'lucide-react';
import type { ChatItem, ChatListCardProps, Message, MessageAttachment, MessageReaction } from './types';

export type { ChatItem, ChatListCardProps, Message, MessageAttachment, MessageReaction };

const ITEM_HEIGHT = 68; // Height of each chat row in px
const MSG_HEIGHT = 80;  // Height of each message bubble in px

const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

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
   INSTANT MNC AVATAR SYSTEM (0ms Slow 3G Latency)
======================================================== */
const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600'
];

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

const AvatarWithFallback = React.memo(({ name, src, size = "w-11 h-11" }: { name: string; src?: string; size?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const gradient = useMemo(() => getGradient(name), [name]);

  if (!src || imgError) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 shadow-2xs`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setImgError(true)}
      className={`${size} rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0`}
    />
  );
});
AvatarWithFallback.displayName = 'AvatarWithFallback';

/* ========================================================
   MEMOIZED CHAT ROW ITEM
======================================================== */
const ChatRowItem = React.memo(({ 
  chat, 
  isSelected, 
  onSelect 
}: { 
  chat: ChatItem; 
  isSelected: boolean; 
  onSelect: (id: string) => void; 
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(chat.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(chat.id)}
      aria-label={`Chat with ${chat.name}`}
      data-state={isSelected ? "selected" : "idle"}
      style={{ height: `${ITEM_HEIGHT}px` }}
      className={`py-2 px-3 flex items-center gap-3 rounded-2xl cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected ? 'bg-blue-50/90 dark:bg-blue-950/50 ring-1 ring-blue-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      {/* Avatar with Online Status */}
      <div className="relative shrink-0">
        <AvatarWithFallback name={chat.name} src={chat.avatar} size="w-12 h-12" />
        {chat.isOnline && (
          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0 z-10" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate flex items-center gap-1.5">
            {chat.name}
            {chat.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
          </span>
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">
            {chat.timestamp}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-tight">
            {chat.lastMessage}
          </p>
          {chat.unreadCount && chat.unreadCount > 0 ? (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
              {chat.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});
ChatRowItem.displayName = 'ChatRowItem';

/* ========================================================
   MEMOIZED INTERACTIVE MESSAGE BUBBLE WITH REACTIONS
======================================================== */
const MessageBubble = React.memo(({ 
  msg, 
  onToggleReaction 
}: { 
  msg: Message; 
  onToggleReaction: (msgId: string, emoji: string) => void; 
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-200 group relative`}>
      {/* Bubble Container */}
      <div className="relative group">
        <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs shadow-2xs relative ${
          msg.isMe 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
        }`}>
          {/* Attachment Preview if exists */}
          {msg.attachment && (
            <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
              {msg.attachment.type === 'image' ? (
                <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-48 w-full object-cover rounded-lg" />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded-lg text-xs font-semibold">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{msg.attachment.name}</span>
                  {msg.attachment.size && <span className="text-[10px] opacity-75 shrink-0">({msg.attachment.size})</span>}
                </div>
              )}
            </div>
          )}

          <p className="leading-relaxed break-words">{msg.text}</p>

          {/* Message Action Trigger (Emoji reaction button) */}
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            aria-label="Add reaction"
            className={`absolute top-1 ${msg.isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer`}
          >
            <SmilePlus className="w-3.5 h-3.5" />
          </button>

          {/* Emoji Picker Popover */}
          {showPicker && (
            <div className={`absolute -top-10 ${msg.isMe ? 'right-0' : 'left-0'} z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full px-2 py-1 flex items-center gap-1 animate-in fade-in zoom-in-95`}>
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onToggleReaction(msg.id, emoji);
                    setShowPicker(false);
                  }}
                  className="hover:scale-125 transition text-sm cursor-pointer p-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reaction Badges */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className={`flex flex-wrap items-center gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            {msg.reactions.map(r => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => onToggleReaction(msg.id, r.emoji)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
                  r.users.includes('me')
                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
        <span>{msg.timestamp}</span>
        {msg.isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
      </div>
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

/* ========================================================
   IndexedDB PERSISTENCE LAYER
======================================================== */
const IDB_NAME = 'ChatStressTestDB';
const IDB_STORE = 'chats';
const IDB_VERSION = 1;

function openStressDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbSaveChats(chats: ChatItem[]): Promise<void> {
  return openStressDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(chats, 'data');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  });
}

function idbLoadChats(): Promise<ChatItem[] | null> {
  return openStressDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get('data');
      req.onsuccess = () => {
        db.close();
        const val = req.result;
        if (Array.isArray(val) && val.length > 0) resolve(val);
        else resolve(null);
      };
      req.onerror = () => { db.close(); reject(req.error); };
    });
  });
}

function idbClearChats(): Promise<void> {
  return openStressDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete('data');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  });
}

/* ========================================================
   MAIN CHAT LIST CARD COMPONENT (EXPANDED MNC PRO GRADE)
======================================================== */
export function ChatListCard({
  title = "Messages",
  chats = INITIAL_CHATS
}: ChatListCardProps) {
  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');

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
  const [isTyping, setIsTyping] = useState(false);

  // File Upload Draft State
  const [draftAttachment, setDraftAttachment] = useState<MessageAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Virtual Windowing States
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [msgScrollTop, setMsgScrollTop] = useState(0);
  const msgScrollContainerRef = useRef<HTMLDivElement>(null);

  // Context Menu & Profile Modal State
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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
            setTimeout(() => {
              if (!cancelled) {
                setChatList(stored);
                setIsDBReady(true);
              }
            }, 30);
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

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, chatList, isTyping]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Audio Haptic Synthesizer
  const playSoundEffect = useCallback((type: 'send' | 'select' | 'pop' = 'send') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    } catch {}
  }, [soundEnabled]);

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

  // Virtual Windowing - Left List
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const virtualSlice = useMemo(() => {
    const totalCount = filteredChats.length;
    if (totalCount <= 20) {
      return { items: filteredChats, paddingTop: 0, paddingBottom: 0 };
    }
    const containerHeight = 520;
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 3);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / ITEM_HEIGHT) + 6);
    return {
      items: filteredChats.slice(startIndex, endIndex),
      paddingTop: startIndex * ITEM_HEIGHT,
      paddingBottom: (totalCount - endIndex) * ITEM_HEIGHT
    };
  }, [filteredChats, scrollTop]);

  // Virtual Windowing - Right Message Stream
  const handleMsgScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setMsgScrollTop(e.currentTarget.scrollTop);
  };

  const msgVirtualSlice = useMemo(() => {
    const msgs = selectedChat?.messages || [];
    const totalCount = msgs.length;
    if (totalCount <= 30) {
      return { items: msgs, paddingTop: 0, paddingBottom: 0 };
    }
    const containerHeight = 440;
    const startIndex = Math.max(0, Math.floor(msgScrollTop / MSG_HEIGHT) - 5);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / MSG_HEIGHT) + 10);
    return {
      items: msgs.slice(startIndex, endIndex),
      paddingTop: startIndex * MSG_HEIGHT,
      paddingBottom: (totalCount - endIndex) * MSG_HEIGHT
    };
  }, [selectedChat?.messages, msgScrollTop]);

  // Deep Logic: Message Emoji Reaction Toggle Handler
  const handleToggleReaction = useCallback((msgId: string, emoji: string) => {
    if (!selectedChat) return;
    playSoundEffect('pop');

    setChatList(prev => prev.map(c => {
      if (c.id === selectedChat.id) {
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
              newReactions = [...currentReactions, { emoji, count: 1, users: ['me'] }];
            }
            return { ...m, reactions: newReactions };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    }));
  }, [selectedChat, playSoundEffect]);

  // File Upload Selection Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);
    const sizeStr = `${(file.size / 1024 / 1024).toFixed(1)} MB`;

    setDraftAttachment({
      name: file.name,
      url,
      type: isImg ? 'image' : 'file',
      size: sizeStr
    });
  };

  // Deep Logic: Send Message & Trigger AI Responder
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessageText.trim() && !draftAttachment) || !selectedChat) return;

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
      if (c.id === selectedChat.id) {
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

    // AI Auto-Responder Deep Logic
    const currentChatId = selectedChat.id;
    const currentContactName = selectedChat.name;

    setTimeout(() => {
      setIsTyping(true);
    }, 400);

    setTimeout(() => {
      setIsTyping(false);
      playSoundEffect('pop');

      const aiReplies = [
        `Thanks for sending that over, Ray! Checking it right now. 👍`,
        `Got it! Looks great on my end. Let's sync on tomorrow's call. 🚀`,
        `Appreciate the update! I will review and get back to you shortly.`,
        `Perfect! I've logged this in the project tracker.`
      ];
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

      const autoMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: currentChatId,
        senderName: currentContactName,
        text: randomReply,
        timestamp: 'Just now'
      };

      setChatList(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return {
            ...c,
            lastMessage: autoMsg.text,
            timestamp: 'Just now',
            messages: [...c.messages, autoMsg]
          };
        }
        return c;
      }));
    }, 1800);
  }, [newMessageText, draftAttachment, selectedChat, playSoundEffect]);

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
    if (!selectedChat) return;
    setChatList(prev => prev.filter(c => c.id !== selectedChat.id));
    showToast(`Deleted chat with ${selectedChat.name} 🗑️`);
    if (chatList.length > 1) {
      const remaining = chatList.filter(c => c.id !== selectedChat.id);
      setSelectedChatId(remaining[0]?.id || null);
    }
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
              <div className="flex items-center gap-1">
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
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="list" 
            aria-label="Chats stream" 
            className="flex-1 overflow-y-auto max-h-[520px] pr-0.5"
          >
            {isLoadingFromDB ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Loading conversations...
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No chats found
              </div>
            ) : (
              <div style={{ paddingTop: `${virtualSlice.paddingTop}px`, paddingBottom: `${virtualSlice.paddingBottom}px` }} className="space-y-1">
                {virtualSlice.items.map((chat) => (
                  <ChatRowItem
                    key={chat.id}
                    chat={chat}
                    isSelected={chat.id === selectedChatId}
                    onSelect={handleSelectChat}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Messenger Thread Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full relative">
          {selectedChat ? (
            <>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 relative shrink-0">
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
                      {isTyping ? <span className="animate-pulse font-bold text-blue-500">Typing a reply...</span> : (selectedChat.statusText || 'Active now')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400" ref={contextMenuRef}>
                  <button type="button" onClick={() => showToast(`Calling ${selectedChat.name}... 📞`)} aria-label="Call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Phone className="w-4.5 h-4.5" /></button>
                  <button type="button" onClick={() => showToast(`Starting video call with ${selectedChat.name}... 📹`)} aria-label="Video call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Video className="w-4.5 h-4.5" /></button>

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

              {/* MESSAGES STREAM (VIRTUALIZED) */}
              <div
                ref={msgScrollContainerRef}
                onScroll={handleMsgScroll}
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto py-4 max-h-[460px] pr-1"
              >
                <div style={{ paddingTop: `${msgVirtualSlice.paddingTop}px`, paddingBottom: `${msgVirtualSlice.paddingBottom}px` }} className="space-y-4">
                  {msgVirtualSlice.items.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} onToggleReaction={handleToggleReaction} />
                  ))}
                </div>
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2 animate-pulse">
                    <AvatarWithFallback name={selectedChat.name} src={selectedChat.avatar} size="w-6 h-6" />
                    <span>{selectedChat.name} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

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

              {/* Input Form with Attachment Picker */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.txt"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach file"
                  className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${selectedChat.name}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
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
