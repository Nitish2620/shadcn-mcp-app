import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Hash, 
  Volume2, 
  Plus, 
  Users, 
  Sparkles, 
  ShoppingBag, 
  Search, 
  X, 
  Lock, 
  ShieldCheck,
  MicOff,
  Video
} from 'lucide-react';
import type { 
  ServerItem, 
  ChannelCategory, 
  DirectMessageItem 
} from './types';
import type { UserStatus } from '../user-profile-card/types';

interface ChannelSidebarProps {
  activeServer: ServerItem | null;
  categories: ChannelCategory[];
  directMessages: DirectMessageItem[];
  activeChannelId: string | null;
  activeDMId: string | null;
  onSelectChannel: (channelId: string) => void;
  onSelectDM: (dmId: string) => void;
  onQuickSearchClick?: () => void;
}

export const ChannelSidebar = React.memo(({
  activeServer,
  categories,
  directMessages,
  activeChannelId,
  activeDMId,
  onSelectChannel,
  onSelectDM,
  onQuickSearchClick
}: ChannelSidebarProps) => {
  // Collapse state for channel categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const statusColors: Record<UserStatus, string> = {
    online: 'bg-green-500',
    idle: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-slate-500'
  };

  // ------------------------------------------------------------------
  // MODE 1: Direct Messages / Home Sidebar
  // ------------------------------------------------------------------
  if (!activeServer) {
    return (
      <div className="w-[240px] bg-slate-900 flex flex-col h-full border-r border-slate-950/80 shrink-0 select-none">
        
        {/* Search Header */}
        <div className="h-12 px-3 flex items-center border-b border-slate-950/60 shrink-0 shadow-xs">
          <button
            onClick={onQuickSearchClick}
            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              Find or start a conversation
            </span>
            <kbd className="font-mono text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded">Ctrl+K</kbd>
          </button>
        </div>

        {/* Quick Direct Message Navigation Items */}
        <div className="p-2 space-y-0.5 border-b border-slate-950/60">
          <button 
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400 group-hover:text-white" />
              Friends
            </span>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">12</span>
          </button>

          <button 
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            Nitro Perks
          </button>

          <button 
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer group"
          >
            <ShoppingBag className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
            Shop Collectibles
          </button>
        </div>

        {/* Direct Messages Header & List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
          <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Direct Messages</span>
            <button className="text-slate-400 hover:text-white transition-colors cursor-pointer" title="Create DM">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {directMessages.map((dm) => {
            const isActive = activeDMId === dm.id;
            return (
              <button
                key={dm.id}
                onClick={() => onSelectDM(dm.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-xs' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {/* DM Avatar with Status */}
                <div className="relative shrink-0">
                  <img src={dm.avatar} alt={dm.name} className="w-8 h-8 rounded-full object-cover bg-slate-950" />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${statusColors[dm.status]}`} />
                </div>

                <div className="flex-1 min-w-0 leading-tight">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {dm.name}
                    </span>
                    {dm.unreadCount && dm.unreadCount > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                        {dm.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {dm.customStatus || dm.activityText || `@${dm.handle}`}
                  </span>
                </div>

                {/* Close DM icon on hover */}
                <span className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-opacity cursor-pointer">
                  <X className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // MODE 2: Server Channel Tree Sidebar
  // ------------------------------------------------------------------
  return (
    <div className="w-[240px] bg-slate-900 flex flex-col h-full border-r border-slate-950/80 shrink-0 select-none">
      
      {/* Server Header Dropdown Bar */}
      <button className="h-12 px-4 flex items-center justify-between border-b border-slate-950/80 hover:bg-slate-800/50 transition-colors shrink-0 shadow-xs cursor-pointer group">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-sm text-white truncate">{activeServer.name}</span>
          {activeServer.boostLevel && activeServer.boostLevel > 0 && (
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              Lvl {activeServer.boostLevel}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
      </button>

      {/* Categories & Channel Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        {categories.map((category) => {
          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <div className="flex items-center justify-between px-1 mb-1 group">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{category.name}</span>
                </button>
                <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity cursor-pointer" title="Create Channel">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Channels List */}
              {!isCollapsed && category.channels.map((channel) => {
                const isActive = activeChannelId === channel.id;
                const isVoice = channel.type === 'voice';

                return (
                  <div key={channel.id} className="space-y-1">
                    <button
                      onClick={() => onSelectChannel(channel.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-slate-800 text-white shadow-xs'
                          : channel.unread
                            ? 'text-white font-bold'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isVoice ? (
                          <Volume2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        ) : channel.isLocked ? (
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        )}
                        <span className="truncate">{channel.name}</span>
                      </div>

                      {/* Mention Badges */}
                      {channel.mentionCount && channel.mentionCount > 0 ? (
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                          {channel.mentionCount}
                        </span>
                      ) : null}
                    </button>

                    {/* Active Voice Participants (If Voice Channel) */}
                    {isVoice && channel.activeVoiceMembers && channel.activeVoiceMembers.length > 0 && (
                      <div className="pl-6 space-y-1 py-1">
                        {channel.activeVoiceMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-5 h-5 rounded-full overflow-hidden border ${
                                member.isSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/50 animate-pulse' : 'border-slate-800'
                              }`}>
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[11px] text-slate-300 truncate">{member.name}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {member.isStreaming && (
                                <span className="bg-red-600 text-white text-[8px] font-bold px-1 rounded flex items-center gap-0.5">
                                  <Video className="w-2.5 h-2.5" /> LIVE
                                </span>
                              )}
                              {member.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

ChannelSidebar.displayName = 'ChannelSidebar';
export default ChannelSidebar;
