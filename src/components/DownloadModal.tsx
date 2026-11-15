import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fileName: string) => void;
  defaultFileName: string;
}

export default function DownloadModal({ isOpen, onClose, onConfirm, defaultFileName }: DownloadModalProps) {
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFileName(defaultFileName.replace(/\.pdf$/i, ''));
    }
  }, [isOpen, defaultFileName]);

  const handleClose = () => {
    haptics.light();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptics.medium();
    let finalName = fileName.trim() || defaultFileName;
    if (!finalName.toLowerCase().endsWith('.pdf')) {
      finalName += '.pdf';
    }
    onConfirm(finalName);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            className="relative w-full max-w-md bg-white/95 dark:bg-[#070b18]/95 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 backdrop-blur-2xl overflow-hidden"
          >
            {/* Top right close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-500 dark:text-cyan-400">
                EXPORT PIPELINE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mb-1.5 tracking-tight">
              Designate Document Name
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mb-6 font-light">
              Choose a specific output label for your compiled PDF document.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <input
                  type="text"
                  autoFocus
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. quarterly_report_2026"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 transition-all pr-14 text-sm font-medium shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-zinc-500 pointer-events-none">
                  .pdf
                </span>
              </div>

              {/* Action Buttons: Stack nicely on mobile */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Save & Download
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}