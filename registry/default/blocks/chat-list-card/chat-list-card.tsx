import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Pin, 
  CheckCheck, 
  X, 
  Smile, 
  Paperclip, 
  Sparkles
} from 'lucide-react';
import type { ChatItem, ChatListCardProps, Message } from './types';

export type { ChatItem, ChatListCardProps, Message };

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

export function ChatListCard({
  title = "Chats",
  chats = INITIAL_CHATS
}: ChatListCardProps) {
  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'pinned'>('all');
  const [newMessageText, setNewMessageText] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const selectedChat = useMemo(() => 
    chatList.find(c => c.id === selectedChatId) || chatList[0],
  [chatList, selectedChatId]);

  const filteredChats = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return chatList.filter(c => {
      if (filterTab === 'unread') return (c.unreadCount || 0) > 0;
      if (filterTab === 'pinned') return c.isPinned;
      if (query) {
        return c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query);
      }
      return true;
    });
  }, [chatList, searchQuery, filterTab]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedChat) return;

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
  }, [newMessageText, selectedChat]);

  const handleSelectChat = useCallback((id: string) => {
    setSelectedChatId(id);
    // Mark as read
    setChatList(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  }, []);

  const handleCreateNewChat = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;

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
  }, [newChatName]);

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Chats List Card (Matches Screenshot Design) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={() => setShowNewChatModal(true)}
              aria-label="Start new chat"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
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
              All
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

          {/* Chat List Items */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[420px] pr-0.5">
            {filteredChats.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No chats found
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`py-3 px-2 flex items-center gap-3 rounded-2xl cursor-pointer transition ${
                      isSelected ? 'bg-blue-50/80 dark:bg-blue-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar with Online Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
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
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Messenger Thread (MNC Grade Polish) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[500px]">
          {selectedChat ? (
            <>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
                    {selectedChat.isOnline && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedChat.name}</h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{selectedChat.statusText || 'Active now'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button type="button" className="p-2 hover:text-slate-600 dark:hover:text-slate-200"><Phone className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:text-slate-600 dark:hover:text-slate-200"><Video className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:text-slate-600 dark:hover:text-slate-200"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[350px] pr-1">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      msg.isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Paperclip className="w-4 h-4" /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Smile className="w-4 h-4" /></button>
                <input
                  type="text"
                  placeholder={`Message ${selectedChat.name}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-xs">
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

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Start New Conversation
              </h3>
              <button type="button" onClick={() => setShowNewChatModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
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
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs">
                Start Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
