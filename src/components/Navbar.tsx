import React from 'react';
import { Activity, Volume2, VolumeX } from 'lucide-react';
import { SystemStatus } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  status: SystemStatus;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ status, isSoundEnabled, onToggleSound }) => {
  const statusConfig = {
    live: { label: 'LIVE', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    critical: { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    degraded: { label: 'DEGRADED', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    recovered: { label: 'RECOVERED', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  };

  const config = statusConfig[status];

  return (
    <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-widest",
          config.bg, config.color, config.border
        )}>
          <Activity className="w-3 h-3" />
          {config.label}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSound}
          className={cn(
            "p-2 rounded-lg transition-all duration-200 group relative",
            isSoundEnabled ? "text-blue-400 hover:bg-blue-500/10" : "text-slate-500 hover:bg-white/5"
          )}
          title={isSoundEnabled ? "Mute Alerts" : "Unmute Alerts (Enables Audio)"}
        >
          {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {!isSoundEnabled && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
