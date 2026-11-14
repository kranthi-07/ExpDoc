import { toast } from 'sonner';
import PageTransition from '../components/PageTransition';
import { Sparkles, Send } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Transmission received! Support team notified.');
  };

  return (
    <PageTransition>
      <div className="w-full max-w-xl mx-auto py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>DISPATCH MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Contact Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Inquire about feature requests, custom integrations, or tool troubleshooting.
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300" 
        >
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 mb-2">
              DISPATCH EMAIL
            </label>
            <input 
              type="email" 
              required 
              placeholder="operator@organization.com"
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all shadow-inner" 
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 mb-2">
              SYSTEM MESSAGE
            </label>
            <textarea 
              required 
              rows={5} 
              placeholder="Outline your requirements or bug telemetry details..."
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl px-4 py-3 sm:py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all resize-none shadow-inner" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3 sm:py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] text-sm"
          >
            <Send className="w-4 h-4" />
            Dispatch Transmission
          </button>
        </form>
      </div>
    </PageTransition>
  );
}