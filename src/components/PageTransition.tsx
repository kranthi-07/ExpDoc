import { motion } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top Laser Loading Animation Beam on Function Switch */}
      <motion.div
        initial={{ width: '0%', opacity: 1 }}
        animate={{ width: '100%', opacity: 0 }}
        transition={{ 
          width: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.25, delay: 0.25, ease: 'easeOut' }
        }}
        className="fixed top-0 left-0 h-[2.5px] z-[9999] bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.85)] pointer-events-none"
      />

      {/* Main Function Switching Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ 
          duration: 0.25, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="w-full h-full flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}
