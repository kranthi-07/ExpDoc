import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Download, Loader2, SplitSquareHorizontal, Sparkles } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ProcessingState from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import { toast } from 'sonner';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
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

  const splitPdf = async (zipFileName: string) => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBytes);
      const totalPages = srcDoc.getPageCount();

      const zip = new JSZip();
      const baseName = file.name.replace(/\.[^/.]+$/, "");

      for (let i = 0; i < totalPages; i++) {
        const subDoc = await PDFDocument.create();
        const [copiedPage] = await subDoc.copyPages(srcDoc, [i]);
        subDoc.addPage(copiedPage);
        const subDocBytes = await subDoc.save();
        zip.file(`${baseName}_page_${i + 1}.pdf`, subDocBytes);
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipContent);

      const actualZipName = zipFileName.endsWith('.zip') 
        ? zipFileName 
        : zipFileName.replace(/\.pdf$/i, '') + '.zip';

      const a = document.createElement('a');
      a.href = url;
      a.download = actualZipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Split ${totalPages} pages into archive!`);
    } catch (error) {
      console.error("Split error", error);
      toast.error("Failed to split PDF.");
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
            <span>MODULE // 07</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Split PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Burst multi-page documents into standalone single-page PDFs packaged inside a ZIP file.
          </p>
        </div>
        
        {!file ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={false} 
            onFilesSelect={handleFilesSelect} 
            title="Drop PDF to split"
            description="Decompose pages into individual PDF archive"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={file.name}
              fileSize={file.size}
              statusText={`${pageCount} pages detected`}
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                  <SplitSquareHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Batch Burst Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Each page extracted as an isolated PDF and bundled into a lossless ZIP
                  </p>
                </div>
              </div>

              {/* Telemetry Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 mb-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-zinc-400">TARGET OUTPUT ARCHIVE:</span>
                  <span className="text-indigo-600 dark:text-cyan-400 font-bold">{pageCount} DISTINCT FILES</span>
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
                  disabled={isProcessing || pageCount === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Bursting Document...' : 'Split & Download ZIP'}
                </button>
              </div>
            </div>
          </div>
        )}

        {file && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={splitPdf} 
            defaultFileName={`${file.name.replace(/\.[^/.]+$/, "")}_pages.zip`} 
          />
        )}
      </div>
    </PageTransition>
  );
}