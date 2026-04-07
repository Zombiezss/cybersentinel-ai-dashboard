import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Cpu, Lock, Trash2, RefreshCcw } from 'lucide-react';
import { SystemSetting } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface SettingsPanelProps {
  settings: SystemSetting[];
  onToggle: (id: string) => void;
  onFlushLogs: () => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle, onFlushLogs, onReset }) => {
  const categories = Array.from(new Set(settings.map(s => s.category)));

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-white">System Settings</h2>
          <p className="text-slate-400 font-medium">Configure Sentinel AI core parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <div key={category} className="glass-card">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              {category === 'Security' && <Shield className="w-5 h-5 text-blue-400" />}
              {category === 'AI Agent' && <Cpu className="w-5 h-5 text-blue-400" />}
              {category === 'System' && <Bell className="w-5 h-5 text-blue-400" />}
              <h3 className="font-bold text-slate-200 uppercase tracking-widest text-sm">{category}</h3>
            </div>
            
            <div className="space-y-6">
              {settings.filter(s => s.category === category).map((setting) => (
                <div key={setting.id} className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{setting.label}</p>
                    <p className="text-xs text-slate-500">{setting.desc}</p>
                  </div>
                  <button 
                    onClick={() => onToggle(setting.id)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-colors duration-300",
                      setting.enabled ? "bg-blue-600" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                      setting.enabled ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card border-red-500/20 bg-red-500/[0.02]">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-red-400 uppercase tracking-widest text-sm">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">These actions are irreversible and may cause system instability.</p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onFlushLogs}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Trash2 className="w-4 h-4" />
            Flush All Logs
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            <RefreshCcw className="w-4 h-4" />
            Factory Reset Core
          </button>
        </div>
      </div>
    </div>
  );
};
