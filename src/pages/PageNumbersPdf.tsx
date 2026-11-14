import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Download, Loader2, Settings2, Sparkles } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ProcessingState from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import { toast } from 'sonner';

export default function PageNumbersPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right'>('bottom-center');
  const [format, setFormat] = useState<'simple' | 'total'>('total');

  const handleFilesSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      if (selectedFiles[0].type !== 'application/pdf') {
        toast.error('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFiles[0]);
    }
  };

  const addPageNumbers = async (fileName: string) => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pages.length;
      
      pages.forEach((page, idx) => {
        const { width } = page.getSize();
        const text = format === 'total' ? `Page ${idx + 1} of ${totalPages}` : `${idx + 1}`;
        const textSize = 11;
        const textWidth = font.widthOfTextAtSize(text, textSize);
        
        let x = width / 2 - textWidth / 2; // bottom-center
        if (position === 'bottom-right') {
          x = width - textWidth - 30; // 30px margin from right
        }

        page.drawText(text, {
          x,
          y: 28, // 28px margin from bottom
          size: textSize,
          font,
          color: rgb(0.25, 0.25, 0.25),
        });
      });

      const processedBytes = await pdfDoc.save();
      const blob = new Blob([processedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Page numbers stamped successfully!");
    } catch (error) {
      console.error("Page numbers error", error);
      toast.error("Failed to add page numbers. Ensure the PDF is not encrypted.");
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
            <span>MODULE // 08</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Add Page Numbers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Automate pagination indexing across all document sheets with precision positioning.
          </p>
        </div>
        
        {!file ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={false} 
            onFilesSelect={handleFilesSelect} 
            title="Drop PDF to add numbers"
            description="Select document • Stamp automated pagination"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={file.name}
              fileSize={file.size}
              statusText="Ready to paginate"
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Pagination Geometry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Configure coordinate placement and numbering format
                  </p>
                </div>
              </div>
              
              {/* Responsive Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    PLACEMENT ANCHOR
                  </label>
                  <select 
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all shadow-inner"
                  >
                    <option value="bottom-center">Bottom Center (Classic)</option>
                    <option value="bottom-right">Bottom Right (Editorial)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    NOTATION SYNTAX
                  </label>
                  <select 
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all shadow-inner"
                  >
                    <option value="total">Full Scope: "Page 1 of 12"</option>
                    <option value="simple">Minimal Index: "1, 2, 3..."</option>
                  </select>
                </div>
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
                  disabled={isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Stamping Numbers...' : 'Apply & Download'}
                </button>
              </div>
            </div>
          </div>
        )}

        {file && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={addPageNumbers} 
            defaultFileName={`numbered_${file.name}`} 
          />
        )}
      </div>
    </PageTransition>
  );
}