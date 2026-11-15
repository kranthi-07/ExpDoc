import PageTransition from '../components/PageTransition';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

export default function Privacy() {
  return (
    <PageTransition>
      <div className="w-full max-w-3xl mx-auto py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>PRIVACY ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Zero Telemetry Guarantee • Absolute Client Confidentiality
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#070b18]/80 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl space-y-6 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-light">
          
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                Zero Cloud Storage Guarantee
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300">
                Your documents never leave your physical computer or phone. PDF compiling is completed entirely inside client RAM.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
              1. Information Collection
            </h2>
            <p>
              We do not track IP addresses, document contents, session telemetry, user identifiers, or behavioral analytics. No third-party ad networks or cross-site tracking pixels are embedded.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Local Storage Usage
            </h2>
            <p>
              Your system uses browser <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-xs">localStorage</code> strictly to persist your preferred color mode (Light vs. Dark). No personally identifiable data is stored.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Service Worker & Offline PWA Cache
            </h2>
            <p>
              EXPDOC uses modern Progressive Web App (PWA) cache headers so you can disconnect your internet and execute PDF manipulations completely offline.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}