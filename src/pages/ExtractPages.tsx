import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Loader2, Sparkles, Scissors } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ProcessingState from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import { toast } from 'sonner';

export default function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const handleFilesSelect = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setPageCount(pdf.getPageCount());
      } catch (err) {
        console.error("Failed to load PDF info", err);
        toast.error("Could not read PDF. It may be encrypted or corrupted.");
      }
    }
  };

  const parsePageRange = (rangeStr: string, total: number): number[] => {
    const indices: Set<number> = new Set();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= total) indices.add(i - 1);
          }
        }
      } else {
        const page = parseInt(trimmed, 10);
        if (!isNaN(page) && page >= 1 && page <= total) {
          indices.add(page - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const extractPages = async (fileName: string) => {
    if (!file || !pageRange.trim()) return;
    setIsProcessing(true);

    try {
      const pagesToExtract = parsePageRange(pageRange, pageCount);
      if (pagesToExtract.length === 0) {
        toast.error("No valid page numbers found. Ensure range matches document size.");
        setIsProcessing(false);
        return;
      }

      const fileBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBytes);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract);
      copiedPages.forEach(p => newDoc.addPage(p));

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([newPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Designated pages extracted into new document!");
    } catch (error) {
      console.error("Extraction error", error);
      toast.error("Failed to extract pages from PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>MODULE // 05</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Extract Pages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Surgically isolate single pages or custom ranges into a lightweight standalone file.
          </p>
        </div>
        
        {!file ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={false} 
            onFilesSelect={handleFilesSelect} 
            title="Drop PDF to extract pages"
            description="Select document • Extract designated sub-ranges"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={file.name}
              fileSize={file.size}
              statusText={`${pageCount} pages available`}
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Range Coordinates
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Input discrete indices or hyphenated intervals (Total: {pageCount} pages)
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <input 
                  type="text" 
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder={`e.g. 1-3, 5, 8-${Math.min(pageCount, 10)}`}
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm font-mono transition-all shadow-inner"
                />
                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-2 block">
                  SYNTAX GUIDE: Separate individual pages with commas ("1, 4, 7") or intervals with dashes ("2-5").
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
                <button 
                  onClick={() => setFile(null)}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm text-center"
                >
                  Choose Different File
                </button>
                <button 
                  onClick={() => setShowNameModal(true)}
                  disabled={!pageRange.trim() || isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Extracting Pages...' : 'Extract & Download'}
                </button>
              </div>
            </div>
          </div>
        )}

        {file && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={extractPages} 
            defaultFileName={`extracted_${file.name}`} 
          />
        )}
      </div>
    </PageTransition>
  );
}