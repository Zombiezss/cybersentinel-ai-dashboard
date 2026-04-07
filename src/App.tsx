import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DashboardData, LogEntry, Alert, AIAction, SystemStatus } from './types';
import { cn } from './lib/utils';
import { CyberBackground } from './components/CyberBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MetricsPanel } from './components/MetricsPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { AlertsPanel } from './components/AlertsPanel';
import { AIPanel } from './components/AIPanel';
import { ScorePanel } from './components/ScorePanel';
import { StatusBadge } from './components/StatusBadge';
import { SettingsPanel } from './components/SettingsPanel';
import { Zap, ZapOff, AlertTriangle, RefreshCw, ShieldAlert, Activity } from 'lucide-react';
import { ConfirmationModal } from './components/ConfirmationModal';

const INITIAL_DATA: DashboardData = {
  cpu: 0,
  memory: 0,
  network: 0,
  errors: 0,
  status: 'live',
  score: 1.0,
  logs: [
    { id: '1', timestamp: new Date().toLocaleTimeString([], { hour12: false }), message: 'Sentinel AI Core initialized. Awaiting backend connection...', type: 'info' },
  ],
  alerts: [],
  aiActions: [],
  settings: [
    { id: '1', category: 'Security', label: 'Real-time Threat Detection', desc: 'AI scans all incoming packets for anomalies.', enabled: true },
    { id: '2', category: 'Security', label: 'Auto-Quarantine', desc: 'Automatically isolate suspicious nodes.', enabled: false },
    { id: '3', category: 'AI Agent', label: 'Autonomous Mitigation', desc: 'Allow AI to execute fixes without approval.', enabled: true },
    { id: '4', category: 'AI Agent', label: 'Deep Reasoning Mode', desc: 'Increases accuracy but adds 200ms latency.', enabled: true },
    { id: '5', category: 'System', label: 'Verbose Logging', desc: 'Capture detailed debug information.', enabled: false },
    { id: '6', category: 'System', label: 'Cloud Sync', desc: 'Backup system state to secure off-site vault.', enabled: true },
  ]
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: false
  });
  const playedAlertIds = useRef<Set<string>>(new Set());

  const playAlertSound = useCallback(() => {
    if (!isSoundEnabled) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => {
      console.error('Audio playback failed:', e);
      setIsSoundEnabled(false); // Auto-mute if playback fails
    });
  }, [isSoundEnabled]);

  const handleToggleSound = () => {
    setIsSoundEnabled(prev => !prev);
    // Play a tiny silent sound or a short beep to "unlock" audio context on first interaction
    if (!isSoundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const handleToggleSetting = (id: string) => {
    setData(prev => ({
      ...prev,
      settings: prev.settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    }));
  };

  const handleFlushLogs = () => {
    setModalConfig({
      isOpen: true,
      title: 'Flush System Logs',
      message: 'Are you sure you want to permanently delete all system logs? This action cannot be undone.',
      isDanger: true,
      onConfirm: () => {
        setData(prev => ({ ...prev, logs: [] }));
      }
    });
  };

  const handleResetCore = () => {
    setModalConfig({
      isOpen: true,
      title: 'Factory Reset Core',
      message: 'WARNING: This will reset the AI Sentinel Core to factory defaults. All current metrics and configuration will be lost.',
      isDanger: true,
      onConfirm: () => {
        setData(INITIAL_DATA);
      }
    });
  };

  const handleLogout = () => {
    setModalConfig({
      isOpen: true,
      title: 'Terminate Session',
      message: 'Are you sure you want to terminate your secure session and logout?',
      isDanger: false,
      onConfirm: () => {
        setIsLoading(true);
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  };

  const handleBlockIP = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setData(prev => ({
      ...prev,
      cpu: Math.max(0, prev.cpu - 25),
      errors: Math.max(0, prev.errors - 5),
      network: Math.max(0, prev.network - 30),
      status: prev.status === 'critical' ? 'recovered' : prev.status,
      logs: [
        { 
          id: Math.random().toString(), 
          timestamp, 
          message: 'ACTION: IP 142.250.190.46 blocked by administrator.', 
          type: 'success'as const
        },
        ...prev.logs
      ].slice(0, 50)
    }));
  };
  const fetchBackendData = useCallback(async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/state");
    const json = await res.json();

    setData((prev: DashboardData) => ({
      ...prev,
      cpu: json.cpu,
      memory: json.memory,
      errors: json.errors,
      network: json.network ?? prev.network,
      status: json.status ?? prev.status,

      alerts: json.alerts ?? prev.alerts,
      aiActions: json.aiActions ?? prev.aiActions,

      logs: [
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          message: json.logs,
          type: "info" as const
        },
        ...prev.logs
      ].slice(0, 50)
    }));

  } catch (err) {
    console.error("Backend error:", err);
  }
}, []);
useEffect(() => {
  fetchBackendData(); // first call

  const interval = setInterval(() => {
    fetchBackendData();
  }, 2000);

  return () => clearInterval(interval);
}, [fetchBackendData]);

  // Watch for new high alerts
  useEffect(() => {
    const activeHighAlerts = data.alerts.filter(a => a.severity === 'high' && a.status === 'active');
    
    activeHighAlerts.forEach(alert => {
      if (!playedAlertIds.current.has(alert.id)) {
        // Play sound only once per alert ID
        playAlertSound();
        playedAlertIds.current.add(alert.id);

        // Add to UI notifications
        setNotifications(prev => {
          if (!prev.find(n => n.id === alert.id)) {
            // Auto-remove notification after 5 seconds
            setTimeout(() => {
              setNotifications(current => current.filter(n => n.id !== alert.id));
            }, 5000);
            return [...prev, alert];
          }
          return prev;
        });
      }
    });
  }, [data.alerts, playAlertSound]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between glass-card p-4 border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Actions</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleResetCore}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
                <button 
                  onClick={handleBlockIP}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                >
                  <ShieldAlert className="w-3 h-3" />
                  Block IP
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <MetricsPanel cpu={data.cpu} memory={data.memory} network={data.network} errors={data.errors} />
                <AlertsPanel alerts={data.alerts} />
              </div>
              <div className="h-full">
                <AIPanel actions={data.aiActions} />
              </div>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="max-w-7xl mx-auto h-[calc(100vh-160px)]">
            <TerminalPanel logs={data.logs} />
          </div>
        );
      case 'alerts':
        return (
          <div className="max-w-4xl mx-auto">
            <AlertsPanel alerts={data.alerts} />
          </div>
        );
      case 'actions':
        return (
          <div className="max-w-4xl mx-auto h-[calc(100vh-160px)]">
            <AIPanel actions={data.aiActions} />
          </div>
        );
      case 'settings':
        return (
          <SettingsPanel 
            settings={data.settings} 
            onToggle={handleToggleSetting}
            onFlushLogs={handleFlushLogs}
            onReset={handleResetCore}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <CyberBackground />
      
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Notifications Overlay */}
      <div className="fixed top-20 right-8 z-50 space-y-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="w-80 glass-card border-red-500 bg-red-500/20 p-4 pointer-events-auto shadow-[0_0_20px_rgba(239,68,68,0.3)] overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500 text-white animate-pulse shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">CRITICAL ALERT</h4>
                    <span className="text-[9px] font-mono text-red-300/60">{n.timestamp}</span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                  <p className="text-[10px] text-red-100/80 leading-relaxed line-clamp-2">{n.description}</p>
                </div>
              </div>
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 bg-red-500"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <Navbar 
          status={data.status} 
          isSoundEnabled={isSoundEnabled} 
          onToggleSound={handleToggleSound} 
        />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        isDanger={modalConfig.isDanger}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}