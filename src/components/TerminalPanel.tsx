import { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { LogEntry } from '@/src/types';
import { cn } from '@/src/lib/utils';

export const TerminalPanel = ({ logs }: { logs: LogEntry[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card flex flex-col h-full min-h-[300px] border-white/5 bg-black/40">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">System Live Logs</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-sm space-y-1.5 custom-scrollbar pr-2"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 group">
            <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
            <div className="flex gap-2">
              <span className={cn(
                "shrink-0 font-bold",
                log.type === 'error' && "text-red-500",
                log.type === 'warning' && "text-yellow-500",
                log.type === 'success' && "text-green-500",
                log.type === 'info' && "text-blue-500"
              )}>
                {log.type.toUpperCase()}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
              <span className="text-slate-300 group-hover:text-white transition-colors break-all">
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div className="flex gap-2 items-center text-blue-400 animate-pulse">
          <ChevronRight className="w-4 h-4" />
          <div className="w-2 h-4 bg-blue-400" />
        </div>
      </div>
    </div>
  );
};
