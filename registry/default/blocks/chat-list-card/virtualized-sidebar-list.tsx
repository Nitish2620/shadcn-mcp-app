import React, { useRef } from 'react';
import type { ChatItem } from './types';
import { AvatarWithFallback } from './avatar-with-fallback';
import { Pin } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

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
      style={{ height: `84px` }}
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
            {chat.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                {chat.badge}
              </span>
            )}
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

export const VirtualizedSidebarList = React.memo(({
  isLoadingFromDB,
  filteredChats,
  selectedChatId,
  handleSelectChat,
}: {
  isLoadingFromDB: boolean;
  filteredChats: ChatItem[];
  selectedChatId: string | null;
  handleSelectChat: (id: string) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredChats.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 88, // 84px height + 4px gap
    overscan: 10,
  });

  return (
    <div 
      ref={scrollContainerRef}
      role="list" 
      aria-label="Chats stream" 
      className="flex-1 overflow-y-auto pr-0.5" // removed fixed max-h
      style={{ overflowAnchor: 'none' }}
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
        <div 
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const chat = filteredChats[virtualItem.index];
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
                  paddingBottom: '4px' // space-y-1 equivalent
                }}
              >
                <ChatRowItem
                  chat={chat}
                  isSelected={chat.id === selectedChatId}
                  onSelect={handleSelectChat}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
VirtualizedSidebarList.displayName = 'VirtualizedSidebarList';
