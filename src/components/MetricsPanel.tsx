import { motion } from 'motion/react';
import { Cpu, Database, Network, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const MetricCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  glowColor,
  isPercentage = true
}: { 
  label: string, 
  value: number, 
  icon: any, 
  color: string, 
  glowColor: string,
  isPercentage?: boolean
}) => {
  const isHigh = isPercentage ? value > 85 : value > 10;

  return (
    <div className={cn(
      "glass-card flex-1 min-w-[200px]",
      isHigh && "neon-red border-red-500/50"
    )}>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("p-2 rounded-lg bg-white/5 shrink-0", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-slate-400 font-medium truncate">{label}</span>
        </div>
        <span className={cn("font-mono font-bold text-xl shrink-0", isHigh ? "text-red-400" : "text-white")}>
          {isPercentage ? `${value.toFixed(1)}%` : value}
        </span>
      </div>
      
      <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isPercentage ? `${value}%` : `${Math.min(100, (value / 20) * 100)}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className={cn("h-full rounded-full relative", glowColor)}
        >
          {isHigh && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-white/20"
            />
          )}
        </motion.div>
      </div>
      
      <div className="mt-3 flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        <span>{isPercentage ? "Optimal" : "Stable"}</span>
        <span>{isPercentage ? "Critical" : "Critical"}</span>
      </div>
    </div>
  );
};

export const MetricsPanel = ({ cpu, memory, network, errors }: { cpu: number, memory: number, network: number, errors: number }) => {
  return (
    <div className="flex flex-wrap gap-6">
      <MetricCard 
        label="CPU Usage" 
        value={cpu} 
        icon={Cpu} 
        color="text-blue-400" 
        glowColor="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
      />
      <MetricCard 
        label="Memory" 
        value={memory} 
        icon={Database} 
        color="text-purple-400" 
        glowColor="bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
      />
      <MetricCard 
        label="Network" 
        value={network} 
        icon={Network} 
        color="text-cyan-400" 
        glowColor="bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
      />
      <MetricCard 
        label="System Errors" 
        value={errors} 
        icon={AlertCircle} 
        color="text-red-400" 
        glowColor="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
        isPercentage={false}
      />
    </div>
  );
};
