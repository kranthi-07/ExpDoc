import { useState, useEffect } from 'react';
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
import BuildingPdfModal from '../components/BuildingPdfModal';
import { SortableItem } from '../components/SortableItem';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [pendingFileName, setPendingFileName] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handleFilesSelect = (selectedFiles: File[]) => {
    const newItems = selectedFiles
      .filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image.`);
          return false;
        }
        return true;
      })
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file)
      }));
    setImages(prev => [...prev, ...newItems]);
  };

  const removeImage = (idToRemove: string) => {
    haptics.warning();
    setImages(prev => {
      const item = prev.find(i => i.id === idToRemove);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== idToRemove);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    haptics.drag();
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generatePdf = async (fileName: string) => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      for (const imgItem of images) {
        const imageBytes = await imgItem.file.arrayBuffer();
        let pdfImage;
        if (imgItem.file.type === 'image/jpeg' || imgItem.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imgItem.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          toast.error(`File ${imgItem.file.name} is not a JPG or PNG. Skipping.`);
          continue;
        }

        const { width, height } = pdfImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pdfImage, { x: 0, y: 0, width, height });
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
      haptics.success();
      toast.success("PDF compiled successfully!");
    } catch (error) {
      console.error("PDF generation error", error);
      haptics.error();
      toast.error("Failed to generate PDF. Please ensure all files are valid images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header with Futuristic Badge */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>MODULE // 01</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Images to PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Convert image sets into a high-fidelity document. Drag items to reorder pages.
          </p>
        </div>
        
        {images.length === 0 ? (
          <Dropzone 
            accept="image/*" 
            multiple={true} 
            onFilesSelect={handleFilesSelect} 
            title="Drop images here"
            description="Supports PNG, JPG, JPEG • Drag to sequence"
          />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <ProcessingState 
              fileName={`${images.length} images queued`}
              fileSize={images.reduce((acc, img) => acc + img.file.size, 0)}
              statusText="Ready to compile"
              isProcessing={false}
              isComplete={false}
            />

            <div className="bg-white/80 dark:bg-[#070b18]/80 p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl backdrop-blur-2xl transition-all duration-300">
              
              {/* Header inside container */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/10">
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                  SEQUENCE MATRIX ({images.length} PAGES)
                </span>
                <span className="text-[11px] font-mono text-indigo-500 dark:text-cyan-400">
                  DRAG & DROP TO REORDER
                </span>
              </div>

              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={() => haptics.drag()}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {images.map((img, index) => (
                      <SortableItem key={img.id} id={img.id}>
                        <div className="group relative aspect-[3/4] bg-slate-100 dark:bg-[#0a0f20] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm transition-all hover:shadow-lg hover:border-indigo-500/50 cursor-grab active:cursor-grabbing">
                          <img 
                            src={img.previewUrl} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none">
                            <div className="flex justify-end">
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-sm transition-colors pointer-events-auto shadow-md"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-white text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm truncate text-center">
                              {img.file.name}
                            </span>
                          </div>

                          {/* Index Badge */}
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
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Add More</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">JPG / PNG</span>
                      <input 
                        type="file" 
                        accept="image/*" 
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

              {/* Ultra-Responsive Mobile/Tablet Action Bar */}
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
                    haptics.heavy();
                    setShowNameModal(true);
                  }}
                  disabled={isProcessing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isProcessing ? 'Compiling PDF...' : 'Compile & Download PDF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <>
            <DownloadModal 
              isOpen={showNameModal} 
              onClose={() => setShowNameModal(false)} 
              onConfirm={(name) => {
                setShowNameModal(false);
                setPendingFileName(name);
                setIsBuildingPdf(true);
              }} 
              defaultFileName="merged-images.pdf" 
            />

            <BuildingPdfModal
              isOpen={isBuildingPdf}
              fileName={pendingFileName || 'merged-images.pdf'}
              pageCount={images.length}
              onComplete={() => {
                setIsBuildingPdf(false);
                generatePdf(pendingFileName || 'merged-images.pdf');
              }}
            />
          </>
        )}

        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => {
            setImages([]);
            toast.success("Image queue cleared.");
          }}
          title="Clear all selected images?"
          message={`This will remove all ${images.length} images currently queued for conversion.`}
          confirmText="Yes, Clear All"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </PageTransition>
  );
}