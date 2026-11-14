import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Images, 
  Type, 
  Minimize, 
  Layers, 
  Scissors, 
  Droplet, 
  SplitSquareHorizontal, 
  Hash, 
  Search, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers2,
  FileCheck2,
  FileText,
  AlignJustify,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ExpDocLogo from '../components/ExpDocLogo';

interface ToolItem {
  to: string;
  icon: any;
  title: string;
  description: string;
  category: 'Create' | 'Modify' | 'Security' | 'Organize';
  badge: string;
  gradient: string;
  isPopular?: boolean;
}

const APP_TOOLS: ToolItem[] = [
  {
    to: '/expdoc-studio',
    icon: FileText,
    title: 'ExpDoc Studio',
    description: 'Our proprietary Word-style rich document editor. Add text, images, tables, alignments, and compile to A4 PDF.',
    category: 'Create',
    badge: 'BY EXP STUDIO',
    gradient: 'from-indigo-600 via-violet-600 to-cyan-500',
    isPopular: true
  },
  {
    to: '/image-to-pdf',
    icon: Images,
    title: 'Images to PDF',
    description: 'Transform multiple images into a unified, high-res PDF with instant drag & drop sequence reordering.',
    category: 'Create',
    badge: 'MULTIMODAL',
    gradient: 'from-blue-500 to-indigo-600',
    isPopular: true
  },
  {
    to: '/merge-pdf',
    icon: Layers,
    title: 'Merge PDFs',
    description: 'Stitch distinct PDF volumes together with tactile drag sorting and live rendered document thumbnails.',
    category: 'Modify',
    badge: 'VISUAL DND',
    gradient: 'from-indigo-600 to-violet-600',
    isPopular: true
  },
  {
    to: '/compress-pdf',
    icon: Minimize,
    title: 'Compress PDF',
    description: 'Fine-tune document weight with custom ratio compression and automated image downsampling.',
    category: 'Modify',
    badge: 'PRECISION',
    gradient: 'from-violet-600 to-purple-600',
    isPopular: true
  },
  {
    to: '/text-to-pdf',
    icon: Type,
    title: 'Text to PDF',
    description: 'Compile raw thoughts or formatted copy into clean, multi-page vector PDF with automated line-wrapping.',
    category: 'Create',
    badge: 'INSTANT',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    to: '/extract-pages',
    icon: Scissors,
    title: 'Extract Pages',
    description: 'Surgically isolate single pages or custom ranges into a laser-focused, lightweight derivative file.',
    category: 'Modify',
    badge: 'SURGICAL',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    to: '/watermark-pdf',
    icon: Droplet,
    title: 'Watermark PDF',
    description: 'Protect sensitive papers with custom diagonal, semi-transparent security stamps across all pages.',
    category: 'Security',
    badge: 'SECURITY',
    gradient: 'from-teal-500 to-emerald-600'
  },
  {
    to: '/split-pdf',
    icon: SplitSquareHorizontal,
    title: 'Split PDF',
    description: 'Burst heavy multi-page documents into independent single-page archives bundled in a clean ZIP.',
    category: 'Organize',
    badge: 'BATCH ZIP',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    to: '/page-numbers',
    icon: Hash,
    title: 'Page Numbers',
    description: 'Apply consistent, professional numbering coordinates with tailored formatting and margin controls.',
    category: 'Organize',
    badge: 'PAGINATION',
    gradient: 'from-rose-500 to-indigo-600'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Popular', 'Create', 'Modify', 'Security', 'Organize'];

  const filteredTools = useMemo(() => {
    return APP_TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Popular') return Boolean(tool.isPopular);
      return tool.category === selectedCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <PageTransition>
      <div className="w-full max-w-5xl mx-auto pt-2 sm:pt-4 pb-24 sm:pb-16 px-1 sm:px-0">
        
        {/* App Greeting & Live Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 p-4 sm:p-6 bg-white/70 dark:bg-[#070b18]/70 border border-slate-200/90 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <ExpDocLogo size={36} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold tracking-wider text-indigo-600 dark:text-cyan-400">
                  EXPDOC OS // ACTIVE WORKSPACE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Client-Side PDF & Document Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-mono px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>AIR-GAPPED READY • ZERO SERVER STORAGE</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE ONLY: SIMPLE & SMALL EXPDOC STUDIO CARD                 */}
        {/* ============================================================== */}
        <div className="block sm:hidden mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-[#070b18] text-white shadow-lg border border-indigo-500/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 text-white shadow-md shadow-indigo-500/25 shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white truncate">ExpDoc Studio</h3>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    WORD
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200/80 truncate">
                  Word canvas & A4 PDF editor
                </p>
              </div>
            </div>

            <Link
              to="/expdoc-studio"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 transition-transform"
            >
              <span>Open</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TABLET & DESKTOP: FULL FEATURED SHOWCASE BANNER                */}
        {/* ============================================================== */}
        <div className="hidden sm:block mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-500/30 relative overflow-hidden">
          
          {/* Subtle background ambient graphic */}
          <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
            <FileText className="w-72 h-72 text-cyan-400" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                EXPDOC STUDIO // EXCLUSIVE ENGINE
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-white">
                Edit & Build on Word Canvas
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 font-light leading-relaxed mb-4">
                Our proprietary desktop word processor. Compose rich documents, insert graphics, copy & paste with automatic alignment preservation, fine-tune typography (Fonts, Sizes, Colors, Headings, Full Justify), and publish directly to A4 PDF or Word (.doc).
              </p>

              {/* Word Features Badge Row */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-cyan-200">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1">
                  <AlignJustify className="w-3 h-3 text-cyan-300" />
                  Full Justify Alignment
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-cyan-300" />
                  Image Insert & Paste
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-cyan-300" />
                  Colors & Fonts
                </span>
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Link
                to="/expdoc-studio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-sm tracking-tight shadow-xl shadow-cyan-500/25 transition-all active:scale-95"
              >
                <span>Launch ExpDoc Studio</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <span className="text-[10px] font-mono text-indigo-300 text-center">
                DESKTOP-OPTIMIZED A4 CANVAS
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Search Bar (Native App Style) */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. expdoc, merge, compress, watermark, split, images)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/80 dark:bg-[#070b18]/80 border border-slate-200/90 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-xl transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-white px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Category Filter Chips (Horizontal Swipeable Bar) */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 mb-6 -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 border ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/25' 
                    : 'bg-white/80 dark:bg-[#070b18]/60 text-slate-600 dark:text-zinc-400 border-slate-200/80 dark:border-white/10 hover:border-indigo-400 dark:hover:border-white/20'
                }`}
              >
                {cat === 'Popular' ? '⚡ ' + cat : cat}
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {selectedCategory} Utilities ({filteredTools.length})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
            TAP CARD TO LAUNCH
          </span>
        </div>

        {/* All Tools Grid (Native App Tiles) */}
        {filteredTools.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-white/60 dark:bg-[#070b18]/60 border border-slate-200/90 dark:border-white/10">
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
              No tools matching "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs font-mono text-indigo-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#070b18]/70 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-sm hover:border-indigo-500/50 dark:hover:border-cyan-400/50 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] transition-all duration-200 active:scale-[0.98]"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                        {tool.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Bottom micro-row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    <span>{tool.category.toUpperCase()}</span>
                    <span className="text-indigo-600 dark:text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      OPEN <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* System Capabilities Bar (Mobile App Footer Specs) */}
        <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-white/60 dark:bg-[#070b18]/60 border border-slate-200/80 dark:border-white/5 backdrop-blur-xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>0 LATENCY WASM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>LOCAL DEVICE SILICON</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
            <span>PWA OFFLINE CAPABLE</span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}