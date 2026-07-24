import React from 'react';
import { Utensils, MessageSquare, Compass, Calendar, Cpu, MapPin, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus, onOpenSettings }) => {
  const tabs = [
    { id: 'chat', label: 'WhatsApp Agent', icon: MessageSquare, badge: 'Live Chat' },
    { id: 'catalog', label: 'Food & Instamart', icon: Compass },
    { id: 'meal-planner', label: 'AI Meal Planner', icon: Calendar, highlight: true },
    { id: 'mcp-inspector', label: 'Swiggy MCP Tools', icon: Cpu },
    { id: 'order-tracker', label: 'Live Order Tracker', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-swiggy-orange to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white glow-orange-text">Zippy</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-swiggy-orange/20 text-swiggy-orange border border-swiggy-orange/30 rounded-full">
                  Swiggy MCP AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                WhatsApp Message-to-Action Assistant
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-swiggy-orange text-white shadow-md shadow-swiggy-orange/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Badges & Settings button */}
          <div className="flex items-center space-x-3">
            
            {/* System Online Status */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">FastAPI & MCP Online</span>
            </div>

            {/* Config Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-700 transition"
              title="Configure API Keys & Webhooks"
            >
              <Settings className="w-4 h-4 text-swiggy-orange" />
              <span className="text-xs font-semibold hidden sm:inline">Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-[#0B0F17] py-2 px-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-medium ${
                isActive ? 'text-swiggy-orange font-bold' : 'text-slate-400'
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
