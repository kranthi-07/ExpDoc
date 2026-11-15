import { useState, useEffect } from 'react';
import { Vibrate, VibrateOff } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

export default function HapticToggle({ className = '' }: { className?: string }) {
  const [isHapticEnabled, setIsHapticEnabled] = useState(() => haptics.isEnabled());

  useEffect(() => {
    const handleHapticsChange = (e: any) => {
      if (typeof e.detail === 'boolean') {
        setIsHapticEnabled(e.detail);
      }
    };
    window.addEventListener('expdoc-haptics-change', handleHapticsChange);
    return () => window.removeEventListener('expdoc-haptics-change', handleHapticsChange);
  }, []);

  const toggleHaptics = () => {
    const next = !isHapticEnabled;
    haptics.setEnabled(next);
    setIsHapticEnabled(next);

    if (next) {
      haptics.medium();
      toast.success('Haptics enabled • Tactile feedback active');
    } else {
      toast.info('Haptics silenced');
    }
  };

  return (
    <button
      onClick={toggleHaptics}
      className={`relative p-2 sm:p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-cyan-400 hover:bg-slate-200/90 dark:hover:bg-white/10 transition-all duration-200 active:scale-95 shadow-sm ${className}`}
      aria-label="Toggle haptic vibration feedback"
      title={isHapticEnabled ? "Haptics Active (Tap to mute)" : "Haptics Muted (Tap to enable)"}
    >
      {isHapticEnabled ? (
        <Vibrate className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
      ) : (
        <VibrateOff className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
      )}
    </button>
  );
}
