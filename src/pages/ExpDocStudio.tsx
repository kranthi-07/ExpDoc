import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Table, 
  Download, 
  Undo2, 
  Redo2, 
  Sparkles, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  FileDown, 
  ZoomIn, 
  ZoomOut,
  Palette,
  Highlighter,
  Minus,
  Link as LinkIcon,
  X,
  Plus,
  Scissors,
  FilePlus2,
  Layers,
  Eraser,
  Subscript,
  Superscript,
  Quote,
  Code,
  Indent,
  Outdent,
  Calendar,
  Replace,
  Stamp,
  Copy,
  ClipboardPaste,
  Type,
  FileText
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import DownloadModal from '../components/DownloadModal';
import ConfirmModal from '../components/ConfirmModal';
import BuildingPdfModal from '../components/BuildingPdfModal';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

// Curated font families
const FONT_FAMILIES = [
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Courier', value: '"Courier New", Courier, monospace' },
  { label: 'Trebuchet', value: '"Trebuchet MS", sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

// Clean concise font sizes
const FONT_SIZES = [
  { label: '10pt', value: '13px' },
  { label: '11pt', value: '15px' },
  { label: '12pt', value: '16px' },
  { label: '14pt', value: '18px' },
  { label: '16pt', value: '21px' },
  { label: '18pt', value: '24px' },
  { label: '24pt', value: '32px' },
  { label: '32pt', value: '42px' },
  { label: '44pt', value: '58px' },
];

// Document templates
const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Document',
    pages: ['<p><br></p>']
  },
  {
    id: 'executive_memo',
    name: 'Executive Memo',
    pages: [
      `
      <h1 style="text-align: center; color: #1e1b4b; margin-bottom: 4px;">EXECUTIVE MEMORANDUM</h1>
      <p style="text-align: center; color: #6b7280; font-size: 13px; margin-bottom: 24px;">CONFIDENTIAL // EXP STUDIO INTERNAL</p>
      <hr style="border: none; border-top: 2px solid #4f46e5; margin-bottom: 24px;">
      <p><strong>DATE:</strong> November 14, 2026</p>
      <p><strong>TO:</strong> Department Directors & Project Leads</p>
      <p><strong>FROM:</strong> Architecture & Engineering Directorate</p>
      <p><strong>SUBJECT:</strong> Q4 Operational Delivery & Client Silicon Security</p>
      <br>
      <h2>1. Strategic Overview</h2>
      <p style="text-align: justify; text-justify: inter-word;">ExpDoc Studio has deployed zero-cloud, client-side document processing across all client workspaces. High-fidelity typography, automated line-wrapping, and multi-page vector exports execute with near-zero latency.</p>
      <br>
      <h2>2. Operational Directives</h2>
      <ul>
        <li>Ensure all local documents are reviewed prior to digital publishing.</li>
        <li>Utilize integrated justify alignment to maintain uniform editorial margins.</li>
        <li>Export approved versions to standardized A4 PDF format.</li>
      </ul>
      `
    ]
  },
  {
    id: 'formal_proposal',
    name: 'Project Proposal',
    pages: [
      `
      <h1 style="color: #0f172a; margin-bottom: 6px;">PROJECT EXPEDIT: PROPOSAL</h1>
      <p style="color: #4f46e5; font-weight: bold; font-size: 15px; margin-bottom: 20px;">Private In-Browser Document Management Suite</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">
      <h2>Executive Summary</h2>
      <p style="text-align: justify; text-justify: inter-word;">This document specifies the technical and design benchmarks for ExpDoc Studio. The architecture guarantees zero cloud transmission while delivering desktop-grade word processing, rich formatting, image embedding, and automated A4 PDF synthesis.</p>
      <br>
      <h2>Deliverables Matrix</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Phase</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Deliverable</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Security Level</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Phase 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Word-Style Visual Canvas</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px; color: #16a34a; font-weight: bold;">Air-Gapped</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Phase 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Vector A4 PDF Compiler</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px; color: #16a34a; font-weight: bold;">Zero-Cloud</td>
          </tr>
        </tbody>
      </table>
      `
    ]
  }
];

