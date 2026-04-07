import { motion } from 'motion/react';
import { Target, TrendingUp } from 'lucide-react';

export const ScorePanel = ({ score }: { score: number }) => {
  const percentage = Math.round(score * 100);
  
  return (
    <div className="glass-card flex flex-col justify-center border-purple-500/20 bg-purple-500/[0.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">AI Efficiency Score</span>
        </div>
        <div className="flex items-center gap-1 text-green-400 text-xs font-mono">
          <TrendingUp className="w-3 h-3" />
          +2.4%
        </div>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <span className="text-5xl font-bold text-white tracking-tighter">{percentage}</span>
        <div className="pb-1.5">
          <span className="text-purple-400 font-mono text-lg font-bold">/100</span>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Performance Index</p>
        </div>
      </div>

      <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Latency', val: '12ms' },
          { label: 'Uptime', val: '99.9%' },
          { label: 'Security', val: 'MAX' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[8px] text-slate-500 uppercase font-mono">{stat.label}</p>
            <p className="text-xs font-bold text-slate-200 font-mono">{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
