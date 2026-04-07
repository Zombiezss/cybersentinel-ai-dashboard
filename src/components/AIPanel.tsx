import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Search, Zap, CheckCircle2, Loader2, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { AIAction, AIActionStep } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ActionStepProps {
  step: AIActionStep;
  index: number;
}

const ActionStep: React.FC<ActionStepProps> = ({ step, index }) => {
  const statusColors = {
    completed: 'text-green-400 bg-green-500/20',
    executing: 'text-blue-400 bg-blue-500/20',
    pending: 'text-slate-500 bg-white/5',
    failed: 'text-red-400 bg-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 group/step"
    >
      <div className="flex flex-col items-center shrink-0 mt-1">
        <div className={cn(
          "w-2 h-2 rounded-full",
          step.status === 'completed' ? "bg-green-500" : 
          step.status === 'executing' ? "bg-blue-500 animate-pulse" : "bg-slate-600"
        )} />
        <div className="w-[1px] h-8 bg-white/10" />
      </div>
      
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-xs font-medium transition-colors",
            step.status === 'completed' ? "text-slate-300" : 
            step.status === 'executing' ? "text-blue-400" : "text-slate-500"
          )}>
            {step.message}
          </p>
          <span className="text-[9px] font-mono text-slate-600 shrink-0">{step.timestamp}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className={cn(
            "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
            statusColors[step.status]
          )}>
            {step.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface ActionItemProps {
  action: AIAction;
}

const ActionItem: React.FC<ActionItemProps> = ({ action }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={cn(
        "glass-card p-0 overflow-hidden transition-all duration-300",
        isExpanded ? "border-blue-500/40 bg-blue-500/[0.05]" : "border-white/5 hover:border-white/10"
      )}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-4 text-left group"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          action.status === 'completed' ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
        )}>
          {action.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
              {action.action}
            </h4>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-slate-500">{action.timestamp}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${action.progress}%` }}
                className={cn(
                  "h-full transition-colors",
                  action.status === 'completed' ? "bg-green-500" : "bg-blue-500"
                )}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{action.progress}%</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="pt-2 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                Execution Timeline
              </div>
              <div className="space-y-0">
                {action.reasoning.map((step, idx) => (
                  <ActionStep key={idx} step={step} index={idx} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AIPanel = ({ actions }: { actions: AIAction[] }) => {
  return (
    <div className="glass-card h-full flex flex-col border-blue-500/20 bg-blue-500/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">AI Sentinel Agent</h3>
            <p className="text-[10px] text-blue-400 font-mono">AUTONOMOUS MODE: ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-blue-400">MONITORING...</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {actions.map((action) => (
            <ActionItem key={action.id} action={action} />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-500 uppercase">Decision Confidence</span>
          </div>
          <span className="text-[10px] font-mono text-blue-400">98.4%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "98.4%" }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
