import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { SwiggyCatalogExplorer } from './components/SwiggyCatalogExplorer';
import { AIMealPlanner } from './components/AIMealPlanner';
import { MCPTelemetryInspector } from './components/MCPTelemetryInspector';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { ConfigModal } from './components/ConfigModal';
import { fetchSystemStatus, SystemStatus } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await fetchSystemStatus();
        setSystemStatus(data);
      } catch (e) {
        console.error("Could not reach Zippy status endpoint:", e);
      }
    };
    loadStatus();
  }, []);

  const handleTriggerWhatsAppOrder = (promptText: string) => {
    setActiveTab('chat');
    // Give simulator time to render then dispatch message
    setTimeout(() => {
      const inputEl = document.querySelector('input[placeholder*="Text Zippy"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.value = promptText;
        // Dispatch enter key or click send
        const sendBtn = inputEl.nextElementSibling as HTMLButtonElement;
        if (sendBtn) sendBtn.click();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        onOpenSettings={() => setIsConfigOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'chat' && <WhatsAppSimulator />}
        {activeTab === 'catalog' && (
          <SwiggyCatalogExplorer onTriggerWhatsAppOrder={handleTriggerWhatsAppOrder} />
        )}
        {activeTab === 'meal-planner' && (
          <AIMealPlanner onSendToWhatsApp={handleTriggerWhatsAppOrder} />
        )}
        {activeTab === 'mcp-inspector' && <MCPTelemetryInspector />}
        {activeTab === 'order-tracker' && <LiveOrderTracker />}
      </main>

      {/* Configuration Drawer Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        systemStatus={systemStatus}
      />
    </div>
  );
}

export default App;
