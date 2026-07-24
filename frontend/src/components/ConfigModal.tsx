import React, { useState, useEffect } from 'react';
import { X, Key, Globe, Shield, Save, Check } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus | null;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, systemStatus }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [evolutionUrl, setEvolutionUrl] = useState('http://localhost:8080');
  const [evolutionInstance, setEvolutionInstance] = useState('zippy_whatsapp');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (systemStatus) {
      setEvolutionUrl(systemStatus.whatsapp_integration.evolution_api_url);
      setEvolutionInstance(systemStatus.whatsapp_integration.instance);
    }
  }, [systemStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 relative shadow-2xl border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-swiggy-orange" />
            <h3 className="font-display font-bold text-lg text-white">System Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          
          {/* OpenAI API Key */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>OpenAI API Key (Optional)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-normal">
                {systemStatus?.openai_configured ? '● Key Loaded' : '○ Smart Fallback Active'}
              </span>
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
            />
            <p className="text-[10px] text-slate-400">
              Leave blank to use Zippy's built-in NLP agent engine for Swiggy MCP tool execution.
            </p>
          </div>

          {/* Evolution API Settings */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-swiggy-orange" />
              <span>WhatsApp Evolution API Endpoint</span>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">API Server URL</span>
                <input
                  type="text"
                  value={evolutionUrl}
                  onChange={(e) => setEvolutionUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Instance Name</span>
                <input
                  type="text"
                  value={evolutionInstance}
                  onChange={(e) => setEvolutionInstance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
                />
              </div>
            </div>
          </div>

          {/* Webhook URL indicator */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Incoming Webhook URL</span>
            <code className="text-[11px] font-mono text-emerald-400 block break-all">
              http://your-server-ip:8000/api/whatsapp/webhook
            </code>
            <p className="text-[10px] text-slate-400 mt-1">
              Configure this webhook URL in Evolution API or Twilio to route real WhatsApp messages to Zippy!
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-swiggy-orange hover:bg-swiggy-hover text-white rounded-xl text-xs font-bold transition-colors duration-150 flex items-center space-x-1.5 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
