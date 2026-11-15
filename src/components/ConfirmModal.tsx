import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    haptics.light();
    onClose();
  };

  const handleConfirm = () => {
    if (isDestructive) {
      haptics.warning();
    } else {
      haptics.medium();
    }
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 350 }}
          className="relative w-full max-w-md bg-white/95 dark:bg-[#070b18]/95 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Close X */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${
              isDestructive 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/30'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
                PROMPT CONFIRMATION
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-light leading-relaxed mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm text-center"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all shadow-lg active:scale-95 ${
                isDestructive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/25'
                  : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-500/25'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}