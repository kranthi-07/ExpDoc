import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Images, 
  Layers, 
  Minimize, 
  Grid, 
  X, 
  Sparkles, 
  Type, 
  Scissors, 
  Droplet, 
  SplitSquareHorizontal, 
  Hash, 
  ChevronRight, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ALL_TOOLS = [
  { path: '/expdoc-studio', label: 'ExpDoc Studio', category: 'Create', icon: FileText, desc: 'Word-style document crafting & PDF builder' },
  { path: '/image-to-pdf', label: 'Images to PDF', category: 'Create', icon: Images, desc: 'Compile JPG/PNG photos into document' },
  { path: '/text-to-pdf', label: 'Text to PDF', category: 'Create', icon: Type, desc: 'Auto-paginated vector text compilation' },
  { path: '/compress-pdf', label: 'Compress PDF', category: 'Modify', icon: Minimize, desc: 'Targeted percentage downsampling' },
  { path: '/merge-pdf', label: 'Merge PDFs', category: 'Modify', icon: Layers, desc: 'Stitch documents with visual drag & drop' },
  { path: '/extract-pages', label: 'Extract Pages', category: 'Modify', icon: Scissors, desc: 'Isolate discrete page index ranges' },
  { path: '/watermark-pdf', label: 'Watermark PDF', category: 'Security', icon: Droplet, desc: 'Diagonal custom security stamp' },
  { path: '/split-pdf', label: 'Split PDF', category: 'Organize', icon: SplitSquareHorizontal, desc: 'Burst into single-page ZIP archive' },
  { path: '/page-numbers', label: 'Page Numbers', category: 'Organize', icon: Hash, desc: 'Automated pagination numbering coordinates' },
];

export default function BottomTabBar() {
  const location = useLocation();
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'web' | 'app'>(() => {
    return (localStorage.getItem('expedit_view_mode') as 'web' | 'app') || 'app';
  });

  // Listen to Web vs App OS mode toggle from Navbar
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setViewMode(e.detail);
    };
    window.addEventListener('expedit-view-mode-change', handler);
    return () => window.removeEventListener('expedit-view-mode-change', handler);
  }, []);

  const tabs = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/image-to-pdf', label: 'Images', icon: Images },
    { path: '/merge-pdf', label: 'Merge', icon: Layers },
    { path: '/compress-pdf', label: 'Compress', icon: Minimize },
  ];

  const isMoreActive = !tabs.some(t => t.path === location.pathname);

  // In Web mode, hide mobile app bottom dock for true classic web feel
  if (viewMode === 'web') {
    return null;
  }

  return (
    <>
      {/* Native-Style Floating App Bottom Dock (Visible ONLY on Mobile & Tablet, hidden on PC) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md pointer-events-none transition-all duration-300 lg:hidden">
        <nav className="pointer-events-auto bg-white/90 dark:bg-[#070b18]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] rounded-3xl h-16 sm:h-17 px-2.5 flex items-center justify-around transition-all">
          
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path && !isMatrixOpen;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setIsMatrixOpen(false)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 group ${
                  isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="dockActivePill"
                    className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_8px_#6366f1]"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                <div className={`p-1.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-cyan-500/15 shadow-sm' 
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                </div>
                
                <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* Central / End "More Tools" App Launcher Tab */}
          <button
            onClick={() => setIsMatrixOpen(!isMatrixOpen)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 group ${
              isMatrixOpen || isMoreActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            {(isMatrixOpen || isMoreActive) && (
              <motion.div
                layoutId="dockActivePill"
                className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_8px_#6366f1]"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}

            <div className={`p-1.5 rounded-2xl transition-all ${
              isMatrixOpen || isMoreActive
                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30' 
                : 'bg-slate-100 dark:bg-white/10 group-hover:bg-slate-200 dark:group-hover:bg-white/15'
            }`}>
              {isMatrixOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Grid className="w-5 h-5" />
              )}
            </div>

            <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${
              isMatrixOpen || isMoreActive ? 'font-bold' : 'font-medium'
            }`}>
              Tools
            </span>
          </button>
        </nav>
      </div>

      {/* Native App-Style Matrix Drawer (Slide-up Bottom Sheet - Mobile Only) */}
      <AnimatePresence>
        {isMatrixOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMatrixOpen(false)}
              className="absolute inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-xl"
            />

            {/* App Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-lg bg-white/95 dark:bg-[#070b18]/95 border-t sm:border border-slate-200/90 dark:border-white/10 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto mb-16 sm:mb-0"
            >
              {/* Native App Drag Indicator Pill */}
              <div className="w-10 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      EXPDOC Engine Matrix
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                      9 CLIENT-SIDE ZERO-CLOUD ENGINES
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMatrixOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of All Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_TOOLS.map((tool) => {
                  const isActive = location.pathname === tool.path;
                  const Icon = tool.icon;

                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setIsMatrixOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border-indigo-500/50 dark:border-cyan-500/50 shadow-md' 
                          : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200/70 dark:border-white/5 hover:border-indigo-400/40 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          isActive 
                            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30' 
                            : 'bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-zinc-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate text-left">
                          <span className={`text-xs font-bold block truncate ${
                            isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-800 dark:text-zinc-200'
                          }`}>
                            {tool.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate block font-light">
                            {tool.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${
                        isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400 dark:text-zinc-600'
                      }`} />
                    </Link>
                  );
                })}
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Air-Gapped In-Browser Security
                </span>
                <span className="text-indigo-600 dark:text-cyan-400 font-semibold">
                  EXPEDIT // OS
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}