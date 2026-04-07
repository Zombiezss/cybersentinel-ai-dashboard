import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card p-6 border-white/10 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDanger ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{title}</h3>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2 rounded-xl text-white transition-all font-bold text-sm ${
                  isDanger 
                    ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
