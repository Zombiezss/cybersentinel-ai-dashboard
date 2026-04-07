import { motion } from 'motion/react';
import { Shield, Terminal } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-2 border-r-2 border-blue-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-10 h-10 text-blue-500" />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 text-blue-400 font-mono text-lg">
          <Terminal className="w-5 h-5" />
          <span>Initializing CyberSentinel AI Agent...</span>
        </div>
        <div className="mt-4 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
