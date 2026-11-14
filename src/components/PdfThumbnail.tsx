import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point to the worker bundled locally or via CDN. For Vite, using a CDN is easiest to avoid worker bundling issues.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

interface PdfThumbnailProps {
  file: File;
  className?: string;
}

export default function PdfThumbnail({ file, className = '' }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let renderTask: any = null;
    let isActive = true;

    const renderPage = async () => {
      try {
        const fileUrl = URL.createObjectURL(file);
        const loadingTask = pdfjsLib.getDocument({ url: fileUrl });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isActive || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Scale down for thumbnail
        const scale = 200 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        renderTask = page.render(renderContext as any);
        await renderTask.promise;
        URL.revokeObjectURL(fileUrl);
      } catch (err) {
        console.error('Error rendering PDF thumbnail:', err);
        if (isActive) setError(true);
      }
    };

    renderPage();

    return () => {
      isActive = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [file]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/50 ${className}`}>
        <span className="text-4xl">📄</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/50 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
