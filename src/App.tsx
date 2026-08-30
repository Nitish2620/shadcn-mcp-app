import { useState } from 'react';
import { SocialPostCard } from './components/SocialPostCard';
import { Code2, Sparkles, Layers, CheckCircle2, Eye, Server, Sun, Moon, ShieldCheck, Key, Lock, Zap, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'registry' | 'monetization'>('preview');
  const [darkMode, setDarkMode] = useState(false);
  const [userToken] = useState('pro_sub_sk_9482710394857210');
  const [copiedToken, setCopiedToken] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(userToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const componentUsageCode = `import { SocialPostCard } from '@/components/SocialPostCard';

export default function FeedPage() {
  return (
    <SocialPostCard
      author={{
        name: "Ray Hammond",
        avatar: "/avatars/ray.jpg",
        location: "New-York",
        verified: true
      }}
      timestamp="Thursday, Jun 31, 5:50 PM"
      content="I'm so glad to share with you guys some photos from my recent trip to New-York..."
      hashtags={["#NewYorkCity", "#TravelDiaries", "#Wanderlust", "#Architecture"]}
      images={[
        "/ny_skyscrapers.jpg",
        "/ny_skyline.jpg"
      ]}
      initialLikes={245}
      initialCommentsCount={8}
      initialSharesCount={12}
    />
  );
}`;

  const registryJson = `{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "social-post-card",
  "type": "registry:component",
  "title": "Social Post Card Component",
  "description": "Premium social media post card with reaction bar (Love, Fire, Haha, etc.), media lightbox, audio voice notes player, context menu, and nested comment tree.",
  "dependencies": ["lucide-react", "clsx", "tailwind-merge"],
  "files": [
    {
      "path": "src/components/SocialPostCard.tsx",
      "type": "registry:component"
    },
    {
      "path": "src/components/types.ts",
      "type": "registry:lib"
    }
  ]
}`;

  const privateRegistryConfig = `{
  "registries": {
    "@pro": {
      "url": "https://api.yourdomain.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer \${REGISTRY_TOKEN}"
      }
    }
  }
}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
                Custom Social Post Component 
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">v2.0 Enhanced</span>
              </h1>
              <p className="text-slate-400 text-xs font-mono">shadcn-mcp-app / src/components/SocialPostCard.tsx</p>
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
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
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
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
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
                Subscriptions &amp; Sales
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-blue-900 dark:text-blue-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Component rendered live from <code className="font-mono bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">SocialPostCard.tsx</code>. Supports both Free and Paid Subscription distribution models!
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 text-blue-600 font-semibold border border-blue-200 dark:border-blue-800">
                  Ready for Review
                </span>
              </div>
            </div>

            {/* Live Component Render */}
            <div className="py-2">
              <SocialPostCard />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Usage in React</h2>
                <p className="text-xs text-slate-500 mt-0.5">Import and use <code className="font-mono text-blue-600">SocialPostCard</code> anywhere in your app</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                src/components/SocialPostCard.tsx
              </span>
            </div>
            
            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-blue-300 overflow-x-auto border border-slate-800">
              {componentUsageCode}
            </pre>
          </div>
        )}

        {activeTab === 'registry' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                shadcn MCP Server Registry Definition
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                This component is ready to be distributed to AI clients via the configured MCP server using <code className="font-mono text-blue-600">components.json</code>!
              </p>
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
              {registryJson}
            </pre>
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-8">
            {/* Subscription Architecture Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck className="w-72 h-72 text-indigo-400" />
              </div>
              <div className="max-w-2xl space-y-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5" /> Commercial Monetization Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How to Charge Subscriptions for Your Components</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You can sell access to your custom components using <strong>Private Authenticated Registries</strong> with Stripe or LemonSqueezy, or adopt a <strong>Freemium model</strong>.
                </p>
              </div>
            </div>

            {/* Pricing Tiers Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Tier Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 space-y-6 shadow-sm">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Free / Open Tier
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></h3>
                  <p className="text-slate-500 text-xs mt-1">Provide free components to build audience, traffic &amp; developer trust.</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  {[
                    'Public JSON Registry endpoint',
                    'Direct 1-command install via npx shadcn',
                    'Increases social media & GitHub exposure',
                    'Convert free users to paid Pro subscribers'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                  npx shadcn@latest add "https://yourdomain.com/r/free-component.json"
                </div>
              </div>

              {/* Pro Subscription Tier Card */}
              <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-3xl p-7 space-y-6 shadow-xl relative">
                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Pro Subscription Tier
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">$19 <span className="text-xs text-slate-400 font-normal">/ month (or $199 lifetime)</span></h3>
                  <p className="text-slate-500 text-xs mt-1">Charge recurring subscriptions for full access to Pro components.</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  {[
                    'Private Authenticated Registry (Bearer token protected)',
                    'Automatic API key generation on Stripe/LemonSqueezy checkout',
                    'Shadcn CLI & AI Assistant (Claude, Cursor) authentication',
                    'Full source code access for active subscribers'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Simulated Token Generator */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <Key className="w-3.5 h-3.5" /> Subscriber API Secret Key:
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-400 flex items-center justify-between">
                    <span className="truncate">{userToken}</span>
                    <button
                      onClick={copyToken}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition shrink-0 ml-2 cursor-pointer"
                    >
                      {copiedToken ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* How Paid Subscriber Configuration Works */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-500" />
                  How Subscribers Authenticate in <code className="text-indigo-600 font-mono">components.json</code>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  When a paid customer subscribes, they set their <code className="font-mono text-amber-500">REGISTRY_TOKEN</code> in <code className="font-mono text-slate-600">.env.local</code> and configure their private registry in <code className="font-mono text-slate-600">components.json</code>:
                </p>
              </div>

              <pre className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-amber-400 overflow-x-auto border border-slate-800">
                {privateRegistryConfig}
              </pre>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Backend Flow:</strong> When the subscriber runs <code className="font-mono font-bold">npx shadcn@latest add @pro/social-post-card</code>, your backend verifies the <code className="font-mono">Authorization: Bearer</code> header. If their subscription is active in Stripe, your server returns the component source code!
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
