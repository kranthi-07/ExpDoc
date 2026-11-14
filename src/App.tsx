import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import Navbar from './components/Navbar';
import BottomTabBar from './components/BottomTabBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ImageToPdf from './pages/ImageToPdf';
import TextToPdf from './pages/TextToPdf';
import CompressPdf from './pages/CompressPdf';
import MergePdf from './pages/MergePdf';
import ExtractPages from './pages/ExtractPages';
import WatermarkPdf from './pages/WatermarkPdf';
import SplitPdf from './pages/SplitPdf';
import PageNumbersPdf from './pages/PageNumbersPdf';
import ExpDocStudio from './pages/ExpDocStudio';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

function LocationProvider() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/text-to-pdf" element={<TextToPdf />} />
        <Route path="/compress-pdf" element={<CompressPdf />} />
        <Route path="/merge-pdf" element={<MergePdf />} />
        <Route path="/extract-pages" element={<ExtractPages />} />
        <Route path="/watermark-pdf" element={<WatermarkPdf />} />
        <Route path="/split-pdf" element={<SplitPdf />} />
        <Route path="/page-numbers" element={<PageNumbersPdf />} />
        <Route path="/expdoc-studio" element={<ExpDocStudio />} />
        <Route path="/word-editor" element={<ExpDocStudio />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-zinc-100 font-sans flex flex-col selection:bg-indigo-500/30 transition-colors duration-300 overflow-x-hidden">
        
        {/* Futuristic Ambient Aurora Gradients */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-violet-600/10 to-transparent dark:from-indigo-600/25 dark:via-cyan-500/10 dark:to-transparent rounded-full blur-3xl opacity-75 dark:opacity-85 pointer-events-none" />
          <div className="absolute -bottom-40 right-[-10%] w-[500px] h-[500px] bg-gradient-to-t from-cyan-500/10 via-indigo-500/5 to-transparent dark:from-cyan-500/15 dark:via-indigo-500/5 dark:to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute inset-0 futuristic-grid opacity-60 dark:opacity-40 pointer-events-none" />
        </div>

        <Toaster position="bottom-center" richColors theme="system" />
        
        {/* Native App Top Header */}
        <Navbar />

        {/* Main App Canvas: Clean native spacing on mobile, topbar clearance on tablet/desktop */}
        <main className="relative z-10 flex-grow max-w-6xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-24 pb-28 lg:pb-16 flex flex-col">
          <LocationProvider />
        </main>

        {/* Native App Floating Bottom Dock (Mobile & Tablet) */}
        <BottomTabBar />

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;