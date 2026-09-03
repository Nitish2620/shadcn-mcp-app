import { Suspense, lazy, useState, useEffect, useRef, Component } from 'react';
import type { ReactNode } from 'react';
import type { UserProfileData, SubscriptionTier } from '../registry/default/blocks/user-profile-card/types';
import { useProfileSync } from './hooks/useProfileSync';
const UserProfileModal = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-modal').then(m => ({ default: m.UserProfileModal })));
const UserProfileFeatureManager = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-settings').then(m => ({ default: m.UserProfileFeatureManager })));
const UserProfilePopout = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-popout').then(m => ({ default: m.UserProfilePopout })));
const ServerProfileCard = lazy(() => import('../registry/default/blocks/user-profile-card/server-profile-card').then(m => ({ default: m.ServerProfileCard })));
const VoiceCallMemberCard = lazy(() => import('../registry/default/blocks/user-profile-card/voice-call-member-card').then(m => ({ default: m.VoiceCallMemberCard })));
const NitroSubscriptionPricing = lazy(() => import('../registry/default/blocks/nitro-subscription-pricing/nitro-subscription-pricing'));
const SocialPostCard = lazy(() => import('../registry/default/blocks/social-post-card/social-post-card').then(m => ({ default: m.SocialPostCard })));
const ChatListCard = lazy(() => import('../registry/default/blocks/chat-list-card/chat-list-card').then(m => ({ default: m.ChatListCard })));
const PricingTable = lazy(() => import('../registry/default/blocks/pricing-table/pricing-table').then(m => ({ default: m.PricingTable })));
const DiscordSidebarNav = lazy(() => import('../registry/default/blocks/discord-sidebar-nav/discord-sidebar-nav').then(m => ({ default: m.DiscordSidebarNav })));
const SpatialCarousel = lazy(() => import('../registry/default/blocks/spatial-carousel/spatial-carousel').then(m => ({ default: m.SpatialCarousel })));
import { Code2, Sparkles, Layers, CheckCircle2, Eye, Server, Sun, Moon, Zap, Check, Search, Copy, Terminal, ExternalLink, Grid } from 'lucide-react';

// Error Boundary to prevent white-screen-of-death on runtime crashes
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <div className="text-red-400 font-bold text-sm mb-2">⚠️ Component crashed</div>
          <div className="text-slate-500 text-xs mb-4">{this.state.error?.message || 'Unknown error'}</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ComponentItem {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  badge?: string;
  dependencies: string[];
  installCommand: string;
}

