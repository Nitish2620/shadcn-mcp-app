import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Activity, 
  ArrowUpRight,
  Calendar
} from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  description: string;
}

export function MetricCard({ title, value, change, isPositive, icon: Icon, description }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200/50 dark:border-blue-900/50">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>

      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

export function AnalyticsDashboard() {
  const metrics: MetricCardProps[] = [
    { title: 'Total Revenue', value: '$128,430', change: '+14.2%', isPositive: true, icon: DollarSign, description: 'Compared to last month ($112,400)' },
    { title: 'Active Subscribers', value: '8,920', change: '+8.4%', isPositive: true, icon: Users, description: '742 new signups this week' },
    { title: 'Store Conversions', value: '3.42%', change: '-0.8%', isPositive: false, icon: ShoppingBag, description: 'Target goal: 4.0%' },
    { title: 'API Stress Health', value: '99.98%', change: '+0.02%', isPositive: true, icon: Activity, description: 'Uptime over last 30 days' },
  ];

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Executive Metrics Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry and commercial performance dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last 30 Days
          </button>
          <button type="button" className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1 shadow-md shadow-blue-500/20 cursor-pointer">
            Export Report <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>
    </div>
  );
}
