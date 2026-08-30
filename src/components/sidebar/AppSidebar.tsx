import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  FolderKanban, 
  Settings, 
  HelpCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  isActive?: boolean;
}

export interface AppSidebarProps {
  initialCollapsed?: boolean;
  onNavigate?: (id: string) => void;
}

export function AppSidebar({ initialCollapsed = false, onNavigate }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const mainNavigation: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isActive: activeItem === 'dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'Live', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { id: 'team', label: 'Team Members', icon: Users, badge: 12, badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 'Pro', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  ];

  const secondaryNavigation: SidebarItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleSelect = (id: string) => {
    setActiveItem(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <aside 
      className={`h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between p-4 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  Acme Enterprise
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">v2.4.0 • MNC Grade</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 transition cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/60 pl-8 pr-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/40 transition border border-transparent dark:border-slate-800"
            />
          </div>
        )}

        {/* Main Nav Links */}
        <nav className="space-y-1 pt-2">
          {!isCollapsed && <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">Main Menu</p>}
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isSelected = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${isSelected ? 'bg-white/20 text-white border-white/30' : item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section & User Profile */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <nav className="space-y-1">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            const isSelected = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Upgrade Card (when expanded) */}
        {!isCollapsed && (
          <div className="p-3 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white rounded-2xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Pro Plan</span>
              <span className="text-[10px] text-indigo-300">Active</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">Unlimited component registry deployment enabled.</p>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-blue-500/20"
            />
            {!isCollapsed && (
              <div className="truncate">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">Nitish Yadav</p>
                <p className="text-[10px] text-slate-400 truncate">nitish@acme.com</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              aria-label="Log out"
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
