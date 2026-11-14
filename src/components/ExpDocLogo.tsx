interface LogoProps {
  className?: string;
  size?: number;
}

export default function ExpDocLogo({ className = "w-6 h-6", size = 28 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logoSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      
      {/* Background Rounded Shield */}
      <rect x="3" y="3" width="58" height="58" rx="16" fill="#070b18" stroke="url(#logoBgGrad)" strokeWidth="2.5"/>
      
      {/* Back Layer Sheet */}
      <rect x="14" y="12" width="32" height="40" rx="6" fill="#6366f1" fillOpacity="0.25" />
      
      {/* Main Document Page */}
      <rect x="18" y="15" width="32" height="38" rx="6" fill="url(#logoBgGrad)" />
      
      {/* Document Fold Corner */}
      <path d="M42 15 L50 23 L42 23 Z" fill="#ffffff" fillOpacity="0.45"/>
      
      {/* Document Content Lines */}
      <rect x="23" y="25" width="14" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.95"/>
      <rect x="23" y="31" width="22" height="2" rx="1" fill="#ffffff" fillOpacity="0.75"/>
      <rect x="23" y="36" width="18" height="2" rx="1" fill="#ffffff" fillOpacity="0.75"/>
      
      {/* Glowing Accent Sparkle */}
      <path d="M38 43 L40 37 L45 39 L41 43 L44 48 L39 45 L35 49 L36 43 Z" fill="url(#logoSparkGrad)" />
    </svg>
  );
}
