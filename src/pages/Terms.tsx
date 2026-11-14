import PageTransition from '../components/PageTransition';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Terms() {
  return (
    <PageTransition>
      <div className="w-full max-w-3xl mx-auto py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>LEGAL SPECIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Effective Version 2.4 • Client Execution Agreement
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#070b18]/80 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl space-y-6 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-light">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
              1. Local-Silicon Execution Principle
            </h2>
            <p>
              Expedit operates as a zero-cloud, client-side utility suite. All operations—including image conversions, page extractions, watermarking, merges, and bursts—are executed within your browser's dedicated WebAssembly / JavaScript memory space. We never intercept, ingest, store, or transmit your source files.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Compression Processing Protocol
            </h2>
            <p>
              When utilizing local advanced compression routines via self-hosted backends, transmissions occur purely between your local browser and your configured endpoint. Expedit does not operate a centralized intermediary database.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Warranty Disclaimer
            </h2>
            <p>
              Expedit is provided on an "as-is" and "as-available" foundation without guarantees of any kind. You remain solely responsible for maintaining backup copies of all critical records.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}