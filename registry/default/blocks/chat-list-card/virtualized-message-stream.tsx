import React, { useState, useRef, useEffect } from 'react';
import type { Message } from './types';
import { AvatarWithFallback } from './avatar-with-fallback';
import { motion } from 'framer-motion';
import { SmilePlus, CheckCheck, FileText, Play, Volume2 } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '👎'];

const MessageBubble = React.memo(({
  msg,
  onToggleReaction
}: {
  msg: Message;
  onToggleReaction: (msgId: string, emoji: string) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  return (
    <div ref={bubbleRef} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-200 group relative`}>
      <div className="relative group">
        <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs shadow-2xs relative ${
          msg.isMe
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
        }`}>
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

          {msg.soundClip && (
            <div className="mb-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-3 text-xs font-bold text-purple-200">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-bounce">{msg.soundClip.emoji}</span>
                <div>
                  <div className="text-white font-bold">{msg.soundClip.name}</div>
                  <span className="text-[9px] text-purple-400 font-mono">Nitro Soundboard Clip</span>
                </div>
              </div>
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
            </div>
          )}

          {msg.sticker && (
            <div className="mb-2 p-2 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col items-center">
              <img src={msg.sticker.image} alt={msg.sticker.name} className="w-24 h-24 object-cover rounded-xl shadow-lg animate-pulse" />
              <span className="text-[10px] font-extrabold text-purple-400 mt-1">{msg.sticker.name} (Nitro Sticker)</span>
            </div>
          )}

          {msg.voiceNote && (
            <div className="mb-2 p-3 rounded-2xl bg-slate-900/90 text-white border border-slate-700/60 flex items-center gap-3 w-56">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white shrink-0 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex items-end gap-1 h-5 px-1">
                  {msg.voiceNote.waveform.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${h}%`, `${Math.max(20, h * 0.5)}%`, `${h}%`] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                      className="w-1 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-purple-300">
                  <span>Voice Note</span>
                  <span>{msg.voiceNote.duration}</span>
                </div>
              </div>
            </div>
          )}

          <p className="leading-relaxed break-all flex items-center gap-1">
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            {msg.nitroCustomEmoji && <span className="text-lg animate-pulse">{msg.nitroCustomEmoji}</span>}
          </p>

          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            aria-label="Add reaction"
            className={`absolute top-1 ${msg.isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer`}
          >
            <SmilePlus className="w-3.5 h-3.5" />
          </button>

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

interface VirtualizedMessageStreamProps {
  messages: Message[];
  isTyping: boolean;
  selectedChatId: string;
  selectedChatName: string;
  selectedChatAvatar: string;
  onToggleReaction: (msgId: string, emoji: string) => void;
  chatListVersion?: number;
}

export const VirtualizedMessageStream = React.memo(({
  messages,
  isTyping,
  selectedChatId,
  selectedChatName,
  selectedChatAvatar,
  onToggleReaction,
  chatListVersion
}: VirtualizedMessageStreamProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setAutoScroll(isBottom);
  };

  // Auto-scroll to bottom on new messages or chat switch
  useEffect(() => {
    if (messages.length > 0 && autoScroll) {
      virtualizer.scrollToIndex(messages.length - 1, { 
        align: 'end',
        behavior: 'auto' 
      });
    }
  }, [chatListVersion, virtualizer, messages.length]);

  // Always scroll to bottom when switching chats
  useEffect(() => {
    if (messages.length > 0) {
      setAutoScroll(true);
      virtualizer.scrollToIndex(messages.length - 1, { 
        align: 'end',
        behavior: 'auto' 
      });
    }
  }, [selectedChatId]);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      className="flex-1 overflow-y-auto py-4 pr-1"
      style={{ overflowAnchor: 'none' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const msg = messages[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                paddingBottom: '16px' // space-y-4 equivalent
              }}
            >
              <MessageBubble msg={msg} onToggleReaction={onToggleReaction} />
            </div>
          );
        })}
      </div>
      
      {isTyping && (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-2 animate-pulse mt-2">
          <AvatarWithFallback name={selectedChatName} src={selectedChatAvatar} size="w-6 h-6" />
          <span>{selectedChatName} is typing...</span>
        </div>
      )}
    </div>
  );
});
VirtualizedMessageStream.displayName = 'VirtualizedMessageStream';
