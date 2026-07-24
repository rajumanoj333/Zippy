import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, MoreVertical, Sparkles, Terminal, ChevronRight, CheckCheck, Loader2, Bot, ShieldCheck, Zap, Layers } from 'lucide-react';
import { simulateChat, ChatSimulationResponse } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  executionLogs?: any[];
  mcpCalls?: any[];
}

export const WhatsAppSimulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: '*Zippy Swiggy Assistant*\n━━━━━━━━━━━━━━━━━━━━━━\nWelcome! You can text me in natural language to perform real-world actions:\n\n• *Food Search:* "Find paneer biryani under ₹250"\n• *Instamart Groceries:* "Get 2L milk and 6 eggs"\n• *AI Meal Planning:* "Plan 3-day high protein diet under ₹500/day"\n• *Order Tracking:* "Where is my order?"\n\nWhat would you like to order today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [activeMCPCalls, setActiveMCPCalls] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    { title: 'High-Protein Lunch under ₹300', text: 'Order me a high protein lunch under ₹300 in Indiranagar' },
    { title: '3-Day High-Protein Meal Plan', text: 'Plan 3 days of healthy meals under ₹500 per day' },
    { title: 'Instamart Milk & Eggs', text: 'Order 2L Amul Taaza milk and 6 eggs from Instamart' },
    { title: 'Track Active Swiggy Order', text: 'Where is my order?' },
    { title: 'Quick Paneer Biryani', text: 'Order paneer biryani under ₹300' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const res: ChatSimulationResponse = await simulateChat(textToSend);
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: res.whatsapp_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        executionLogs: res.execution_logs,
        mcpCalls: res.mcp_calls
      };

      setMessages(prev => [...prev, agentMsg]);
      setActiveLogs(res.execution_logs || []);
      setActiveMCPCalls(res.mcp_calls || []);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: '*Error:* Unable to reach Zippy backend. Ensure FastAPI service is running on port 8000.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedWhatsAppText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const boldParts = line.split(/\*(.*?)\*/g);
      return (
        <p key={idx} className="min-h-[1.2rem] my-0.5 font-normal">
          {boldParts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="font-semibold text-emerald-300">{part}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto py-4 px-2 sm:px-4">
      
      {/* LEFT: WhatsApp Sandbox Frame */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        <div className="w-full max-w-md bg-[#111B21] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[720px]">
          
          {/* Header */}
          <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-slate-800 text-white select-none">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-swiggy-orange to-amber-500 flex items-center justify-center text-white font-bold shadow">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#202C33]"></span>
              </div>
              <div>
                <h3 className="font-semibold text-xs flex items-center space-x-1">
                  <span>Zippy Swiggy Agent</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-medium">Verified Swiggy MCP Bot • Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Phone className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B141A] bg-[radial-gradient(#1F2C34_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#005C4B] text-slate-100 rounded-tr-none'
                      : 'bg-[#202C33] text-slate-100 rounded-tl-none border border-slate-700/40'
                  }`}
                >
                  {renderFormattedWhatsAppText(msg.text)}

                  <div className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                  </div>
                </div>

                {msg.sender === 'agent' && msg.mcpCalls && msg.mcpCalls.length > 0 && (
                  <div className="mt-1 flex items-center space-x-1 text-[10px] text-swiggy-orange bg-swiggy-orange/10 px-2 py-0.5 rounded border border-swiggy-orange/20">
                    <Zap className="w-3 h-3" />
                    <span>Executed Swiggy MCP: <strong>{msg.mcpCalls.map(c => c.tool).join(', ')}</strong></span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 bg-[#202C33] text-slate-300 px-3 py-2 rounded-2xl w-max rounded-tl-none border border-slate-700 text-xs font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-swiggy-orange" />
                <span>Processing Swiggy MCP Request...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="bg-[#111B21] px-3 py-2 border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex items-center space-x-2">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-swiggy-orange hover:text-white text-slate-300 transition-colors duration-150 flex items-center space-x-1 border border-slate-700/60 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="bg-[#202C33] p-3 flex items-center space-x-2 border-t border-slate-800">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type message e.g. 'Order paneer biryani under ₹300'..."
              className="flex-1 bg-[#2A3942] text-slate-100 text-xs rounded-full px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange placeholder-slate-400 font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="w-9 h-9 rounded-full bg-swiggy-orange hover:bg-swiggy-hover text-white flex items-center justify-center transition-colors duration-150 disabled:opacity-50 shadow shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-swiggy-orange"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Agent Reasoning & Swiggy MCP Execution Dashboard */}
      <div className="lg:col-span-5 space-y-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-swiggy-orange" />
              <h3 className="font-display font-bold text-white text-sm">Agent Telemetry & Execution Flow</h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Inspect live agent reasoning steps, intent classification, and Swiggy MCP protocol payload dispatches.
          </p>
        </div>

        {/* Execution Logs */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 max-h-[540px] overflow-y-auto">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-swiggy-orange" />
            <span>Execution Pipeline</span>
          </h4>

          {activeLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Bot className="w-6 h-6 mx-auto text-slate-600" />
              <p className="text-xs">Send a message to view live step-by-step reasoning & MCP protocol calls.</p>
            </div>
          ) : (
            activeLogs.map((log, idx) => (
              <div key={idx} className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-swiggy-orange flex items-center space-x-1">
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>{log.title}</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-800">
                    {log.step}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                  {log.detail}
                </div>
              </div>
            ))
          )}

          {activeMCPCalls.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Swiggy MCP Tool Call Payload</span>
              </h4>
              {activeMCPCalls.map((c, i) => (
                <pre key={i} className="text-[10px] font-mono bg-emerald-950/20 text-emerald-300 p-2.5 rounded-lg border border-emerald-500/20 overflow-x-auto">
                  {JSON.stringify(c, null, 2)}
                </pre>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
