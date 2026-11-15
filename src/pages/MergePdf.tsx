import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Loader2, X, Plus, Sparkles, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import Dropzone from '../components/Dropzone';
import ProcessingState from '../components/ProcessingState';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import ConfirmModal from '../components/ConfirmModal';
import { SortableItem } from '../components/SortableItem';
import PdfThumbnail from '../components/PdfThumbnail';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';

interface PdfItem {
  id: string;
  file: File;
}

export default function MergePdf() {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFilesSelect = (selectedFiles: File[]) => {
    const newItems = selectedFiles
      .filter(file => {
        if (file.type !== 'application/pdf') {
          toast.error(`File ${file.name} is not a PDF.`);
          return false;
        }
        return true;
      })
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file
      }));
    setPdfs(prev => [...prev, ...newItems]);
  };

  const removePdf = (idToRemove: string) => {
    haptics.warning();
    setPdfs(prev => prev.filter(p => p.id !== idToRemove));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    haptics.drag();
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPdfs((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const mergePdfs = async (fileName: string) => {
    if (pdfs.length < 2) {
      haptics.error();
      toast.error("Please upload at least 2 PDFs to merge.");
      return;
    }
    haptics.heavy();
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfItem of pdfs) {
        const pdfBytes = await pdfItem.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      haptics.success();
      toast.success("PDFs stitched into unified document!");
    } catch (error) {
      console.error("Merge error", error);
      haptics.error();
      toast.error("Failed to merge PDFs. Ensure none are encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>MODULE // 04</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Merge PDFs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Fuse distinct PDF documents into a unified output. Reorder with tactile drag and drop.
          </p>
        </div>
        
        {pdfs.length === 0 ? (
          <Dropzone 
            accept="application/pdf" 
            multiple={true} 
            onFilesSelect={handleFilesSelect} 
            title="Drop multiple PDFs here"
            description="Upload 2 or more files • Live visual previews"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={`${pdfs.length} documents queued`}
              fileSize={pdfs.reduce((acc, p) => acc + p.file.size, 0)}
              statusText={pdfs.length >= 2 ? "Ready to merge" : "Add 1 more PDF"}
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/10">
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                  ORDERING STACK ({pdfs.length} FILES)
                </span>
                <span className="text-[11px] font-mono text-indigo-500 dark:text-cyan-400">
                  DRAG CARDS TO SORT
                </span>
              </div>

              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={() => haptics.drag()}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={pdfs.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {pdfs.map((pdf, index) => (
                      <SortableItem key={pdf.id} id={pdf.id}>
                        <div className="group relative aspect-[3/4] bg-slate-100 dark:bg-[#0a0f20] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm transition-all hover:shadow-lg hover:border-indigo-500/50 cursor-grab active:cursor-grabbing flex flex-col">
                          
                          {/* Live Rendered Thumbnail */}
                          <div className="flex-grow flex items-center justify-center bg-slate-100 dark:bg-black/40 m-2 rounded-xl overflow-hidden border border-slate-200/50 dark:border-white/5">
                            <PdfThumbnail file={pdf.file} className="w-full h-full" />
                          </div>

                          {/* File Name Footer */}
                          <div className="h-9 px-2.5 flex items-center justify-center bg-slate-200/70 dark:bg-black/50 border-t border-slate-200 dark:border-white/10">
                            <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300 truncate w-full text-center">
                              {pdf.file.name}
                            </span>
                          </div>

                          {/* Hover Remove Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 pointer-events-none">
                            <button 
                              onClick={(e) => { e.stopPropagation(); removePdf(pdf.id); }}
                              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl backdrop-blur-sm transition-colors pointer-events-auto shadow-md"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Order Index Badge */}
                          <div className="absolute top-2 left-2 bg-gradient-to-br from-indigo-600 to-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shadow-md shadow-indigo-500/30 pointer-events-none">
                            {index + 1}
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                    
                    {/* Add More Tile */}
                    <label 
                      onClick={() => haptics.selection()}
                      className="aspect-[3/4] border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-indigo-500 dark:hover:border-cyan-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Add PDF</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">.PDF</span>
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFilesSelect(Array.from(e.target.files));
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                </SortableContext>
              </DndContext>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
                <button 
                  onClick={() => {
                    haptics.warning();
                    setShowClearConfirm(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 text-slate-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
                <button 
                  onClick={() => {
                    haptics.medium();
                    setShowNameModal(true);
                  }}
                  disabled={isProcessing || pdfs.length < 2}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Merging Documents...' : 'Merge & Download'}
                </button>
              </div>
            </div>
          </div>
        )}

        {pdfs.length >= 2 && (
          <DownloadModal 
            isOpen={showNameModal} 
            onClose={() => setShowNameModal(false)} 
            onConfirm={mergePdfs} 
            defaultFileName="merged-document.pdf" 
          />
        )}

        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => {
            setPdfs([]);
            toast.success("PDF document stack cleared.");
          }}
          title="Clear all selected PDFs?"
          message={`This will remove all ${pdfs.length} PDF files from the merge queue.`}
          confirmText="Yes, Clear All"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </PageTransition>
  );
}