import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { Alert } from '@/src/types';
import { cn } from '@/src/lib/utils';

export const AlertsPanel = ({ alerts }: { alerts: Alert[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          Active Threats
        </h3>
        <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">
          {alerts.filter(a => a.status === 'active').length} CRITICAL
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "glass-card p-4 border-l-4 relative overflow-hidden group",
                alert.severity === 'high' ? "border-l-red-500 neon-red" : 
                alert.severity === 'medium' ? "border-l-yellow-500 neon-purple" : "border-l-blue-500"
              )}
            >
              {alert.severity === 'high' && (
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  alert.severity === 'high' ? "bg-red-500/20 text-red-400" : 
                  alert.severity === 'medium' ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
                )}>
                  {alert.status === 'resolved' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-200 truncate pr-2">{alert.title}</h4>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              </div>

              {alert.severity === 'high' && alert.status === 'active' && (
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500/5 pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
