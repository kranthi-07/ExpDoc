import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileText, Sparkles, Cpu } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface BuildingPdfModalProps {
  isOpen: boolean;
  fileName: string;
  pageCount?: number;
  onComplete: () => void;
}

const BUILD_STEPS = [
  { percent: 15, text: "Initializing Local PDF Engine..." },
  { percent: 40, text: "Synthesizing Typography & Alignment..." },
  { percent: 70, text: "Embedding Vector Graphics & Layouts..." },
  { percent: 90, text: "Compiling A4 Vector Document Pages..." },
  { percent: 100, text: "PDF Build Complete! Ready to Save." }
];

export default function BuildingPdfModal({
  isOpen,
  fileName,
  pageCount = 1,
  onComplete
}: BuildingPdfModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIndex(0);
      setIsDone(false);
      return;
    }

    // Step-by-step progress simulation to showcase the custom building animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          haptics.success();
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 6;
        const capped = Math.min(next, 100);

        // Update step message based on progress threshold
        if (capped >= 90) setCurrentStepIndex(3);
        else if (capped >= 65) setCurrentStepIndex(2);
        else if (capped >= 35) setCurrentStepIndex(1);
        else setCurrentStepIndex(0);

        if (capped >= 100) {
          clearInterval(interval);
          setIsDone(true);
          haptics.success();
          setTimeout(() => {
            onComplete();
          }, 450);
        }
        return capped;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          
          {/* Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/75 dark:bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-[#070b18]/95 border border-indigo-500/30 dark:border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(6,182,212,0.15)] backdrop-blur-2xl text-center overflow-hidden"
          >
            {/* Top Ambient Glow Pill */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AIR-GAPPED COMPILER ACTIVE</span>
            </div>

            {/* ============================================================== */}
            {/* CUSTOMIZED 3D "BUILDING A PDF" ANIMATION VISUAL STAGE          */}
            {/* ============================================================== */}
            <div className="relative w-40 h-48 mx-auto mb-6 flex items-center justify-center">
              
              {/* Back Page 3 (Stack Layer) */}
              <motion.div
                animate={{ 
                  y: [4, 8, 4],
                  rotate: [-3, -6, -3],
                  scale: [0.92, 0.94, 0.92]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute w-28 h-36 bg-indigo-200/50 dark:bg-indigo-950/60 rounded-xl border border-indigo-400/30 shadow-md"
              />

              {/* Back Page 2 (Stack Layer) */}
              <motion.div
                animate={{ 
                  y: [2, 4, 2],
                  rotate: [3, 5, 3],
                  scale: [0.95, 0.97, 0.95]
                }}
                transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: 0.2 }}
                className="absolute w-30 h-38 bg-indigo-100/70 dark:bg-indigo-900/40 rounded-xl border border-cyan-400/30 shadow-md"
              />

              {/* Main Active A4 Paper Sheet Being Built */}
              <motion.div
                animate={{ 
                  y: [-2, 2, -2],
                  scale: isDone ? 1.05 : 1
                }}
                transition={{ repeat: isDone ? 0 : Infinity, duration: 2, ease: "easeInOut" }}
                className="relative w-32 h-42 bg-white dark:bg-[#0c1222] rounded-xl border-2 border-indigo-500/60 dark:border-cyan-400/60 shadow-2xl p-3.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Laser Scanning Beam Traversing the Page */}
                {!isDone && (
                  <motion.div
                    animate={{ 
                      y: [0, 140, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20"
                  />
                )}

                {/* Simulated Text Lines Shimmering as PDF builds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-2 rounded bg-indigo-500/40 dark:bg-cyan-400/40" />
                    <span className="text-[7px] font-mono font-bold text-indigo-600 dark:text-cyan-400">PDF</span>
                  </div>
                  
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-full h-1.5 rounded bg-slate-300 dark:bg-white/20" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    className="w-4/5 h-1.5 rounded bg-slate-300 dark:bg-white/20" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                    className="w-full h-1.5 rounded bg-slate-300 dark:bg-white/20" 
                  />

                  {/* Simulated Image Box on Sheet */}
                  <div className="w-full h-9 rounded-lg bg-gradient-to-br from-indigo-500/10 via-cyan-500/15 to-transparent border border-dashed border-indigo-400/40 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                  </div>

                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                    className="w-3/5 h-1.5 rounded bg-slate-300 dark:bg-white/20" 
                  />
                </div>

                {/* Bottom Sheet Stamp */}
                <div className="pt-1 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[7px] font-mono text-slate-400 dark:text-zinc-400">
                  <span>A4 // 300DPI</span>
                  <span>PG 1/{pageCount}</span>
                </div>

                {/* Success Checkmark Stamp When Complete */}
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30"
                    >
                      <CheckCircle2 className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-mono font-bold tracking-wider">COMPILED</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Document Title */}
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1 truncate px-2">
              Building &quot;{fileName}&quot;
            </h3>

            {/* Step Subtext */}
            <p className="text-xs font-mono text-indigo-600 dark:text-cyan-400 mb-5 min-h-[1.25rem] transition-all">
              {isDone ? "Finalizing PDF synthesis..." : BUILD_STEPS[currentStepIndex].text}
            </p>

            {/* Neon Glowing Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/10 mb-3 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)] relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full animate-pulse" />
              </motion.div>
            </div>

            {/* Progress Telemetry Metrics */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400 px-1">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-500 dark:text-cyan-400" />
                <span>Zero-Cloud Silicon Engine</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {progress}%
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
