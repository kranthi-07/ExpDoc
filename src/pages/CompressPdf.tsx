import { useState, useEffect } from 'react';
import { Download, RefreshCw, Settings2, Sparkles, Zap, ArrowDown } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ProcessingState, { formatBytes } from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import { toast } from 'sonner';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [compressionPercentage, setCompressionPercentage] = useState<number>(50);

  useEffect(() => {
    return () => {
      if (compressedFileUrl) URL.revokeObjectURL(compressedFileUrl);
    };
  }, [compressedFileUrl]);

  const handleFilesSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setOriginalSize(selectedFiles[0].size);
      setCompressedFileUrl(null);
      setIsComplete(false);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('percentage', compressionPercentage.toString());

      const response = await fetch('http://localhost:3001/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Server error during compression');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setCompressedFileUrl(url);
      setCompressedSize(blob.size);
      setIsComplete(true);
      toast.success("Document compressed successfully!");
    } catch (error: any) {
      console.error("Compression error", error);
      toast.error(error.message || "Failed to compress PDF. Ensure backend server is active.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    if (compressedFileUrl) URL.revokeObjectURL(compressedFileUrl);
    setCompressedFileUrl(null);
    setIsComplete(false);
  };

  const downloadPdf = (fileName: string) => {
    if (!compressedFileUrl) return;
    const a = document.createElement('a');
    a.href = compressedFileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const percentSaved = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <PageTransition>
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>MODULE // 03</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Compress PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Downsample imagery and crush file size with precision quality parameters.
          </p>
        </div>
        
        {!file ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={false} 
            onFilesSelect={handleFilesSelect} 
            title="Drop PDF to compress"
            description="Select document • Tailor reduction ratio"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={file.name}
              fileSize={file.size}
              statusText={isComplete ? "Compression finished" : isProcessing ? "Crunching pages..." : "Parameters set"}
              isProcessing={isProcessing}
              isComplete={isComplete}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              
              {!isComplete ? (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/15 text-indigo-600 dark:text-cyan-400">
                      <Settings2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        Precision Ratio Parameters
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Adjust trade-off between visual fidelity and file compactness
                      </p>
                    </div>
                  </div>

                  {/* Percentage Slider Area */}
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300">
                        TARGET RATIO: {compressionPercentage}%
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 font-medium">
                        {compressionPercentage < 30 ? 'Maximum Shrink' : compressionPercentage > 75 ? 'Subtle Shrink' : 'Balanced Optimization'}
                      </span>
                    </div>

                    <input 
                      type="range" 
                      min="10" 
                      max="95" 
                      step="5"
                      value={compressionPercentage}
                      onChange={(e) => setCompressionPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-2">
                      <span>10% (MAX CRUNCH)</span>
                      <span>50% (BALANCED)</span>
                      <span>95% (HIGH RES)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
                    <button 
                      onClick={reset}
                      className="w-full sm:w-auto px-5 py-2.5 sm:py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm text-center"
                    >
                      Choose Different PDF
                    </button>
                    <button 
                      onClick={compressPdf}
                      disabled={isProcessing}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                    >
                      <Zap className="w-4 h-4" />
                      {isProcessing ? 'Processing Engine...' : 'Execute Compression'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Compression Telemetry */
                <div className="text-center py-2 sm:py-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <ArrowDown className="w-6 h-6 animate-pulse" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white mb-2">
                    Optimization Complete
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mb-6">
                    Reduced overall document weight by <strong className="text-emerald-500">{percentSaved}%</strong>
                  </p>

                  {/* Metrics Telemetry Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-left">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Original Weight</span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {formatBytes(originalSize)}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">Optimized Weight</span>
                      <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatBytes(compressedSize)}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Space Saved</span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {percentSaved}% Saved
                      </p>
                    </div>
                  </div>

                  {/* Download Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                    <button 
                      onClick={reset}
                      className="w-full sm:w-auto px-5 py-2.5 sm:py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Compress Another
                    </button>
                    <button 
                      onClick={() => setShowNameModal(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" />
                      Save Compressed File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {compressedFileUrl && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={downloadPdf} 
            defaultFileName={`compressed_${file?.name || 'document.pdf'}`} 
          />
        )}
      </div>
    </PageTransition>
  );
}