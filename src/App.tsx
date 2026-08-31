import { useState } from 'react';
import { UserProfileCard } from '../registry/default/blocks/user-profile-card/user-profile-card';
import { SocialPostCard } from '../registry/default/blocks/social-post-card/social-post-card';
import { ChatListCard } from '../registry/default/blocks/chat-list-card/chat-list-card';
import { PricingTable } from '../registry/default/blocks/pricing-table/pricing-table';
import { 
  Code2, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Eye, 
  Server, 
  Sun, 
  Moon, 
  Zap, 
  Check, 
  Search, 
  Copy, 
  Terminal, 
  ExternalLink, 
  Grid,
  Crown,
  MessageSquare
} from 'lucide-react';

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
    title: 'User Profile Card (Discord Nitro Edition)',
    description: 'MNC-grade user & creator profile card with Discord Nitro features, 3D animated banners, avatar decorations, status indicators, and Rich Presence Spotify scrubber.',
    category: 'User & Profile',
    badge: 'Nitro Exclusive',
    dependencies: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion', 'lucide-react'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/user-profile-card.json"'
  },
  {
    id: 'chat-list-card',
    name: 'chat-list-card',
    title: 'Discord Nitro Chat List Card',
    description: 'MNC-grade chat inbox & thread card with custom Nitro emojis, Super Reaction particle shockwaves, soundboard clips, and real-time status delivery lifecycle.',
    category: 'Messaging & Chat',
    badge: 'Nitro Featured',
    dependencies: ['@radix-ui/react-popover', '@radix-ui/react-dialog', 'framer-motion', 'lucide-react'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/chat-list-card.json"'
  },
  {
    id: 'social-post-card',
    name: 'social-post-card',
    title: 'Social Post Feed Card',
    description: 'MNC-grade feed card with multi-reactions, right-side comments panel, audio voice note player, and fullscreen lightbox.',
    category: 'Social & Feed',
    badge: 'Pro Featured',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/social-post-card.json"'
  },
  {
    id: 'pricing-table',
    name: 'pricing-table',
    title: 'Monetization Pricing Table',
    description: 'MNC-grade pricing table with monthly/yearly billing toggle, feature matrix, popular tier badges, and commercial monetization flow.',
    category: 'Monetization & Sales',
    badge: 'Commercial',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/pricing-table.json"'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'catalog' | 'code' | 'registry' | 'monetization'>('preview');
  const [activeComponent, setActiveComponent] = useState<'user-profile-card' | 'chat-list-card' | 'social-post-card' | 'pricing-table'>('user-profile-card');
  const [darkMode, setDarkMode] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');

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
    setTimeout(() => setCopiedCmd(prev => ({ ...prev, [id]: false })), 2000);
  };

  const componentUsageCode = `import { UserProfileCard } from '@/components/blocks/user-profile-card/user-profile-card';
import { ChatListCard } from '@/components/blocks/chat-list-card/chat-list-card';

export default function ApplicationDashboard() {
  return (
    <div className="space-y-6">
      <UserProfileCard />
      <ChatListCard />
    </div>
  );
}`;

  const registryJson = `{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "user-profile-card",
  "type": "registry:block",
  "title": "User Profile Card (Discord Nitro Edition)",
  "description": "An MNC-grade creator & user profile card with Discord Nitro features, Radix UI primitives, 3D animated cover banners, avatar decorations, and responsive metrics dashboard.",
  "dependencies": ["@radix-ui/react-tabs", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip", "framer-motion", "lucide-react"],
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-purple-500 selection:text-white transition-colors duration-300`}>
      
      {/* TOP NAVIGATION BAR WITH GLASSMORPHISM & HSL ACCENT */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight flex items-center gap-2 text-slate-900 dark:text-white">
                MNC Component Platform
                <span className="text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  v3.0 NITRO READY
                </span>
              </h1>
              <p className="text-slate-400 text-xs font-mono">Nitish2620 / shadcn-mcp-app</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              title="Toggle Dark/Light theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Segmented Navigation Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
              
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Catalog ({CATALOG_COMPONENTS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code</span>
              </button>

              <button
                onClick={() => setActiveTab('registry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'registry'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>MCP Registry</span>
              </button>

              <button
                onClick={() => setActiveTab('monetization')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'monetization'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                    : 'text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Nitro Tiers</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        
        {/* LIVE PREVIEW TAB CONTAINER */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            {/* Live Component Switcher Header Bar */}
            <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>
                  Official <code className="font-mono bg-purple-200/80 dark:bg-purple-900/80 px-2 py-0.5 rounded-lg text-purple-900 dark:text-purple-200">shadcn/ui</code> Radix Primitives &amp; Discord Nitro Block Catalog. Select component:
                </span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setActiveComponent('user-profile-card')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    activeComponent === 'user-profile-card' 
                      ? 'bg-purple-600 text-white shadow-purple-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  User Profile Card
                </button>
                <button
                  onClick={() => setActiveComponent('chat-list-card')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    activeComponent === 'chat-list-card' 
                      ? 'bg-purple-600 text-white shadow-purple-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
                  Chats List Card
                </button>
                <button
                  onClick={() => setActiveComponent('social-post-card')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    activeComponent === 'social-post-card' 
                      ? 'bg-purple-600 text-white shadow-purple-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Social Post Card
                </button>
                <button
                  onClick={() => setActiveComponent('pricing-table')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    activeComponent === 'pricing-table' 
                      ? 'bg-purple-600 text-white shadow-purple-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Pricing Table
                </button>
              </div>
            </div>

            {/* Live Component Render Stage */}
            <div className="py-2">
              {activeComponent === 'user-profile-card' ? (
                <UserProfileCard />
              ) : activeComponent === 'chat-list-card' ? (
                <ChatListCard />
              ) : activeComponent === 'social-post-card' ? (
                <SocialPostCard />
              ) : (
                <PricingTable />
              )}
            </div>

          </div>
        )}

        {/* CATALOG COMPONENT MANAGER TAB */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-purple-500" />
                  MNC Component Catalog &amp; Installation Manager
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage, preview, and copy 1-command installation CLI scripts for your blocks</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCatalog.map(comp => (
                <div key={comp.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-purple-500/50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                          {comp.category}
                        </span>
                        {comp.badge && (
                          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {comp.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{comp.title}</h3>
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
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
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
                      className="text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Live Demo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CODE TAB CONTAINER */}
        {activeTab === 'code' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Usage in Next.js / React</h2>
                <p className="text-xs text-slate-500 mt-0.5">Import and use <code className="font-mono text-purple-600">UserProfileCard</code> or <code className="font-mono text-purple-600">ChatListCard</code> anywhere in your app</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                registry/default/blocks/
              </span>
            </div>
            
            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-purple-300 overflow-x-auto border border-slate-800">
              {componentUsageCode}
            </pre>
          </div>
        )}

        {/* REGISTRY DEFINITION TAB */}
        {activeTab === 'registry' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                shadcn MCP Server Registry Definition
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                This component block is registered and ready for distribution via AI clients using <code className="font-mono text-purple-600">components.json</code>!
              </p>
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
              {registryJson}
            </pre>
          </div>
        )}

        {/* NITRO MONETIZATION GUIDE TAB */}
        {activeTab === 'monetization' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5 fill-amber-300" /> Commercial Monetization Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How to Charge Subscriptions for Your Custom Blocks</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Monetize access to custom React &amp; Tailwind UI blocks using <strong>Private Authenticated Registries</strong> with Stripe or LemonSqueezy.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
