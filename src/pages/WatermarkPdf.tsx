import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { Download, Loader2, Droplet, Sparkles } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ProcessingState from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import { toast } from 'sonner';

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const handleFilesSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      if (selectedFiles[0].type !== 'application/pdf') {
        toast.error('Please upload a valid PDF document.');
        return;
      }
      setFile(selectedFiles[0]);
    }
  };

  const addWatermark = async (fileName: string) => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const textSize = 50;
        const textWidth = font.widthOfTextAtSize(watermarkText, textSize);

        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2 + 30,
          y: height / 2 - 30,
          size: textSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity,
          rotate: degrees(45),
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
      toast.success("Security watermark applied to all pages!");
    } catch (error) {
      console.error("Watermark error", error);
      toast.error("Failed to watermark document. Ensure PDF is not encrypted.");
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
            <span>MODULE // 06</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Watermark PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Stamp diagonal, high-contrast or subtle security markers across document pages.
          </p>
        </div>
        
        {!file ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={false} 
            onFilesSelect={handleFilesSelect} 
            title="Drop PDF to watermark"
            description="Upload document • Apply diagonal security stamp"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={file.name}
              fileSize={file.size}
              statusText="Ready to stamp"
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Watermark Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Define stamp string and transparency opacity
                  </p>
                </div>
              </div>

              {/* Watermark Text Input */}
              <div className="mb-5">
                <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                  WATERMARK STRING
                </label>
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL / DRAFT / DO NOT COPY"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold tracking-wider transition-all shadow-inner"
                />
              </div>

              {/* Opacity Slider */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300">
                    STAMP OPACITY: {Math.round(opacity * 100)}%
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    {opacity < 0.2 ? 'Faint / Subtle' : opacity > 0.5 ? 'Heavy / Opaque' : 'Balanced Transparency'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.8" 
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
                />
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
                  disabled={!watermarkText.trim() || isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Applying Watermark...' : 'Stamp & Download'}
                </button>
              </div>
            </div>
          </div>
        )}

        {file && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={addWatermark} 
            defaultFileName={`watermarked_${file.name}`} 
          />
        )}
      </div>
    </PageTransition>
  );
}