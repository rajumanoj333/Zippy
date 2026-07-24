import React, { useState, useEffect } from 'react';
import { Cpu, Play, Code2, Database, Zap, ChevronRight } from 'lucide-react';
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
      setExecutionResult({ error: `JSON Parse Error: ${err.message}` });
    } finally {
      setExecuting(false);
    }
  };

  const currentToolObj = tools.find(t => t.name === selectedTool);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>MCP Protocol Inspector</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Swiggy MCP Tools Sandbox
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Execute raw Model Context Protocol requests against the Swiggy server and view output payloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-swiggy-orange" />
            <span>MCP Tools ({tools.length})</span>
          </h3>

          <div className="space-y-2">
            {tools.map((t) => (
              <button
                key={t.name}
                onClick={() => handleToolSelect(t.name)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
                  selectedTool === t.name
                    ? 'bg-swiggy-orange/10 border-swiggy-orange/60 text-white shadow-sm'
                    : 'glass-panel border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-swiggy-orange">{t.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {currentToolObj && (
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    fn: {currentToolObj.name}
                  </span>
                  <h4 className="text-xs text-slate-300 mt-0.5 font-medium">
                    {currentToolObj.description}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                  MCP v1.0
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-swiggy-orange" />
                    <span>JSON Input Parameters:</span>
                  </label>
                  <button
                    onClick={handleExecute}
                    disabled={executing}
                    className="px-3.5 py-1.5 bg-swiggy-orange hover:bg-swiggy-hover text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{executing ? 'Executing...' : 'Run Tool Call'}</span>
                  </button>
                </div>

                <textarea
                  value={customArgs}
                  onChange={(e) => setCustomArgs(e.target.value)}
                  rows={6}
                  className="w-full bg-[#070A0F] font-mono text-xs text-emerald-300 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-swiggy-orange"
                />
              </div>
            </div>
          )}

          {executionResult && (
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Response Output</span>
              </div>
              <pre className="bg-[#070A0F] p-3.5 rounded-xl text-xs font-mono text-slate-200 border border-slate-800/80 overflow-x-auto max-h-96">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
