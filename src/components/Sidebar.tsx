import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  AlertTriangle, 
  Cpu, 
  Settings, 
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Terminal, label: 'Logs', id: 'logs' },
  { icon: ShieldAlert, label: 'Alerts', id: 'alerts' },
  { icon: Cpu, label: 'AI Actions', id: 'actions' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          SENTINEL
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