const CATALOG_COMPONENTS: ComponentItem[] = [
  {
    id: 'user-profile-card',
    name: 'user-profile-card',
    title: 'User Profile Card (Nitro Edition)',
    description: 'MNC-grade user & creator profile card with Discord Nitro features, Radix UI primitives, animated avatar decorations, and responsive metrics dashboard.',
    category: 'User & Profile',
    badge: 'Nitro Exclusive',
    dependencies: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/user-profile-card.json"'
  },
  {
    id: 'feature-management-card',
    name: 'feature-management-card',
    title: 'Feature Management Card (Standalone Settings)',
    description: 'MNC-grade standalone user settings control panel & feature manager card with live HSL color dropper, croppers, and settings categories.',
    category: 'Settings & Control',
    badge: 'MNC Grade',
    dependencies: ['@radix-ui/react-dialog', 'framer-motion', 'lucide-react'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/user-profile-card.json"'
  },
  {
    id: 'chat-list-card',
    name: 'chat-list-card',
    title: 'Chat List Card',
    description: 'MNC-grade chat inbox card with online indicators, search filter, unread count badges, new chat modal, and live messenger stream panel.',
    category: 'Messaging & Chat',
    badge: 'New Featured',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/chat-list-card.json"'
  },
  {
    id: 'social-post-card',
    name: 'social-post-card',
    title: 'Social Post Card',
    description: 'MNC-grade feed card with multi-reactions, right-side comments panel, audio voice note player, and fullscreen lightbox.',
    category: 'Social & Feed',
    badge: 'Pro Featured',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/social-post-card.json"'
  },
  {
    id: 'pricing-table',
    name: 'pricing-table',
    title: 'Pricing Table',
    description: 'MNC-grade pricing table with monthly/yearly billing toggle, feature matrix, popular tier badges, and commercial monetization flow.',
    category: 'Monetization & Sales',
    badge: 'New',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/pricing-table.json"'
  },
  {
    id: 'discord-sidebar-nav',
    name: 'discord-sidebar-nav',
    title: 'Discord Side Navigation Bar',
    description: 'MNC-grade double-column Discord navigation bar with Server Rail, pill indicators, collapsible channel categories, active voice participants, and user quick controller.',
    category: 'Navigation & Sidebar',
    badge: 'MNC Grade',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/discord-sidebar-nav.json"'
  },
  {
    id: 'spatial-carousel',
    name: 'spatial-carousel',
    title: 'Apple-Style 3D Spatial Carousel',
    description: 'Cinematic 3D CoverFlow carousel with mouse-tracking parallax tilt, spring physics, glassmorphic glare, drag/swipe, keyboard nav, auto-play, fullscreen expand, and floating particles.',
    category: 'Animation & Motion',
    badge: 'Premium',
    dependencies: ['framer-motion', 'lucide-react'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/spatial-carousel.json"'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'catalog' | 'code' | 'registry' | 'monetization'>('preview');
  const [activeComponent, setActiveComponent] = useState<'user-profile-card' | 'feature-management-card' | 'profile-preview-card' | 'server-profile-card' | 'voice-call-member-card' | 'nitro-subscription-pricing' | 'chat-list-card' | 'social-post-card' | 'pricing-table' | 'discord-sidebar-nav' | 'spatial-carousel'>('user-profile-card');
  const [darkMode, setDarkMode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<Record<string, boolean>>({});
  const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    return () => {
      activeTimeouts.current.forEach(clearTimeout);
      activeTimeouts.current.clear();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Shared full profile data sync — reacts to changes from ANY component
  const [appProfileData, setAppProfileData] = useProfileSync({
    name: 'Ram Verma',
    handle: '@ram',
    userStatus: 'online' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Full-stack AI systems architect & Discord Nitro Booster ✨ Building MNC-grade web apps with Next.js, Tailwind CSS & Radix UI primitives.',
    pronouns: 'he/him',
    joinedDiscordDate: 'Feb 14, 2021',
    joinedServerDate: 'Nov 02, 2022',
    themeColor: 'from-purple-600 to-indigo-600',
    profileTheme: 'blurple' as const,
    avatarDecoration: 'sakura' as const,
    bannerEffect: 'sakura_moonlight' as const,
    profileEffect: 'sakura_breeze' as const,
    nitroLevel: 'level3' as const,
    subscriptionTier: 'nitro_pro' as const,
    badges: [],
    stats: { followers: 1280, likes: 4320, mediaCount: 42, postsCount: 18, boostCount: 14, nextLevelBoosts: 20 },
    serverRoles: [
      { id: 'r1', name: 'Admin', colorGradient: '#818cf8', animated: false },
      { id: 'r2', name: 'Nitro Booster', colorGradient: '#e879f9', animated: true },
      { id: 'r3', name: 'Core Contributor', colorGradient: '#34d399', animated: false }
    ],
    spotifyPresence: {
      song: 'Starboy (feat. Daft Punk)',
      artist: 'The Weeknd, Daft Punk',
      albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      durationSeconds: 230,
      currentSeconds: 102,
      isPlaying: true
    },
    gamePresence: {
      name: 'Cyberpunk 2077',
      details: 'Exploring Night City',
      state: 'In Competitive Lobby (3/4)',
      icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80',
      elapsedTime: '01:45 elapsed'
    },
    connectedAccounts: [
      { id: '1', platform: 'github', name: 'Nitish2620', url: 'https://github.com/Nitish2620' },
      { id: '2', platform: 'twitter', name: '@Nitish_Dev', url: 'https://twitter.com/' },
      { id: '3', platform: 'spotify', name: 'Nitish Mix', url: 'https://spotify.com/' }
    ]
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(prev => ({ ...prev, [id]: true }));
    const t = setTimeout(() => {
      setCopiedCmd(prev => ({ ...prev, [id]: false }));
      activeTimeouts.current.delete(t);
    }, 2000);
    activeTimeouts.current.add(t);
  };

  const componentUsageCode = `import { UserProfileCard } from '@/components/blocks/user-profile-card/user-profile-card';

export default function ProfilePage() {
  return (
    <UserProfileCard />
  );
}`;

  const registryJson = `{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "user-profile-card",
  "type": "registry:block",
  "title": "User Profile Card (Nitro Edition)",
  "description": "An MNC-grade creator & user profile card with Discord Nitro features, Radix UI primitives, animated avatar decorations, and responsive metrics dashboard.",
  "dependencies": ["@radix-ui/react-tabs", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip", "framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  "files": [
    {
      "path": "registry/default/blocks/user-profile-card/user-profile-card.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/default/blocks/user-profile-card/types.ts",
      "type": "registry:lib"
    }
  ]
}`;

  const filteredCatalog = CATALOG_COMPONENTS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans selection:bg-purple-500 selection:text-white transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
                Custom Component Manager
                <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">v2.1 Nitro Added</span>
              </h1>
              <p className="text-slate-400 text-xs font-mono">Nitish2620 / shadcn-mcp-app</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Toggle Dark/Light theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Catalog ({CATALOG_COMPONENTS.length})
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code
              </button>

              <button
                onClick={() => setActiveTab('registry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'registry'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                MCP Registry
              </button>

              <button
                onClick={() => setActiveTab('monetization')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'monetization'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-xs'
                    : 'text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Subscriptions
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Official <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded">shadcn/ui</code> Radix Primitives &amp; Nitro Features. Switch component preview below:
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setActiveComponent('profile-preview-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'profile-preview-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  1. Popout Card
                </button>
                <button
                  onClick={() => setActiveComponent('user-profile-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'user-profile-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  2. Full Modal
                </button>
                <button
                  onClick={() => setActiveComponent('feature-management-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'feature-management-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  3. Settings Dashboard
                </button>
                <button
                  onClick={() => setActiveComponent('server-profile-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'server-profile-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  4. Server Profile Card
                </button>
                <button
                  onClick={() => setActiveComponent('voice-call-member-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'voice-call-member-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  5. Voice Call Overlay
                </button>
                <button
                  onClick={() => setActiveComponent('nitro-subscription-pricing')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'nitro-subscription-pricing' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Nitro Subscription Pricing

                </button>
                <button
                  onClick={() => setActiveComponent('chat-list-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'chat-list-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Chats List Card
                </button>
                <button
                  onClick={() => setActiveComponent('social-post-card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'social-post-card' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Social Post Card
                </button>
                <button
                  onClick={() => setActiveComponent('pricing-table')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'pricing-table' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Pricing Table
                </button>
                <button
                  onClick={() => setActiveComponent('discord-sidebar-nav')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'discord-sidebar-nav' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Discord Side Navigation Bar
                </button>
                <button
                  onClick={() => setActiveComponent('spatial-carousel')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeComponent === 'spatial-carousel' 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  🎠 3D Spatial Carousel
                </button>
              </div>
            </div>

            {/* Live Component Render */}
            <div className="py-2 flex justify-center">
              <Suspense fallback={<div className="p-12 text-sm font-semibold text-purple-400 animate-pulse flex items-center gap-2"><Sparkles className="w-4 h-4" /> Loading MNC-grade component...</div>}>
              <ErrorBoundary>
                {activeComponent === 'user-profile-card' ? (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-colors font-semibold">
                      Open Full Profile Modal
                    </button>
                    <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={appProfileData} subscriptionTier={appProfileData.subscriptionTier} />
                  </div>
                ) : activeComponent === 'feature-management-card' ? (
                  <UserProfileFeatureManager 
                    profile={appProfileData}
                    subscriptionTier={appProfileData.subscriptionTier}
                    onSaveProfile={(updated: UserProfileData) => {
                      console.log('Saved profile:', updated);
                      setAppProfileData(updated);
                    }}
                    onSelectSubscription={(tier: SubscriptionTier) => setAppProfileData({...appProfileData, subscriptionTier: tier})}
                    isModal={false}
                  />
                ) : activeComponent === 'nitro-subscription-pricing' ? (
                  <NitroSubscriptionPricing 
                    subscriptionTier={appProfileData.subscriptionTier} 
                    onSelectSubscription={(tier) => setAppProfileData({...appProfileData, subscriptionTier: tier as SubscriptionTier})} 
                  />
                ) : activeComponent === 'profile-preview-card' ? (
                  <div className="w-full max-w-md p-6 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center gap-4">
                    <div className="text-xs text-purple-400 font-bold tracking-wider uppercase">Standalone Real-Time Profile Popout Component</div>
                    <UserProfilePopout profile={appProfileData} subscriptionTier={appProfileData.subscriptionTier} />
                  </div>
                ) : activeComponent === 'server-profile-card' ? (
                  <div className="w-full max-w-md p-6 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center gap-4">
                    <div className="text-xs text-purple-400 font-bold tracking-wider uppercase">Standalone Server-Specific Profile Card Component</div>
                    <ServerProfileCard profile={appProfileData} subscriptionTier={appProfileData.subscriptionTier} />
                  </div>
                ) : activeComponent === 'voice-call-member-card' ? (
                  <div className="w-full max-w-md p-6 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center gap-4">
                    <div className="text-xs text-purple-400 font-bold tracking-wider uppercase">Standalone Voice Call Member Overlay Card Component</div>
                    <VoiceCallMemberCard profile={appProfileData} isSpeaking={true} isStreaming={true} onViewProfile={() => setIsModalOpen(true)} />
                  </div>
                ) : activeComponent === 'chat-list-card' ? (
                  <ChatListCard 
                    subscriptionTier={appProfileData.subscriptionTier} 
                    profile={appProfileData} 
                    onSelectSubscription={(tier) => setAppProfileData({...appProfileData, subscriptionTier: tier as SubscriptionTier})} 
                  />
                ) : activeComponent === 'social-post-card' ? (
                  <SocialPostCard profile={appProfileData} />
                ) : activeComponent === 'discord-sidebar-nav' ? (
                  <DiscordSidebarNav profile={appProfileData} onOpenSettings={() => setIsModalOpen(true)} />
                ) : activeComponent === 'spatial-carousel' ? (
                  <SpatialCarousel />
                ) : (
                  <PricingTable />
                )}
              </ErrorBoundary>
              </Suspense>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Component Catalog &amp; Manager</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage, preview, and copy installation commands for all your custom components</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCatalog.map(comp => (
                <div key={comp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-purple-500/50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                          {comp.category}
                        </span>
                        {comp.badge && (
                          <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                            {comp.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{comp.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{comp.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]"><Terminal className="w-3.5 h-3.5 text-purple-500" /> 1-Command CLI Install:</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-purple-300 flex items-center justify-between gap-2 overflow-hidden">
                      <span className="truncate">{comp.installCommand}</span>
                      <button
                        onClick={() => copyToClipboard(comp.installCommand, comp.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {copiedCmd[comp.id] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCmd[comp.id] ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1 text-slate-400 flex-wrap">
                      <span>Dependencies:</span>
                      {comp.dependencies.slice(0, 3).map((dep, idx) => (
                        <span key={idx} className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setActiveComponent(comp.id as any);
                        setActiveTab('preview');
                      }}
                      className="text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Live Demo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Usage in Next.js / React</h2>
                <p className="text-xs text-slate-500 mt-0.5">Import and use <code className="font-mono text-purple-600">UserProfileCard</code> anywhere in your app</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                registry/default/blocks/user-profile-card/user-profile-card.tsx
              </span>
            </div>
            
            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-purple-300 overflow-x-auto border border-slate-800">
              {componentUsageCode}
            </pre>
          </div>
        )}

        {activeTab === 'registry' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                shadcn MCP Server Registry Definition
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                This component is ready to be distributed to AI clients via the configured MCP server using <code className="font-mono text-purple-600">components.json</code>!
              </p>
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
              {registryJson}
            </pre>
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5" /> Commercial Monetization Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How to Charge Subscriptions for Your Components</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Sell access to your custom components using <strong>Private Authenticated Registries</strong> with Stripe or LemonSqueezy.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
