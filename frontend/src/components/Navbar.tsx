import React from 'react';
import { Utensils, MessageSquare, Compass, Calendar, Cpu, MapPin, Settings } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus, onOpenSettings }) => {
  const tabs = [
    { id: 'chat', label: 'WhatsApp Sandbox', icon: MessageSquare, badge: 'Live' },
    { id: 'catalog', label: 'Swiggy & Instamart', icon: Compass },
    { id: 'meal-planner', label: 'AI Meal Planner', icon: Calendar },
    { id: 'mcp-inspector', label: 'MCP Telemetry', icon: Cpu },
    { id: 'order-tracker', label: 'Order Tracking', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.08] bg-[#04060A]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-swiggy-orange to-amber-500 flex items-center justify-center shadow-md shadow-swiggy-orange/20">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">Zippy</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-swiggy-orange/10 text-swiggy-orange border border-swiggy-orange/20 rounded-md">
                  Swiggy MCP Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                WhatsApp Automated Ordering Platform
              </p>
            </div>
          </div>

          {/* Minimal Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-white/[0.08]">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-swiggy-orange text-white shadow-sm shadow-swiggy-orange/20 font-display'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/15 text-emerald-400 rounded-md border border-emerald-500/30">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status & Settings */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">FastAPI & MCP Online</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition text-xs font-semibold"
            >
              <Settings className="w-3.5 h-3.5 text-swiggy-orange" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/[0.08] bg-[#04060A] py-2 px-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center px-2 py-1 rounded text-[10px] font-medium ${
                isActive ? 'text-swiggy-orange font-bold font-display' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              {t.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
};
