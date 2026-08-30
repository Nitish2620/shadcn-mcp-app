import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Pin, 
  CheckCheck, 
  X, 
  Smile, 
  Paperclip, 
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Share2,
  Ban,
  Trash2,
  Zap
} from 'lucide-react';
import type { ChatItem, ChatListCardProps, Message } from './types';

export type { ChatItem, ChatListCardProps, Message };

const ITEM_HEIGHT = 64; // Height of each chat row in px
const MSG_HEIGHT = 72; // Estimated height of each message bubble in px

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
      { id: 'm2', senderId: 'me', senderName: 'You', text: 'Yes, looking at them now. They look great!', timestamp: '1:18 PM', isMe: true, status: 'read' },
      { id: 'm3', senderId: '1', senderName: 'Priya Sharma', text: "I've sent the files over.", timestamp: '1:20 PM' }
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
   MEMOIZED ROW SUB-COMPONENT (HIGH TRAFFIC OPTIMIZED)
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
      className={`py-2 px-2 flex items-center gap-3 rounded-2xl cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected ? 'bg-blue-50/80 dark:bg-blue-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      {/* Avatar with Online Badge */}
      <div className="relative shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          loading="lazy"
          decoding="async"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
        />
        {chat.isOnline && (
          <span className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate flex items-center gap-1">
            {chat.name}
            {chat.isPinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
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
   MEMOIZED MESSAGE BUBBLE SUB-COMPONENT
======================================================== */
const MessageBubble = React.memo(({ msg }: { msg: Message }) => {
  return (
    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}>
      <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
        msg.isMe 
          ? 'bg-blue-600 text-white rounded-tr-none shadow-xs' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
      }`}>
        <p className="leading-relaxed break-words">{msg.text}</p>
      </div>
      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
        <span>{msg.timestamp}</span>
        {msg.isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
      </div>
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

/* ========================================================
   MAIN CHAT LIST CARD COMPONENT (WITH VIRTUALIZED WINDOWING)
======================================================== */
/* ========================================================
   IndexedDB PERSISTENCE LAYER (Supports 100k+ Records)
   localStorage caps at ~5MB. IndexedDB handles 100s of MB.
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

export function ChatListCard({
  title = "Chats",
  chats = INITIAL_CHATS
}: ChatListCardProps) {
  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'pinned'>('all');
  const [newMessageText, setNewMessageText] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [is10kLoaded, setIs10kLoaded] = useState(false);
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);

  // Load persisted stress-test data from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    idbLoadChats()
      .then(stored => {
        if (cancelled) return;
        if (stored) {
          setChatList(stored);
          setSelectedChatId(stored[0]?.id || '1');
          setIs10kLoaded(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoadingFromDB(false); });
    return () => { cancelled = true; };
  }, []);

  // Virtual Windowing State for 10,000+ Items (Zero Browser Freeze)
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Virtual Windowing State for Messages Stream (Right Panel)
  const [msgScrollTop, setMsgScrollTop] = useState(0);
  const msgScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMsgStressLoaded, setIsMsgStressLoaded] = useState(false);

  // Context Menu State
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click with proper event listener unmounting (Zero Memory Leak)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for high traffic stream filtering
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-scroll to bottom of messages stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, chatList]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Audio Haptic Feedback Synthesizer
  const playSoundEffect = useCallback((type: 'send' | 'select' = 'send') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'send' ? 660 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }, [soundEnabled]);

  // 10,000 ROW STRESS TEST GENERATOR — persists to IndexedDB
  const handleInject10kData = useCallback(() => {
    if (is10kLoaded) {
      idbClearChats().catch(() => {});
      setChatList(INITIAL_CHATS);
      setSelectedChatId('1');
      setIs10kLoaded(false);
      showToast('Reset to 5 initial chats (cache cleared) 🔄');
      return;
    }

    const firstNames = ['Alex', 'Priya', 'James', 'Elena', 'Yuki', 'Marcus', 'Sophia', 'David', 'Emma', 'Lucas'];
    const lastNames = ['Smith', 'Sharma', 'Okonkwo', 'Vasquez', 'Tanaka', 'Vance', 'Johnson', 'Miller', 'Davis', 'Wilson'];
    const mock10k: ChatItem[] = [];

    for (let i = 1; i <= 10000; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      mock10k.push({
        id: `10k_${i}`,
        name: `${fn} ${ln} #${i}`,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        lastMessage: `Stress test message #${i}: Virtual windowing at 60 FPS!`,
        timestamp: `${i % 59}m ago`,
        unreadCount: i % 7 === 0 ? (i % 5) + 1 : undefined,
        isOnline: i % 2 === 0,
        messages: [
          { id: `m_${i}`, senderId: `10k_${i}`, senderName: `${fn} ${ln}`, text: `Stress test message #${i}: Virtual windowing at 60 FPS!`, timestamp: 'Just now' }
        ]
      });
    }

    setChatList(mock10k);
    setSelectedChatId(mock10k[0].id);
    setIs10kLoaded(true);
    // Persist to IndexedDB in background (non-blocking)
    idbSaveChats(mock10k).catch(() => {});
    showToast('Injected 10,000 records — persisted to IndexedDB! Refresh to verify 🚀');
  }, [is10kLoaded, showToast]);

  const selectedChat = useMemo(() => 
    chatList.find(c => c.id === selectedChatId) || chatList[0],
  [chatList, selectedChatId]);

  // 100,000 MESSAGES INJECTION INTO SELECTED CHAT (RIGHT PANEL STRESS TEST)
  const handleInject100kMessages = useCallback(() => {
    if (!selectedChat) return;

    if (isMsgStressLoaded) {
      // Reset to original messages
      setChatList(prev => prev.map(c => {
        if (c.id === selectedChat.id) {
          return { ...c, messages: c.messages.slice(0, 3), lastMessage: c.messages[0]?.text || '' };
        }
        return c;
      }));
      setIsMsgStressLoaded(false);
      setMsgScrollTop(0);
      showToast('Reset messages to original 🔄');
      return;
    }

    const sampleTexts = [
      'Hey, how are you doing today?',
      'Just finished the code review — looks great!',
      'Can you check the latest deployment?',
      'The meeting has been moved to 3 PM.',
      'I pushed the hotfix, please verify.',
      'Great work on the new feature! 🚀',
      'Let me know when you are free to sync.',
      'The client approved the final design.',
      'Running the stress test now — 60 FPS!',
      'Happy to help anytime. 👍',
      'Did you see the latest analytics report?',
      'Infrastructure migration is 100% complete.',
      'PR merged successfully — zero conflicts.',
      'The API response time improved by 40%.',
      'New release candidate is ready for QA.',
      'Thanks for the quick turnaround!',
      'Bug confirmed — working on a fix now.',
      'Staging environment is up and running.',
      'Can we schedule a 1:1 tomorrow?',
      'Everything looks solid on production. ✅'
    ];

    const stressMessages: Message[] = [];
    for (let i = 0; i < 100000; i++) {
      const isMe = i % 3 === 0;
      const hours = Math.floor(i / 60);
      const mins = i % 60;
      stressMessages.push({
        id: `stress_msg_${i}`,
        senderId: isMe ? 'me' : selectedChat.id,
        senderName: isMe ? 'You' : selectedChat.name,
        text: sampleTexts[i % sampleTexts.length],
        timestamp: `${hours}:${mins.toString().padStart(2, '0')}`,
        isMe,
        status: isMe ? 'read' : undefined
      });
    }

    setChatList(prev => prev.map(c => {
      if (c.id === selectedChat.id) {
        return { ...c, messages: stressMessages, lastMessage: stressMessages[stressMessages.length - 1].text };
      }
      return c;
    }));
    setIsMsgStressLoaded(true);
    showToast('Injected 100,000 messages — virtual windowing active! 🚀');

    // Scroll to bottom after injection
    setTimeout(() => {
      if (msgScrollContainerRef.current) {
        msgScrollContainerRef.current.scrollTop = msgScrollContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [selectedChat, isMsgStressLoaded, showToast]);

  const filteredChats = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    return chatList.filter(c => {
      if (filterTab === 'unread') return (c.unreadCount || 0) > 0;
      if (filterTab === 'pinned') return c.isPinned;
      if (query) {
        return c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query);
      }
      return true;
    });
  }, [chatList, debouncedQuery, filterTab]);

  /* ========================================================
     VIRTUALIZED WINDOWING — CHAT LIST (LEFT PANEL)
  ======================================================== */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const virtualSlice = useMemo(() => {
    const totalCount = filteredChats.length;
    if (totalCount <= 20) {
      return {
        items: filteredChats,
        paddingTop: 0,
        paddingBottom: 0
      };
    }

    const containerHeight = 420;
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 3);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / ITEM_HEIGHT) + 6);

    const items = filteredChats.slice(startIndex, endIndex);
    const paddingTop = startIndex * ITEM_HEIGHT;
    const paddingBottom = (totalCount - endIndex) * ITEM_HEIGHT;

    return { items, paddingTop, paddingBottom };
  }, [filteredChats, scrollTop]);

  /* ========================================================
     VIRTUALIZED WINDOWING — MESSAGES STREAM (RIGHT PANEL)
  ======================================================== */
  const handleMsgScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setMsgScrollTop(e.currentTarget.scrollTop);
  };

  const msgVirtualSlice = useMemo(() => {
    const msgs = selectedChat?.messages || [];
    const totalCount = msgs.length;
    if (totalCount <= 30) {
      return {
        items: msgs,
        paddingTop: 0,
        paddingBottom: 0
      };
    }

    const containerHeight = 350;
    const startIndex = Math.max(0, Math.floor(msgScrollTop / MSG_HEIGHT) - 5);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / MSG_HEIGHT) + 10);

    const items = msgs.slice(startIndex, endIndex);
    const paddingTop = startIndex * MSG_HEIGHT;
    const paddingBottom = (totalCount - endIndex) * MSG_HEIGHT;

    return { items, paddingTop, paddingBottom };
  }, [selectedChat?.messages, msgScrollTop]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedChat) return;

    playSoundEffect('send');

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      text: newMessageText.trim(),
      timestamp: 'Just now',
      isMe: true,
      status: 'read'
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
  }, [newMessageText, selectedChat, playSoundEffect]);

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
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
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
    <div className="w-full max-w-5xl mx-auto font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed top-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Chats List Card (Matches Screenshot Design) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <div className="flex items-center gap-1">
              {/* 10,000 Data Injection Stress Test Button */}
              <button
                type="button"
                onClick={handleInject10kData}
                aria-label="Inject 10,000 records stress test"
                title="Inject 10,000 records to test virtual windowing"
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                  is10kLoaded 
                    ? 'bg-amber-500 text-white animate-pulse' 
                    : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                <Zap className="w-3 h-3" /> {is10kLoaded ? '10k (Virtual)' : '10k Stress'}
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
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
              placeholder="Search chats..."
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
              className={`flex-1 py-1 rounded-lg transition cursor-pointer ${filterTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              All ({chatList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('unread')}
              className={`flex-1 py-1 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${filterTab === 'unread' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pinned')}
              className={`flex-1 py-1 rounded-lg transition cursor-pointer ${filterTab === 'pinned' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Pinned
            </button>
          </div>

          {/* VIRTUALIZED WINDOWED CHAT STREAM (ZERO BROWSER FREEZE) */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="list" 
            aria-label="Chats stream" 
            className="overflow-y-auto max-h-[420px] pr-0.5"
          >
            {isLoadingFromDB ? (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                Loading chats from cache...
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No chats found
              </div>
            ) : (
              <div style={{ paddingTop: `${virtualSlice.paddingTop}px`, paddingBottom: `${virtualSlice.paddingBottom}px` }} className="divide-y divide-slate-100 dark:divide-slate-800">
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

        {/* Right Side: Active Messenger Thread */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[500px] relative">
          {selectedChat ? (
            <>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={selectedChat.avatar} alt={selectedChat.name} loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover" />
                    {selectedChat.isOnline && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedChat.name}</h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{selectedChat.statusText || 'Active now'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400" ref={contextMenuRef}>
                  {/* 100k MESSAGES STRESS TEST BUTTON */}
                  <button
                    type="button"
                    onClick={handleInject100kMessages}
                    aria-label="Inject 100k messages stress test"
                    title="Inject 100,000 messages to stress test the message stream"
                    className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      isMsgStressLoaded
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> {isMsgStressLoaded ? `100k Msgs` : '100k Msgs'}
                  </button>
                  <button type="button" aria-label="Call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Phone className="w-4 h-4" /></button>
                  <button type="button" aria-label="Video call contact" className="p-2 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><Video className="w-4 h-4" /></button>

                  {/* THREE DOTS BUTTON */}
                  <button 
                    type="button" 
                    onClick={() => setShowContextMenu(!showContextMenu)}
                    aria-label="More options" 
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* CONTEXT MENU POPOVER */}
                  {showContextMenu && (
                    <div className="absolute top-12 right-0 z-50 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
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
                        onClick={handleShareChat}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Share</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBlockUser}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Ban className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Block</span>
                      </button>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={handleDeleteChat}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Stream (VIRTUALIZED) */}
              <div
                ref={msgScrollContainerRef}
                onScroll={handleMsgScroll}
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto py-4 max-h-[350px] pr-1"
              >
                {isMsgStressLoaded && (
                  <div className="text-center text-[10px] text-violet-500 font-bold mb-2 animate-pulse">
                    ⚡ {selectedChat.messages.length.toLocaleString()} messages loaded — Virtual Windowing Active (60 FPS)
                  </div>
                )}
                <div style={{ paddingTop: `${msgVirtualSlice.paddingTop}px`, paddingBottom: `${msgVirtualSlice.paddingBottom}px` }} className="space-y-3">
                  {msgVirtualSlice.items.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button type="button" aria-label="Attach file" className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"><Paperclip className="w-4 h-4" /></button>
                <button type="button" aria-label="Add emoji" className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"><Smile className="w-4 h-4" /></button>
                <input
                  type="text"
                  placeholder={`Message ${selectedChat.name}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button type="submit" aria-label="Send message" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-xs cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
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
            <img src={selectedChat.avatar} alt={selectedChat.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-blue-500/20" />
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
