import { motion } from 'motion/react';

export const CyberBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
      
      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"
      />
      
      <div className="scanline" />
    </div>
  );
};