export default function ExpDocStudio() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Multi-page document state
  const [pages, setPages] = useState<string[]>([TEMPLATES[1].pages[0]]);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePageRef = useRef<number>(0);

  const [docTitle, setDocTitle] = useState('Executive Memorandum');
  const [currentFont, setCurrentFont] = useState('Calibri, sans-serif');
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [currentAlignment, setCurrentAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Custom Popups / Modals State
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);
  const [pendingPdfFileName, setPendingPdfFileName] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [confirmTemplateOpen, setConfirmTemplateOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Document History Stack for Undo/Redo & Selected Page
  const [history, setHistory] = useState<string[][]>([[TEMPLATES[1].pages[0]]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  
  // Categorized Ribbon Tabs State (Home, Edit, Insert, Page)
  type RibbonCategory = 'home' | 'edit' | 'insert' | 'page';
  const [activeRibbonTab, setActiveRibbonTab] = useState<RibbonCategory>('home');

  // Advanced Features State
  const [isScrolled, setIsScrolled] = useState(false);
  const [lineSpacing, setLineSpacing] = useState('1.7');
  const [watermark, setWatermark] = useState<'NONE' | 'DRAFT' | 'CONFIDENTIAL'>('NONE');
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // Scroll listener for sticky editing ribbon on top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 75);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Metrics
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Initialize pageRefs array
  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, pages.length);
  }, [pages]);

  // Initial content setup
  useEffect(() => {
    if (pageRefs.current[0] && !pageRefs.current[0].innerHTML.trim()) {
      pageRefs.current[0].innerHTML = pages[0];
      updateMetrics();
    }
  }, []);

  // Sync internal HTML changes from pageRefs to state when metrics update
  const syncPageContents = useCallback(() => {
    const updated = pageRefs.current.map(ref => ref?.innerHTML || '<p><br></p>');
    setPages(updated);
  }, []);

  // Update telemetry metrics across all pages
  const updateMetrics = useCallback(() => {
    let totalText = '';
    pageRefs.current.forEach(ref => {
      if (ref) totalText += ' ' + (ref.innerText || '');
    });
    const words = totalText.trim() ? totalText.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(totalText.length);
  }, []);

  // Listen to browser fullscreenchange to keep UI in sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle true browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Execute formatting commands
  const formatDoc = (command: string, value: string | undefined = undefined) => {
    haptics.light();
    document.execCommand(command, false, value);
    const activeEl = pageRefs.current[activePageRef.current];
    if (activeEl) {
      activeEl.focus();
    }
    updateMetrics();
  };

  // Rock-solid Alignment handler (Left, Center, Right, Justify)
  const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    haptics.light();
    setCurrentAlignment(align);
    
    // 1. Native execCommand
    if (align === 'left') formatDoc('justifyLeft');
    else if (align === 'center') formatDoc('justifyCenter');
    else if (align === 'right') formatDoc('justifyRight');
    else if (align === 'justify') formatDoc('justifyFull');

    // 2. Direct block inline style reinforcement to guarantee MS Word-level justify
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.anchorNode;
      const activeEl = pageRefs.current[activePageRef.current];
      while (node && node !== activeEl) {
        if (node instanceof HTMLElement && ['P', 'DIV', 'H1', 'H2', 'H3', 'LI', 'TD'].includes(node.tagName)) {
          node.style.textAlign = align;
          if (align === 'justify') {
            node.style.textJustify = 'inter-word';
          }
          break;
        }
        node = node.parentNode;
      }
    }
  };

  // Font family change
  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    formatDoc('fontName', font);
  };

  // Font size change
  const handleFontSizeChange = (size: string) => {
    setCurrentFontSize(size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        range.surroundContents(span);
      }
    }
    const activeEl = pageRefs.current[activePageRef.current];
    if (activeEl) activeEl.focus();
  };

  // Headings & Hierarchy format
  const handleBlockFormat = (format: string) => {
    formatDoc('formatBlock', format);
  };

  // Line spacing handler
  const handleLineSpacingChange = (spacing: string) => {
    setLineSpacing(spacing);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.anchorNode;
      const activeEl = pageRefs.current[activePageRef.current];
      while (node && node !== activeEl) {
        if (node instanceof HTMLElement && ['P', 'DIV', 'H1', 'H2', 'H3', 'LI', 'BLOCKQUOTE'].includes(node.tagName)) {
          node.style.lineHeight = spacing;
          break;
        }
        node = node.parentNode;
      }
    }
    toast.success(`Line spacing set to ${spacing}`);
  };

  // Insert Callout Blockquote
  const insertBlockquote = () => {
    const quoteHtml = `
      <blockquote style="border-left: 4px solid #6366f1; padding: 10px 16px; margin: 16px 0; background-color: #f8fafc; font-style: italic; color: #475569; border-radius: 0 8px 8px 0;">
        "Add key quote, directive, or executive takeaway here..."
      </blockquote>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, quoteHtml);
    updateMetrics();
    toast.success('Callout box inserted!');
  };

  // Insert Code Snippet
  const insertCodeBlock = () => {
    const codeHtml = `
      <pre style="background-color: #0f172a; color: #38bdf8; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; margin: 16px 0; overflow-x: auto;"><code>// Enter code or technical command...</code></pre>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, codeHtml);
    updateMetrics();
    toast.success('Code block inserted!');
  };

  // Insert Date Stamp
  const insertDateStamp = () => {
    const now = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    document.execCommand('insertHTML', false, `<strong>${now}</strong> `);
    updateMetrics();
    toast.success('Date stamp inserted!');
  };

  // Execute Find & Replace across all pages
  const handleFindAndReplace = () => {
    if (!findText.trim()) {
      toast.error('Please enter text to find.');
      return;
    }
    let replacedCount = 0;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');

    const updated = pages.map((pageHtml, idx) => {
      const el = pageRefs.current[idx];
      const source = el ? el.innerHTML : pageHtml;
      const matches = source.match(regex);
      if (matches) {
        replacedCount += matches.length;
        const res = source.replace(regex, replaceText);
        if (el) el.innerHTML = res;
        return res;
      }
      return source;
    });

    setPages(updated);
    updateMetrics();
    if (replacedCount > 0) {
      toast.success(`Successfully replaced ${replacedCount} occurrence(s)!`);
      setFindReplaceOpen(false);
    } else {
      toast.info(`"${findText}" not found in document.`);
    }
  };

  // =========================================================
  // AUTOMATED MULTI-PAGE & IMAGE PASTE PROCESSING ENGINE
  // =========================================================

  // Max usable content height for an A4 page sheet before overflowing to next page
  const A4_MAX_CONTENT_HEIGHT = 860;

  // Read file as base64 helper
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Accurately measure block rendered height off-screen
  const measureHtmlBlock = (htmlSnippet: string, width = 688): number => {
    const tester = document.createElement('div');
    tester.style.width = `${width}px`;
    tester.style.position = 'absolute';
    tester.style.visibility = 'hidden';
    tester.style.top = '-99999px';
    tester.style.left = '-99999px';
    tester.style.fontFamily = currentFont;
    tester.style.fontSize = currentFontSize;
    tester.style.lineHeight = '1.7';
    tester.className = 'prose prose-slate max-w-none';
    tester.innerHTML = htmlSnippet;

    // Account for images inside tester that haven't rendered dimensions yet
    const imgs = tester.querySelectorAll('img');
    imgs.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        img.style.height = '320px'; // Safe realistic default height for unrendered image
      }
    });

    document.body.appendChild(tester);
    const measured = tester.getBoundingClientRect().height || tester.offsetHeight || 35;
    document.body.removeChild(tester);
    return measured;
  };

  // Format and sanitize rich HTML, normalizing all images and styles
  const parseBlocksFromHtml = (rawHtml: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Format all images inside HTML to guarantee responsive, centered, aesthetic display
    const allImages = doc.querySelectorAll('img');
    allImages.forEach((img) => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      img.style.display = 'inline-block';
      img.style.objectFit = 'contain';
      img.removeAttribute('width');
      img.removeAttribute('height');

      // Ensure image is inside a centered wrapper block
      if (!img.closest('.expdoc-img-wrapper')) {
        const wrapper = doc.createElement('div');
        wrapper.className = 'expdoc-img-wrapper';
        wrapper.style.textAlign = 'center';
        wrapper.style.margin = '18px auto';
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }
    });

    // Extract logical blocks (p, h1-h6, table, ul, ol, div, blockquote, figure, hr)
    const blocks: string[] = [];
    const nodes = Array.from(doc.body.childNodes);
    let inlineBuffer = '';

    const flushInline = () => {
      if (inlineBuffer.trim()) {
        blocks.push(`<p style="margin-bottom: 0.8em; line-height: 1.7;">${inlineBuffer}</p>`);
      }
      inlineBuffer = '';
    };

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent || '';
        if (txt.trim()) {
          inlineBuffer += txt;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toUpperCase();
        const isBlock = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'UL', 'OL', 'BLOCKQUOTE', 'PRE', 'HR', 'FIGURE'].includes(tag);
        if (isBlock) {
          flushInline();
          blocks.push(el.outerHTML);
        } else {
          inlineBuffer += el.outerHTML;
        }
      }
    });
    flushInline();

    if (blocks.length === 0 && doc.body.innerHTML.trim()) {
      blocks.push(doc.body.innerHTML);
    }
    return blocks;
  };

  // Convert plain text into logical paragraph blocks
  const parseBlocksFromPlainText = (text: string): string[] => {
    const rawParagraphs = text.split(/\r?\n\r?\n/);
    const blocks: string[] = [];
    rawParagraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      const formatted = trimmed.replace(/\r?\n/g, '<br>');
      blocks.push(`<p style="margin-bottom: 0.8em; line-height: 1.7;">${formatted}</p>`);
    });
    return blocks.length > 0 ? blocks : [`<p>${text}</p>`];
  };

  // Multi-page auto-paginator: checks if blocks fit or automatically creates new A4 pages
  const distributeBlocksAcrossPages = (blocks: string[], pageIndex: number) => {
    const contentWidth = pageRefs.current[pageIndex]?.clientWidth || 688;
    const activeEl = pageRefs.current[pageIndex];
    const currentRawHtml = activeEl?.innerHTML || '';

    // Check if active page is essentially empty
    const isPageBlank = !currentRawHtml.trim() || currentRawHtml === '<p><br></p>' || currentRawHtml === '<br>';
    const initialHtml = isPageBlank ? '' : currentRawHtml;
    const initialHeight = isPageBlank ? 0 : measureHtmlBlock(initialHtml, contentWidth);

    // Group blocks into page buckets
    const pageBuckets: string[] = [];
    let currentBucketHtml = initialHtml;
    let currentBucketHeight = initialHeight;

    for (const block of blocks) {
      const blockHeight = measureHtmlBlock(block, contentWidth);

      // If adding block overflows A4 max height and bucket already has content
      if (currentBucketHeight + blockHeight > A4_MAX_CONTENT_HEIGHT && currentBucketHtml.trim()) {
        pageBuckets.push(currentBucketHtml);
        currentBucketHtml = block;
        currentBucketHeight = blockHeight;
      } else {
        currentBucketHtml += block;
        currentBucketHeight += blockHeight;
      }
    }

    if (currentBucketHtml.trim()) {
      pageBuckets.push(currentBucketHtml);
    }

    if (pageBuckets.length === 0) {
      pageBuckets.push('<p><br></p>');
    }

    // If only 1 page bucket and it fits on the current page:
    if (pageBuckets.length === 1) {
      setPages(prev => {
        const next = [...prev];
        next[pageIndex] = pageBuckets[0];
        return next;
      });
      if (pageRefs.current[pageIndex]) {
        pageRefs.current[pageIndex]!.innerHTML = pageBuckets[0];
      }
      updateMetrics();
      toast.success('Pasted & formatted with proper alignment.');
      return;
    }

    // If content overflows across MULTIPLE pages:
    const newPagesTotal = pageBuckets.length;
    setPages(prev => {
      const next = [...prev];
      // Replace current page with bucket 0, insert remaining buckets directly after
      next.splice(pageIndex, 1, ...pageBuckets);
      return next;
    });

    // Re-sync DOM content into each page ref on next tick
    setTimeout(() => {
      pageBuckets.forEach((bucketContent, offset) => {
        const targetIdx = pageIndex + offset;
        if (pageRefs.current[targetIdx]) {
          pageRefs.current[targetIdx]!.innerHTML = bucketContent;
        }
      });
      updateMetrics();
      pageRefs.current[pageIndex]?.focus();
    }, 60);

    toast.success(`Pasted content automatically distributed across ${newPagesTotal} pages!`);
  };

  // Handle Clean Clipboard Paste with Automatic Page Creation & Image Processing
  const handlePaste = async (e: React.ClipboardEvent, pageIndex: number) => {
    e.preventDefault();
    activePageRef.current = pageIndex;

    // 1. Check for Image in clipboardData items (screenshots, copied image files, snipping tool)
    const items = e.clipboardData.items;
    let pastedImageFile: File | null = null;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            pastedImageFile = file;
            break;
          }
        }
      }
    }

    if (!pastedImageFile && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        pastedImageFile = file;
      }
    }

    // If direct image pasted (screenshot, copied graphic)
    if (pastedImageFile) {
      try {
        const base64 = await readFileAsBase64(pastedImageFile);
        const imgBlock = `
          <div class="expdoc-img-wrapper" style="text-align: center; margin: 18px auto; max-width: 100%;">
            <img src="${base64}" alt="Pasted Graphic" style="max-width: 100%; max-height: 520px; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); display: inline-block; object-fit: contain;" />
          </div>
          <p><br></p>
        `;
        distributeBlocksAcrossPages([imgBlock], pageIndex);
      } catch {
        toast.error('Failed to read pasted image.');
      }
      return;
    }

    // 2. Check for HTML or Plain Text (may contain text AND embedded images)
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      const blocks = parseBlocksFromHtml(html);
      distributeBlocksAcrossPages(blocks, pageIndex);
    } else if (text) {
      const blocks = parseBlocksFromPlainText(text);
      distributeBlocksAcrossPages(blocks, pageIndex);
    }
  };

  // Insert Image from file
  const insertImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selected file is not an image.');
      return;
    }

    try {
      const base64 = await readFileAsBase64(file);
      const imgBlock = `
        <div class="expdoc-img-wrapper" style="text-align: center; margin: 18px auto; max-width: 100%;">
          <img src="${base64}" alt="Inserted Graphic" style="max-width: 100%; max-height: 520px; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); display: inline-block; object-fit: contain;" />
        </div>
        <p><br></p>
      `;
      distributeBlocksAcrossPages([imgBlock], activePageRef.current);
    } catch {
      toast.error('Failed to load image.');
    }
  };

  // Insert Image from URL
  const insertImageUrl = () => {
    if (!imageUrl.trim()) return;
    const imgBlock = `
      <div class="expdoc-img-wrapper" style="text-align: center; margin: 18px auto; max-width: 100%;">
        <img src="${imageUrl.trim()}" alt="Inserted Graphic" style="max-width: 100%; max-height: 520px; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); display: inline-block; object-fit: contain;" />
      </div>
      <p><br></p>
    `;
    distributeBlocksAcrossPages([imgBlock], activePageRef.current);
    setImageUrl('');
    setImageModalOpen(false);
  };

  // Insert Table
  const insertTable = (rows = 3, cols = 3) => {
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">';
    tableHtml += '<thead><tr style="background-color: #f8fafc;">';
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold;">Header ${c + 1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 10px;">Cell (${r + 1}, ${c + 1})</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    document.execCommand('insertHTML', false, tableHtml);
    toast.success(`${rows}x${cols} Table inserted!`);
    updateMetrics();
  };

  // =========================================================
  // HISTORY & CLIPBOARD ENGINE (UNDO, REDO, COPY, CUT, PASTE)
  // =========================================================

  // Push snapshot to undo history
  const pushHistorySnapshot = useCallback((newPages: string[]) => {
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newPages].slice(-30);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    haptics.selection();
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetPages = history[targetIndex];
      setHistoryIndex(targetIndex);
      setPages(targetPages);
      setTimeout(() => {
        targetPages.forEach((content, idx) => {
          if (pageRefs.current[idx]) {
            pageRefs.current[idx]!.innerHTML = content;
          }
        });
        updateMetrics();
      }, 30);
      toast.info('Undo');
    } else {
      document.execCommand('undo');
      updateMetrics();
    }
  }, [historyIndex, history, updateMetrics]);

  // Redo function
  const handleRedo = useCallback(() => {
    haptics.selection();
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetPages = history[targetIndex];
      setHistoryIndex(targetIndex);
      setPages(targetPages);
      setTimeout(() => {
        targetPages.forEach((content, idx) => {
          if (pageRefs.current[idx]) {
            pageRefs.current[idx]!.innerHTML = content;
          }
        });
        updateMetrics();
      }, 30);
      toast.info('Redo');
    } else {
      document.execCommand('redo');
      updateMetrics();
    }
  }, [historyIndex, history, updateMetrics]);

  // Copy selection or active page
  const handleCopy = useCallback(async () => {
    haptics.medium();
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      try {
        await navigator.clipboard.writeText(selection.toString());
        toast.success('Copied selection to clipboard!');
      } catch {
        document.execCommand('copy');
        toast.success('Copied to clipboard!');
      }
    } else {
      const activeEl = pageRefs.current[activePageRef.current];
      if (activeEl) {
        try {
          await navigator.clipboard.writeText(activeEl.innerText || '');
          toast.success(`Copied Page ${activePageRef.current + 1} content to clipboard!`);
        } catch {
          toast.info('Select text to copy.');
        }
      }
    }
  }, []);

  // Cut selection or active page
  const handleCut = useCallback(async () => {
    haptics.medium();
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      try {
        await navigator.clipboard.writeText(selection.toString());
        document.execCommand('delete');
        syncPageContents();
        toast.success('Cut selection to clipboard!');
      } catch {
        document.execCommand('cut');
        toast.success('Cut to clipboard!');
      }
    } else {
      if (pages.length > 1) {
        const activeIdx = activePageRef.current;
        const activeEl = pageRefs.current[activeIdx];
        if (activeEl) {
          try {
            await navigator.clipboard.writeText(activeEl.innerText || '');
          } catch {}
        }
        deletePageDirect(activeIdx);
        toast.success(`Cut Page ${activeIdx + 1} to clipboard!`);
      } else {
        const activeEl = pageRefs.current[0];
        if (activeEl) {
          try {
            await navigator.clipboard.writeText(activeEl.innerText || '');
          } catch {}
          activeEl.innerHTML = '<p><br></p>';
          syncPageContents();
          toast.success('Cut page content to clipboard!');
        }
      }
    }
    updateMetrics();
  }, [pages.length, syncPageContents, updateMetrics]);

  // Paste from Toolbar
  const handlePasteFromToolbar = useCallback(async () => {
    haptics.medium();
    try {
      if (navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find(t => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], 'clipboard-pasted.png', { type: imageType });
            await insertImageFile(file);
            toast.success('Pasted image into document!');
            return;
          }
        }
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        const blocks = parseBlocksFromPlainText(text);
        distributeBlocksAcrossPages(blocks, activePageRef.current);
      }
    } catch {
      toast.info('Press Ctrl+V to paste directly into your active page.');
    }
  }, [insertImageFile]);

  // =========================================================
  // PAGE MANAGEMENT: ADD PAGE, DELETE PAGE (NO POPUP), BREAK
  // =========================================================

  // 1. Add a new A4 page sheet
  const handleAddNewPage = () => {
    haptics.heavy();
    syncPageContents();
    setPages(prev => {
      const next = [...prev, '<p><br></p>'];
      pushHistorySnapshot(next);
      return next;
    });
    setTimeout(() => {
      const newIndex = pages.length;
      activePageRef.current = newIndex;
      setSelectedPageIndex(newIndex);
      if (pageRefs.current[newIndex]) {
        pageRefs.current[newIndex]?.focus();
      }
      updateMetrics();
    }, 50);
    toast.success(`Page ${pages.length + 1} created!`);
  };

  // 2. Direct Delete Page (NO POPUP - INSTANT DELETION)
  const deletePageDirect = useCallback((index?: number) => {
    // Read live page contents directly from DOM to prevent losing unsaved edits
    const currentLivePages = pageRefs.current.map((ref, idx) => ref ? ref.innerHTML : (pages[idx] || '<p><br></p>'));

    if (currentLivePages.length <= 1) {
      haptics.error();
      toast.error('Document must contain at least one page.');
      return;
    }

    const targetIdx = index !== undefined ? index : selectedPageIndex;
    if (targetIdx < 0 || targetIdx >= currentLivePages.length) {
      haptics.error();
      toast.error('Please select a valid page to delete.');
      return;
    }

    haptics.warning();
    const nextPages = currentLivePages.filter((_, i) => i !== targetIdx);

    // Clean up pageRefs so references don't point to dangling nodes
    pageRefs.current.splice(targetIdx, 1);

    setPages(nextPages);
    pushHistorySnapshot(nextPages);

    const nextActive = Math.max(0, Math.min(targetIdx, nextPages.length - 1));
    activePageRef.current = nextActive;
    setSelectedPageIndex(nextActive);

    toast.success(`Page ${targetIdx + 1} deleted.`);
    setTimeout(() => {
      nextPages.forEach((content, i) => {
        if (pageRefs.current[i]) {
          pageRefs.current[i]!.innerHTML = content;
        }
      });
      updateMetrics();
      pageRefs.current[nextActive]?.focus();
    }, 40);
  }, [pages, selectedPageIndex, pushHistorySnapshot, updateMetrics]);

  // Global & Page Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z, Delete key on page)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((cmdOrCtrl && e.key.toLowerCase() === 'y') || (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Cut: Ctrl+X when no selection or focus is on page header
      const isContentEditable = (e.target as HTMLElement)?.getAttribute('contenteditable') === 'true' ||
                                (e.target as HTMLElement)?.closest('[contenteditable="true"]');

      // Click on page sheet / header and press Delete or Backspace -> Deletes page directly without popup
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isContentEditable) {
        if (pages.length > 1) {
          e.preventDefault();
          deletePageDirect(selectedPageIndex);
        }
      }

      // Alt+Delete shortcut to delete active page even when inside editor
      if (e.altKey && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (pages.length > 1) {
          e.preventDefault();
          deletePageDirect(activePageRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, deletePageDirect, pages.length, selectedPageIndex]);

  // 3. Insert Page Break (Print-cut marker)
  const handleInsertPageBreak = () => {
    const breakHtml = `
      <div class="page-break" style="page-break-after: always; break-after: page; display: block; border-top: 2px dashed #6366f1; margin: 24px 0; padding-top: 6px; text-align: center; color: #6366f1; font-family: monospace; font-size: 11px; user-select: none;">
        ✂️ --- SECTION / PAGE BREAK (PRINT CUT) --- ✂️
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, breakHtml);
    toast.success('Page break inserted! PDF compiler will break here.');
    updateMetrics();
  };

  // Template handling via custom ConfirmModal popup
  const handleTemplateSelect = (templateId: string) => {
    setPendingTemplateId(templateId);
    setConfirmTemplateOpen(true);
  };

  const executeApplyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    setPages(template.pages);
    pushHistorySnapshot(template.pages);
    setTimeout(() => {
      if (pageRefs.current[0]) {
        pageRefs.current[0].innerHTML = template.pages[0];
      }
      updateMetrics();
    }, 50);
    toast.success(`Applied ${template.name} template!`);
  };

  // Clear Document Canvas via custom ConfirmModal popup
  const executeClear = () => {
    setPages(['<p><br></p>']);
    pushHistorySnapshot(['<p><br></p>']);
    setTimeout(() => {
      if (pageRefs.current[0]) pageRefs.current[0].innerHTML = '<p><br></p>';
      updateMetrics();
      toast.success('Document canvas cleared.');
    }, 50);
  };

  // Initiate PDF Build with customized loading animation
  const handleStartBuildPdf = (fileName: string) => {
    setShowDownloadModal(false);
    setPendingPdfFileName(fileName);
    setIsBuildingPdf(true);
  };

  // Print-to-PDF / Build PDF Compiler across ALL pages
  const compilePdf = (fileName: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up was blocked. Please permit pop-ups to generate PDF.');
      return;
    }

    // Combine all pages with explicit CSS page breaks
    let fullDocHtml = '';
    pageRefs.current.forEach((ref, idx) => {
      if (ref) {
        fullDocHtml += `
          <div class="a4-page-content" style="${idx > 0 ? 'page-break-before: always; break-before: page;' : ''}">
            ${ref.innerHTML}
          </div>
        `;
      }
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 18mm;
            }
            body {
              font-family: ${currentFont};
              font-size: ${currentFontSize};
              color: #0f172a;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-break {
              page-break-after: always;
              break-after: page;
              display: none !important;
            }
            .a4-page-content {
              margin-bottom: 20px;
            }
            h1, h2, h3, h4 {
              color: #0f172a;
              margin-top: 1.2em;
              margin-bottom: 0.5em;
              font-weight: 700;
            }
            h1 { font-size: 26pt; }
            h2 { font-size: 18pt; }
            h3 { font-size: 14pt; }
            p {
              margin-top: 0;
              margin-bottom: 0.8em;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 12px;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${fullDocHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    toast.success('Select "Save as PDF" in your print dialog to save.');
  };

  // Export as Word-compatible HTML Document (.doc)
  const exportAsWordDoc = () => {
    let combinedHtml = '';
    pageRefs.current.forEach((ref, idx) => {
      if (ref) {
        if (idx > 0) combinedHtml += "<br clear=all style='page-break-before:always'>";
        combinedHtml += ref.innerHTML;
      }
    });

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
      "xmlns='http://www.w3.org/TR/REC-html40'>"+
      "<head><meta charset='utf-8'><title>" + docTitle + "</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + combinedHtml + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.trim() || 'Document'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Exported as Microsoft Word document (.doc)!');
  };

  return (
    <PageTransition>
      <div 
        ref={containerRef}
        className={`w-full max-w-6xl mx-auto transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-[100] bg-slate-900 dark:bg-black max-w-none p-3 sm:p-5 overflow-y-auto' 
            : ''
        }`}
      >
        
        {/* Top Header: High-Contrast Document Name & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/30 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>BY EXP STUDIO • EXCLUSIVE ENGINE</span>
            </div>
            
            {/* High-Contrast Document Name Input: Clear on black and dark backgrounds */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white bg-white/90 dark:bg-white/10 px-3.5 py-1.5 rounded-2xl border border-slate-300 dark:border-white/20 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                placeholder="Document Name..."
              />
            </div>
          </div>

          {/* Quick Actions (Word Export, PDF Compiler, Fullscreen Toggle) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportAsWordDoc}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-[#070b18]/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-mono font-semibold shadow-sm transition-all active:scale-95"
              title="Download as Microsoft Word .doc"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Word .doc</span>
            </button>

            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-mono font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Build PDF</span>
            </button>

            {/* Prominent Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-semibold transition-all active:scale-95 ${
                isFullscreen 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                  : 'bg-white/80 dark:bg-[#070b18]/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-sm'
              }`}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Immersive Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isFullscreen ? 'Exit Zen' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Word-Style Categorized Ribbon Toolbar (STICKY ON TOP - Maximum 2-3 clean rows on mobile, 2 rows on PC) */}
        <div className={`sticky top-0 sm:top-2 z-40 mb-4 sm:mb-6 transition-all duration-300 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 backdrop-blur-2xl ${
          isScrolled 
            ? 'bg-white/98 dark:bg-[#070b18]/98 border border-indigo-500/50 dark:border-cyan-500/50 shadow-[0_12px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.9)] ring-1 ring-indigo-500/20' 
            : 'bg-white dark:bg-[#070b18] border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
        }`}>
          
          {/* ROW 1: Ribbon Category Navigation & Universal Quick Access Toolbar */}
          <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
            {/* Category Tab Switchers */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setActiveRibbonTab('home');
                }}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeRibbonTab === 'home'
                    ? 'bg-indigo-600 dark:bg-cyan-500 text-white shadow-sm shadow-indigo-500/25 dark:shadow-cyan-500/25 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 font-medium'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setActiveRibbonTab('edit');
                }}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeRibbonTab === 'edit'
                    ? 'bg-indigo-600 dark:bg-cyan-500 text-white shadow-sm shadow-indigo-500/25 dark:shadow-cyan-500/25 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 font-medium'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setActiveRibbonTab('insert');
                }}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeRibbonTab === 'insert'
                    ? 'bg-indigo-600 dark:bg-cyan-500 text-white shadow-sm shadow-indigo-500/25 dark:shadow-cyan-500/25 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 font-medium'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setActiveRibbonTab('page');
                }}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeRibbonTab === 'page'
                    ? 'bg-indigo-600 dark:bg-cyan-500 text-white shadow-sm shadow-indigo-500/25 dark:shadow-cyan-500/25 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 font-medium'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Page</span>
              </button>
            </div>

            {/* Quick Access Toolbar: Undo/Redo & Page Indicator (always accessible across all categories) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="hidden md:inline-flex text-[11px] font-mono text-slate-400 dark:text-zinc-500 px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                P. {selectedPageIndex + 1}/{pages.length}
              </span>

              <div className="flex items-center bg-slate-100/80 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                <button 
                  onClick={handleUndo} 
                  className="p-1 sm:p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleRedo} 
                  className="p-1 sm:p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 transition-colors"
                  title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2 & 3: CATEGORY ACTIVE TOOLS */}
          {activeRibbonTab === 'home' && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-2 pt-0.5">
              
              {/* Row 2 on Mobile: Font Family + Font Size + Alignment Cluster */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <select
                  value={currentFont}
                  onChange={(e) => handleFontChange(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 focus:outline-none flex-1 sm:flex-none sm:min-w-[90px]"
                  title="Font Family"
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>

                <select
                  value={currentFontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="px-2 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 focus:outline-none w-[64px] sm:w-auto text-center"
                  title="Font Size"
                >
                  {FONT_SIZES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                {/* Alignment: Left, Center, Right, Justify */}
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5 ml-auto sm:ml-0">
                  <button 
                    onClick={() => setAlignment('left')} 
                    className={`p-1.5 rounded-lg transition-colors ${currentAlignment === 'left' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setAlignment('center')} 
                    className={`p-1.5 rounded-lg transition-colors ${currentAlignment === 'center' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setAlignment('right')} 
                    className={`p-1.5 rounded-lg transition-colors ${currentAlignment === 'right' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setAlignment('justify')} 
                    className={`p-1.5 rounded-lg transition-colors ${currentAlignment === 'justify' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'}`}
                    title="Justify"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop separator */}
              <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-0.5 hidden sm:block" />

              {/* Row 3 on Mobile: Styles (B, I, U, S) + Colors + Headings + Lists */}
              <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 w-full sm:w-auto">
                {/* Text Formatting: B, I, U, S */}
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => formatDoc('bold')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 font-bold"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => formatDoc('italic')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => formatDoc('underline')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => formatDoc('strikeThrough')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color & Clear */}
                <div className="flex items-center gap-1">
                  <label className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 cursor-pointer flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10" title="Text Color">
                    <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <input 
                      type="color" 
                      className="sr-only" 
                      onChange={(e) => formatDoc('foreColor', e.target.value)} 
                    />
                  </label>

                  <label className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 cursor-pointer flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10" title="Text Highlight">
                    <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                    <input 
                      type="color" 
                      className="sr-only" 
                      onChange={(e) => formatDoc('hiliteColor', e.target.value)} 
                    />
                  </label>

                  <button 
                    onClick={() => formatDoc('removeFormat')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 text-red-500"
                    title="Clear Formatting"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Headings */}
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => handleBlockFormat('<h1>')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 text-xs font-bold"
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button 
                    onClick={() => handleBlockFormat('<h2>')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 text-xs font-bold"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button 
                    onClick={() => handleBlockFormat('<h3>')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 text-xs font-bold"
                    title="Heading 3"
                  >
                    H3
                  </button>
                </div>

                {/* Lists */}
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => formatDoc('insertUnorderedList')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10"
                    title="Bulleted List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => formatDoc('insertOrderedList')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeRibbonTab === 'edit' && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-2 pt-0.5">
              {/* Row 2 on Mobile: Clipboard & Spacing */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={handleCut} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-mono font-medium transition-colors"
                    title="Cut (Ctrl+X)"
                  >
                    <Scissors className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span className="hidden sm:inline">Cut</span>
                  </button>
                  <button 
                    onClick={handleCopy} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-mono font-medium transition-colors"
                    title="Copy (Ctrl+C)"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button 
                    onClick={handlePasteFromToolbar} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-mono font-medium transition-colors"
                    title="Paste (Ctrl+V)"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>

                {/* Line Spacing Selector */}
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-2 py-0.5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mr-1 hidden sm:inline">Line:</span>
                  <select
                    value={lineSpacing}
                    onChange={(e) => handleLineSpacingChange(e.target.value)}
                    className="py-1 bg-transparent text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
                    title="Line Spacing"
                  >
                    <option value="1.15">1.15</option>
                    <option value="1.5">1.50</option>
                    <option value="1.7">1.70</option>
                    <option value="2.0">2.00</option>
                  </select>
                </div>

                {/* Find & Replace Trigger */}
                <button
                  onClick={() => setFindReplaceOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1 text-xs font-mono ml-auto sm:ml-0"
                  title="Find and Replace"
                >
                  <Replace className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                  <span>Find</span>
                </button>
              </div>

              {/* Desktop separator */}
              <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-0.5 hidden sm:block" />

              {/* Row 3 on Mobile: Indents & Scripts */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => formatDoc('outdent')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs"
                    title="Decrease Indent"
                  >
                    <Outdent className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">Outdent</span>
                  </button>
                  <button 
                    onClick={() => formatDoc('indent')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs"
                    title="Increase Indent"
                  >
                    <Indent className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">Indent</span>
                  </button>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => formatDoc('subscript')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10"
                    title="Subscript (X₂)"
                  >
                    <Subscript className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => formatDoc('superscript')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10"
                    title="Superscript (X²)"
                  >
                    <Superscript className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeRibbonTab === 'insert' && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-2 pt-0.5">
              
              {/* Row 2 on Mobile: Image + URL + Table + Divider */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Upload Image File"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Image</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        insertImageFile(e.target.files[0]);
                        e.target.value = '';
                      }
                    }} 
                  />

                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert Image via Web URL"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>URL</span>
                  </button>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={() => insertTable(3, 3)} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert 3x3 Table"
                  >
                    <Table className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Table</span>
                  </button>

                  <button 
                    onClick={() => formatDoc('insertHorizontalRule')} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert Divider Line"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Line</span>
                  </button>
                </div>
              </div>

              {/* Desktop separator */}
              <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-0.5 hidden sm:block" />

              {/* Row 3 on Mobile: Page Break + Quote + Code + Date */}
              <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={handleInsertPageBreak}
                  className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                  title="Insert Page Break"
                >
                  <Scissors className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                  <span>Break</span>
                </button>

                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                  <button 
                    onClick={insertBlockquote} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert Callout Quote"
                  >
                    <Quote className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Quote</span>
                  </button>

                  <button 
                    onClick={insertCodeBlock} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert Code Snippet"
                  >
                    <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Code</span>
                  </button>

                  <button 
                    onClick={insertDateStamp} 
                    className="p-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-medium"
                    title="Insert Date Stamp"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Date</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeRibbonTab === 'page' && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-2 pt-0.5">
              
              {/* Row 2 on Mobile: Add Page + Delete + Template */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {/* Add Page & Delete Page Cluster */}
              <div className="flex items-center bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl p-0.5 border border-indigo-200/70 dark:border-indigo-500/30">
                <button
                  onClick={handleAddNewPage}
                  className="px-2 sm:px-2.5 py-1 rounded-lg text-indigo-700 dark:text-cyan-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-1 text-xs font-mono font-bold transition-all active:scale-95"
                  title="Add New A4 Page Sheet"
                >
                  <FilePlus2 className="w-3.5 h-3.5" />
                  <span>+ Page</span>
                </button>

                <div className="w-px h-4 bg-indigo-200 dark:bg-indigo-800 mx-0.5" />

                {/* Delete Page Option (Always Visible & Functional) */}
                <button
                  onClick={() => deletePageDirect(selectedPageIndex)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-mono font-bold transition-all active:scale-95 ${
                    pages.length > 1
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                      : 'text-slate-400 dark:text-zinc-600 opacity-60'
                  }`}
                  title={pages.length > 1 ? `Delete Page ${selectedPageIndex + 1}` : 'Document must contain at least one page'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete Page</span>
                </button>

                {/* If multiple pages, dropdown to choose specific page to delete */}
                {pages.length > 1 && (
                  <select
                    value=""
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      if (!isNaN(idx)) deletePageDirect(idx);
                    }}
                    className="bg-transparent text-[11px] font-mono font-bold text-red-600 dark:text-red-400 border-l border-indigo-200 dark:border-indigo-800 pl-1 pr-0.5 py-1 focus:outline-none cursor-pointer"
                    title="Select specific page to delete"
                  >
                    <option value="" disabled>P.{selectedPageIndex + 1}</option>
                    {pages.map((_, i) => (
                      <option key={i} value={i} className="text-slate-900 bg-white">
                        Delete P.{i + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

                <select
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  defaultValue=""
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 focus:outline-none flex-1 sm:flex-none"
                  title="Load Template"
                >
                  <option value="" disabled>Template</option>
                  {TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Desktop separator */}
              <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-0.5 hidden sm:block" />

              {/* Row 3 on Mobile: Watermark + Zoom + Clear */}
              <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">

              {/* Watermark Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-xl px-2 py-0.5 border border-slate-200/60 dark:border-white/5">
                <Stamp className="w-3.5 h-3.5 text-indigo-700 dark:text-cyan-300" />
                <select
                  value={watermark}
                  onChange={(e) => {
                    const val = e.target.value as 'NONE' | 'DRAFT' | 'CONFIDENTIAL';
                    setWatermark(val);
                    toast.success(val === 'NONE' ? 'Watermark removed' : `${val} Watermark active`);
                  }}
                  className="py-1 bg-transparent text-[11px] font-mono font-semibold text-indigo-700 dark:text-cyan-300 focus:outline-none cursor-pointer"
                  title="Document Watermark"
                >
                  <option value="NONE">No Watermark</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                </select>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5 border border-slate-200/60 dark:border-white/5">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 10, 75))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-semibold px-1.5 text-slate-700 dark:text-zinc-300">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

                {/* Clear Document Button */}
                <button
                  onClick={() => setConfirmClearOpen(true)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ml-auto sm:ml-0"
                  title="Clear All Content"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Visual Document Canvas Area (Word Paper A4 Stack) */}
        <div className="flex flex-col items-center p-2 sm:p-6 bg-slate-200/70 dark:bg-black/60 rounded-3xl border border-slate-300/80 dark:border-white/10 overflow-x-auto shadow-inner">
          
          <div 
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="w-full max-w-[800px] flex flex-col items-center"
          >
            {/* Multi-Page Stack Loop */}
            {pages.map((initialContent, pageIdx) => (
              <div 
                key={pageIdx}
                tabIndex={0}
                onClick={() => {
                  setSelectedPageIndex(pageIdx);
                  activePageRef.current = pageIdx;
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Delete' || e.key === 'Backspace') && e.target === e.currentTarget) {
                    e.preventDefault();
                    deletePageDirect(pageIdx);
                  }
                }}
                className={`group/page relative w-full min-h-[1050px] bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-14 mb-8 border transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] focus:outline-none ${
                  selectedPageIndex === pageIdx 
                    ? 'border-indigo-500/70 dark:border-cyan-500/70 ring-2 ring-indigo-500/30 dark:ring-cyan-500/30' 
                    : 'border-slate-200'
                }`}
              >
                {/* Visual Page Header Bar with Page Number & Direct Delete Page Option */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPageIndex(pageIdx);
                    activePageRef.current = pageIdx;
                  }}
                  className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100 text-[11px] font-mono text-slate-400 select-none cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-bold text-indigo-600">
                    <Layers className="w-3 h-3" />
                    PAGE {pageIdx + 1} OF {pages.length}
                    {selectedPageIndex === pageIdx && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[9px] font-semibold border border-indigo-200">
                        Selected • Press Delete key to remove
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Direct Delete Page Button (NO POPUP) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePageDirect(pageIdx);
                      }}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${
                        pages.length > 1
                          ? 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer'
                          : 'text-slate-400 dark:text-zinc-600 opacity-60'
                      }`}
                      title={pages.length > 1 ? `Delete Page ${pageIdx + 1} directly (No popup)` : 'Document must contain at least one page'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Page</span>
                    </button>
                  </div>
                </div>

                {/* Visual Watermark Stamp Overlay */}
                {watermark !== 'NONE' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.06] dark:opacity-[0.08]">
                    <span className="text-6xl sm:text-8xl font-black font-mono tracking-widest -rotate-45 text-slate-900 border-8 border-slate-900 px-8 py-4 rounded-3xl">
                      {watermark}
                    </span>
                  </div>
                )}

                {/* The WYSIWYG Editable Sheet for this Page */}
                <div
                  ref={(el) => {
                    pageRefs.current[pageIdx] = el;
                    if (el && !el.innerHTML.trim() && initialContent) {
                      el.innerHTML = initialContent;
                    }
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => {
                    activePageRef.current = pageIdx;
                    setSelectedPageIndex(pageIdx);
                  }}
                  onClick={() => {
                    activePageRef.current = pageIdx;
                    setSelectedPageIndex(pageIdx);
                  }}
                  onInput={() => {
                    activePageRef.current = pageIdx;
                    setSelectedPageIndex(pageIdx);
                    updateMetrics();
                  }}
                  onPaste={(e) => handlePaste(e, pageIdx)}
                  style={{
                    fontFamily: currentFont,
                    fontSize: currentFontSize,
                    textAlign: currentAlignment,
                    minHeight: '880px',
                    outline: 'none',
                    lineHeight: 1.7
                  }}
                  className="prose prose-slate max-w-none focus:outline-none"
                />

                {/* Page Footer Visual Stamp */}
                <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-300 select-none">
                  <span>EXPDOC // A4 SPECIFICATION</span>
                  <span>PAGE {pageIdx + 1}</span>
                </div>
              </div>
            ))}

            {/* Quick Button to append Page directly below canvas */}
            <div className="w-full flex justify-center pb-4">
              <button
                onClick={handleAddNewPage}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/90 dark:bg-[#070b18]/90 border-2 border-dashed border-indigo-400/60 dark:border-cyan-400/40 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-white/5 font-mono text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another A4 Page Sheet ({pages.length + 1})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Document Status Bar */}
        <div className="mt-3 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-[#070b18]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="font-bold text-indigo-600 dark:text-cyan-400">
              {pages.length} {pages.length === 1 ? 'PAGE' : 'PAGES'} (A4 STACK)
            </span>
            <span>•</span>
            <span>{wordCount} WORDS</span>
            <span>•</span>
            <span>{charCount} CHARS</span>
          </div>

          <div className="flex items-center gap-3">
            <span>ZOOM: {zoomLevel}%</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-cyan-400 font-semibold">PASTE & IMAGE PARSER ACTIVE</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CUSTOM POPUP MODALS (NO DEFAULT BROWSER ALERTS/CONFIRMS)       */}
        {/* ============================================================== */}

        {/* 1. PDF Download Name Popup */}
        <DownloadModal 
          isOpen={showDownloadModal} 
          onClose={() => setShowDownloadModal(false)} 
          onConfirm={handleStartBuildPdf} 
          defaultFileName={`${docTitle.trim() || 'Document'}.pdf`} 
        />

        {/* 1b. Customized "Building a PDF" Loading Animation Modal */}
        <BuildingPdfModal
          isOpen={isBuildingPdf}
          fileName={pendingPdfFileName || `${docTitle.trim() || 'Document'}.pdf`}
          pageCount={pages.length}
          onComplete={() => {
            setIsBuildingPdf(false);
            compilePdf(pendingPdfFileName || `${docTitle.trim() || 'Document'}.pdf`);
          }}
        />

        {/* 2. Clear Document Confirmation Popup */}
        <ConfirmModal
          isOpen={confirmClearOpen}
          onClose={() => setConfirmClearOpen(false)}
          onConfirm={executeClear}
          title="Clear Entire Document?"
          message="This action will wipe all document pages, headings, images, and formatting currently on your sheets. This cannot be undone."
          confirmText="Yes, Clear All"
          cancelText="Keep Editing"
          isDestructive={true}
        />

        {/* 3. Apply Template Confirmation Popup */}
        <ConfirmModal
          isOpen={confirmTemplateOpen}
          onClose={() => {
            setConfirmTemplateOpen(false);
            setPendingTemplateId(null);
          }}
          onConfirm={() => {
            if (pendingTemplateId) executeApplyTemplate(pendingTemplateId);
            setPendingTemplateId(null);
          }}
          title="Replace Current Document?"
          message="Loading this pre-made template will replace your current document pages and graphics. Do you want to proceed?"
          confirmText="Replace with Template"
          cancelText="Cancel"
          isDestructive={false}
        />


        {/* 5. Insert Graphic via URL Popup */}
        {imageModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
              onClick={() => setImageModalOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white/95 dark:bg-[#070b18]/95 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Insert Image from URL
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                Paste any direct web link to a PNG, JPG, or SVG graphic.
              </p>

              <input
                type="url"
                autoFocus
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/graphic.png"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertImageUrl}
                  disabled={!imageUrl.trim()}
                  className="px-5 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl disabled:opacity-40 shadow-md"
                >
                  Embed Graphic
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Find & Replace Modal */}
        {findReplaceOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
              onClick={() => setFindReplaceOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white/95 dark:bg-[#070b18]/95 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
              <button
                onClick={() => setFindReplaceOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                  <Replace className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Find & Replace
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                Search across all document pages and replace words or phrases instantly.
              </p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1 block">Find text:</label>
                  <input
                    type="text"
                    autoFocus
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Enter word or phrase to find..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1 block">Replace with:</label>
                  <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Enter replacement text..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFindReplaceOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFindAndReplace}
                  disabled={!findText.trim()}
                  className="px-5 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl disabled:opacity-40 shadow-md active:scale-95 transition-all"
                >
                  Replace All
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}