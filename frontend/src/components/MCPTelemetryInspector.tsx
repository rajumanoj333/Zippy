import React, { useState, useEffect } from 'react';
import { Cpu, Play, Terminal, Code2, Database, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { fetchMCPTools, executeMCPTool } from '../services/api';

export const MCPTelemetryInspector: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('swiggy_search_food');
  const [customArgs, setCustomArgs] = useState<string>('{\n  "query": "biryani",\n  "max_budget": 350,\n  "high_protein": true\n}');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMCPTools();
        setTools(data.tools || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    const targetTool = tools.find(t => t.name === toolName);
    if (targetTool && targetTool.parameters?.properties) {
      const sampleArgs: any = {};
      Object.keys(targetTool.parameters.properties).forEach(key => {
        if (key === 'query') sampleArgs[key] = 'biryani';
        else if (key === 'max_budget') sampleArgs[key] = 300;
        else if (key === 'high_protein') sampleArgs[key] = true;
        else if (key === 'daily_budget') sampleArgs[key] = 500;
        else if (key === 'items') sampleArgs[key] = [{ item_id: 'item_101', quantity: 1 }];
        else if (key === 'cart_id') sampleArgs[key] = 'CART-DEMO89';
      });
      setCustomArgs(JSON.stringify(sampleArgs, null, 2));
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult(null);
    try {
      const parsedArgs = JSON.parse(customArgs);
      const res = await executeMCPTool(selectedTool, parsedArgs);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({ error: `JSON Parse Error or Tool Failure: ${err.message}` });
    } finally {
      setExecuting(false);
    }
  };

  const currentToolObj = tools.find(t => t.name === selectedTool);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Model Context Protocol Standard</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Swiggy MCP Tools & Telemetry Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore registered Swiggy MCP tool specifications and execute direct RPC calls against the server.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Registered MCP Tools List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Database className="w-4 h-4 text-swiggy-orange" />
            <span>Registered MCP Tools ({tools.length})</span>
          </h3>

          <div className="space-y-2">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => handleToolSelect(t.name)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedTool === t.name
                    ? 'bg-swiggy-orange/15 border-swiggy-orange text-white shadow-lg shadow-swiggy-orange/10'
                    : 'glass-panel border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-swiggy-orange">{t.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Schema & Interactive Execution Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Tool Schema Header */}
          {currentToolObj && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    fn: {currentToolObj.name}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-0.5">
                    {currentToolObj.description}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                  MCP Protocol v1.0
                </span>
              </div>

              {/* Arguments JSON Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-swiggy-orange" />
                    <span>Input JSON Parameters:</span>
                  </label>
                  <button
                    onClick={handleExecute}
                    disabled={executing}
                    className="px-4 py-1.5 bg-swiggy-orange hover:bg-swiggy-hover text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{executing ? 'Executing...' : 'Run Tool Call'}</span>
                  </button>
                </div>

                <textarea
                  value={customArgs}
                  onChange={(e) => setCustomArgs(e.target.value)}
                  rows={6}
                  className="w-full bg-[#070a0f] font-mono text-xs text-emerald-300 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-swiggy-orange"
                />
              </div>
            </div>
          )}

          {/* Execution Result Payload */}
          {executionResult && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Swiggy MCP Response Output</span>
              </div>
              <pre className="bg-[#070a0f] p-4 rounded-xl text-xs font-mono text-slate-200 border border-slate-800/80 overflow-x-auto max-h-96">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
