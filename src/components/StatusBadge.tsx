import { motion } from 'motion/react';
import { SystemStatus } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export const StatusBadge = ({ status }: { status: SystemStatus }) => {
  const config = {
    live: { 
      icon: ShieldCheck, 
      label: 'SYSTEM RECOVERED', 
      desc: 'All services operational', 
      color: 'text-green-400', 
      bg: 'bg-green-500/10', 
      border: 'border-green-500/30',
      glow: 'neon-green'
    },
    critical: { 
      icon: ShieldX, 
      label: 'SYSTEM FAILURE', 
      desc: 'Critical security breach detected', 
      color: 'text-red-400', 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/30',
      glow: 'neon-red'
    },
    degraded: { 
      icon: ShieldAlert, 
      label: 'SYSTEM DEGRADED', 
      desc: 'High latency in primary nodes', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/10', 
      border: 'border-yellow-500/30',
      glow: 'neon-purple'
    },
    recovered: { 
      icon: ShieldCheck, 
      label: 'THREAT NEUTRALIZED', 
      desc: 'AI Agent successfully patched vulnerability', 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/30',
      glow: 'neon-blue'
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <motion.div
      key={status}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "glass-card flex items-center gap-6 p-8",
        c.border, c.glow
      )}
    >
      <div className={cn("p-4 rounded-2xl bg-white/5", c.color)}>
        <Icon className="w-12 h-12" />
      </div>
      
      <div className="flex-1">
        <h2 className={cn("text-3xl font-black tracking-tighter uppercase", c.color)}>
          {c.label}
        </h2>
        <p className="text-slate-400 font-medium mt-1">{c.desc}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 h-6 rounded-full",
                status === 'critical' ? (i <= 4 ? "bg-red-500" : "bg-white/10") :
                status === 'degraded' ? (i <= 3 ? "bg-yellow-500" : "bg-white/10") :
                "bg-green-500"
              )} 
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Integrity Level</span>
      </div>
    </motion.div>
  );
};
