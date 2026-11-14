import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Download, Loader2, Sparkles, Trash2, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import BuildingPdfModal from '../components/BuildingPdfModal';
import { toast } from 'sonner';

export default function TextToPdf() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [pendingFileName, setPendingFileName] = useState('');

  const generatePdf = async (fileName: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = font.heightAtSize(fontSize) + 6;
      
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const maxWidth = width - margin * 2;
      let y = height - margin;

      const paragraphs = text.split('\n');
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim() === '') {
          y -= lineHeight;
          if (y < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
          }
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
            currentLine = word;

            if (y < margin) {
              page = pdfDoc.addPage();
              y = height - margin;
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          if (y < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Text document compiled into PDF!");
    } catch (error) {
      console.error("Text to PDF error", error);
      toast.error("Failed to compile PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <PageTransition>
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>MODULE // 02</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Text to PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Compose or paste raw text to produce a structured, multi-page vector PDF.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#070b18]/80 p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
          
          {/* Top Bar with Telemetry */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300">
                SOURCE BUFFER
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-zinc-400">
              <span>{wordCount} WORDS</span>
              <span>•</span>
              <span>{charCount} CHARS</span>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your content here... Dynamic page pagination and line-wrapping are calculated automatically."
            className="w-full h-64 sm:h-96 p-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 resize-none font-sans text-sm sm:text-base leading-relaxed transition-all shadow-inner"
          />

          {/* Action Row */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              Clear Editor
            </button>

            <button
              onClick={() => setShowNameModal(true)}
              disabled={!text.trim() || isProcessing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isProcessing ? 'Generating PDF...' : 'Compile Document'}
            </button>
          </div>
        </div>

        <DownloadModal 
          isOpen={showNameModal} 
          onClose={() => setShowNameModal(false)} 
          onConfirm={(name) => {
            setShowNameModal(false);
            setPendingFileName(name);
            setIsBuildingPdf(true);
          }} 
          defaultFileName="compiled-text.pdf" 
        />

        <BuildingPdfModal
          isOpen={isBuildingPdf}
          fileName={pendingFileName || 'compiled-text.pdf'}
          pageCount={Math.max(1, Math.ceil(text.length / 2000))}
          onComplete={() => {
            setIsBuildingPdf(false);
            generatePdf(pendingFileName || 'compiled-text.pdf');
          }}
        />
      </div>
    </PageTransition>
  );
}