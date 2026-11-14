import { CheckCircle2, FileIcon, Loader2, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  fileName: string;
  fileSize?: number;
  statusText: string;
  isProcessing: boolean;
  isComplete: boolean;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ProcessingState({ 
  fileName, 
  fileSize, 
  statusText, 
  isProcessing, 
  isComplete 
}: ProcessingStateProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white/80 dark:bg-[#070b18]/80 border border-slate-200/90 dark:border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-sm dark:shadow-none transition-all duration-300">
      
      {/* File Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-white/10 shrink-0">
          <FileIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0 truncate">
          <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-zinc-100 truncate">
            {fileName}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 mt-0.5">
            {fileSize && <span>{formatBytes(fileSize)}</span>}
            {fileSize && <span>•</span>}
            <span className="text-cyan-600 dark:text-cyan-400">IN-MEMORY</span>
          </div>
        </div>
      </div>
      
      {/* Status Pill */}
      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium shrink-0">
        {isProcessing && <Loader2 className="w-4 h-4 text-indigo-500 dark:text-cyan-400 animate-spin" />}
        {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {!isProcessing && !isComplete && <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
        
        <span className={`${
          isComplete 
            ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
            : isProcessing 
              ? 'text-indigo-600 dark:text-cyan-400 font-semibold' 
              : 'text-slate-700 dark:text-zinc-300'
        }`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}