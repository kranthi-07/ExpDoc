import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-6 sm:py-10 mt-auto mb-20 lg:mb-0 border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
        
        {/* Brand & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-mono text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-zinc-300">EXPDOC OS ONLINE</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>&copy; {new Date().getFullYear()} EXP STUDIO. LOCAL FIRST.</span>
        </div>

        {/* Feature Highlights */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-slate-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            ZERO TELEMETRY
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            WASM RUNTIME
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            Support Matrix
          </Link>
        </div>
      </div>
    </footer>
  );
}