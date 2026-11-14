import { useRef, useState } from 'react';
import { UploadCloud, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
  accept: string;
  multiple: boolean;
  title?: string;
  description?: string;
}

export default function Dropzone({ 
  onFilesSelect, 
  accept, 
  multiple, 
  title = "Drop files here", 
  description = "Select files from your device" 
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (accept.includes('image/*')) return file.type.startsWith('image/');
      if (accept.includes('pdf')) return file.type === 'application/pdf';
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return accept.includes(file.type) || accept.includes(extension);
    });

    if (validFiles.length > 0) {
      onFilesSelect(multiple ? validFiles : [validFiles[0]]);
    } else {
      toast.error('Unsupported file format. Please select valid documents.');
    }
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`group relative flex flex-col items-center justify-center p-6 sm:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 shadow-[0_0_35px_rgba(99,102,241,0.25)] scale-[1.01]' 
          : 'border-slate-300 dark:border-white/15 bg-white/70 dark:bg-[#070b18]/50 backdrop-blur-xl hover:border-indigo-500/60 dark:hover:border-cyan-400/50 hover:bg-slate-50/80 dark:hover:bg-white/[0.04] shadow-sm hover:shadow-xl dark:shadow-none'
      }`}
    >
      {/* Background ambient radial highlight */}
      <div className="absolute inset-0 bg-radial from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      {/* Floating Animated Icon Badge */}
      <div className={`relative p-3.5 sm:p-4 rounded-2xl mb-3 sm:mb-4 transition-all duration-300 ${
        isDragging 
          ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 scale-110' 
          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-cyan-400 group-hover:scale-105 group-hover:bg-indigo-50 dark:group-hover:bg-white/15 group-hover:text-indigo-600'
      }`}>
        {isDragging ? (
          <FileUp className="w-7 h-7 sm:w-9 sm:h-9 animate-bounce" />
        ) : (
          <UploadCloud className="w-7 h-7 sm:w-9 sm:h-9" />
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 text-center tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 text-center max-w-sm mb-4 font-light">
        {description}
      </p>

      {/* Futuristic Device Prompt Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>TAP TO BROWSE OR DRAG & DROP</span>
      </div>
    </div>
  );
}