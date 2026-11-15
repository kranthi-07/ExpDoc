import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Images, 
  Type, 
  Minimize, 
  Layers, 
  Scissors, 
  Droplet, 
  SplitSquareHorizontal, 
  Hash, 
  Search,
  Globe,
  Smartphone,
  Grid,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import HapticToggle from './HapticToggle';
import ExpDocLogo from './ExpDocLogo';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

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

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Switching between Web and App OS mode
  const [viewMode, setViewMode] = useState<'web' | 'app'>(() => {
    return (localStorage.getItem('expdoc_view_mode') as 'web' | 'app') || 
           (localStorage.getItem('expedit_view_mode') as 'web' | 'app') || 'app';
  });

  const handleModeSwitch = (mode: 'web' | 'app') => {
    if (mode === viewMode) return;
    haptics.toggle();
    setViewMode(mode);
    localStorage.setItem('expdoc_view_mode', mode);
    document.documentElement.setAttribute('data-view-mode', mode);
    window.dispatchEvent(new CustomEvent('expdoc-view-mode-change', { detail: mode }));
    toast.success(mode === 'app' ? 'Switched to App OS Mode' : 'Switched to Web Classic Mode');
  };

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsToolsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when search palette opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  // Filter tools for Command Palette search
  const filteredTools = ALL_TOOLS.filter(tool => 
    tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Topbar Divided into Two Distinct Parts (Left & Right Islands) - HIDDEN ON MOBILE */}
      <header className="hidden sm:flex absolute top-2 sm:top-4 left-0 right-0 z-40 w-full max-w-6xl mx-auto px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* ========================================================= */}
          {/* LEFT PART: Logo, Mode Toggle, Search, Web/App OS Toggle   */}
          {/* ========================================================= */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 bg-white/90 dark:bg-[#070b18]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-full h-12 sm:h-14 px-2.5 sm:px-4 transition-all">
            
            {/* 1. New Logo & Name */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm sm:text-base group pr-1 sm:pr-2.5 border-r border-slate-200/80 dark:border-white/10"
              title="EXPDOC Home"
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <ExpDocLogo size={28} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="tracking-tight font-black leading-none text-slate-900 dark:text-white">EXPDOC</span>
                <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 leading-none mt-0.5">STUDIO OS</span>
              </div>
            </Link>

            {/* 2. Theme Mode & Haptics Toggles */}
            <ThemeToggle />
            <HapticToggle />

            {/* 3. Search Trigger Button */}
            <button
              onClick={() => {
                haptics.light();
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-mono transition-all active:scale-95"
              title="Search Tools & Functions (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="hidden md:inline text-[11px] font-medium">Search</span>
              <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-slate-200/70 dark:bg-white/10 text-slate-400 dark:text-zinc-400 font-mono">⌘K</kbd>
            </button>

            {/* 4. Switching Between Web and App OS Toggle */}
            <div className="flex items-center bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-full p-0.5 sm:p-1 text-[10px] sm:text-xs font-mono font-semibold">
              <button
                onClick={() => handleModeSwitch('web')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-full transition-all ${
                  viewMode === 'web'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to Web Mode"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Web</span>
              </button>
              <button
                onClick={() => handleModeSwitch('app')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-full transition-all ${
                  viewMode === 'app'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to App OS Mode"
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden sm:inline">App OS</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PART: Important Functions Only                      */}
          {/* ========================================================= */}
          <div 
            ref={dropdownRef}
            className="relative pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-white/90 dark:bg-[#070b18]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-full h-12 sm:h-14 px-2 sm:px-3 transition-all"
          >
            {/* Important Function 1: ExpDoc Studio (Featured Builder) */}
            <Link
              to="/expdoc-studio"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
                location.pathname === '/expdoc-studio'
                  ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'bg-indigo-50 dark:bg-cyan-950/40 border border-indigo-200/80 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-300 hover:bg-indigo-100/70 dark:hover:bg-cyan-900/40'
              }`}
              title="ExpDoc Studio: Word-style document & PDF creator"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span className="hidden xs:inline">ExpDoc</span>
              <span className="hidden md:inline">Studio</span>
            </Link>

            {/* Important Function 2: Compress PDF */}
            <Link
              to="/compress-pdf"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl sm:rounded-full text-xs font-medium transition-all ${
                location.pathname === '/compress-pdf'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Compress PDF"
            >
              <Minimize className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>Compress</span>
            </Link>

            {/* Important Function 3: Merge PDF */}
            <Link
              to="/merge-pdf"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl sm:rounded-full text-xs font-medium transition-all ${
                location.pathname === '/merge-pdf'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Merge PDFs"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>Merge</span>
            </Link>

            {/* Important Function 4: All Tools Matrix Dropdown Trigger */}
            <button
              onClick={() => setIsToolsDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl sm:rounded-full text-xs font-mono font-medium transition-all ${
                isToolsDropdownOpen
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="View All PDF Functions"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">All Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Glass Dropdown Menu for All PDF Functions */}
            <AnimatePresence>
              {isToolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-2.5 w-72 sm:w-80 bg-white/95 dark:bg-[#070b18]/95 backdrop-blur-3xl border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 text-left"
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase">
                      All PDF Functions ({ALL_TOOLS.length})
                    </span>
                    <button
                      onClick={() => setIsToolsDropdownOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1 max-h-[360px] overflow-y-auto pr-1">
                    {ALL_TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = location.pathname === tool.path;
                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          onClick={() => setIsToolsDropdownOpen(false)}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 font-bold'
                              : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400'}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate leading-tight">{tool.label}</p>
                              <p className="text-[10px] text-slate-400 dark:text-zinc-400 truncate leading-tight">{tool.desc}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-zinc-400 ml-2">
                            {tool.category}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* QUICK COMMAND PALETTE / SEARCH MODAL (Triggered by Search) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg bg-white dark:bg-[#070b18] border border-slate-200/90 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/10">
                <Search className="w-4 h-4 text-indigo-500 dark:text-cyan-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools or functions (e.g., word, compress, merge)..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-400 focus:outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtered Tools List */}
              <div className="p-2 max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  <div className="space-y-1">
                    {filteredTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.path}
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate(tool.path);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                {tool.label}
                              </p>
                              <p className="text-[11px] text-slate-400 dark:text-zinc-400 leading-tight">
                                {tool.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400">
                              {tool.category}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs font-mono">
                    No tools found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              {/* Search Palette Footer */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>ESC to close</span>
                <span>EXPDOC ZERO-CLOUD OS</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
