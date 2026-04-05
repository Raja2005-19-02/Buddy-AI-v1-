export function BuddyAvatar({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glow ring */}
      <circle cx="16" cy="16" r="15" stroke="url(#glowRing)" strokeWidth="1.2" opacity="0.6" />
      {/* Body */}
      <circle cx="16" cy="16" r="12" fill="url(#bodyGrad)" />
      {/* Face highlight */}
      <ellipse cx="16" cy="13" rx="6" ry="5" fill="url(#faceGrad)" opacity="0.9" />
      {/* Eyes */}
      <ellipse cx="13" cy="13" rx="1.6" ry="2" fill="#ffffff" opacity="0.95" />
      <ellipse cx="19" cy="13" rx="1.6" ry="2" fill="#ffffff" opacity="0.95" />
      {/* Eye shine */}
      <circle cx="13.6" cy="12.3" r="0.6" fill="#4facfe" opacity="0.9" />
      <circle cx="19.6" cy="12.3" r="0.6" fill="#4facfe" opacity="0.9" />
      {/* Smile */}
      <path
        d="M12.5 17.5 Q16 20.5 19.5 17.5"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Antenna */}
      <line x1="16" y1="4" x2="16" y2="8" stroke="#4facfe" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <circle cx="16" cy="3.5" r="1.2" fill="#7ecfff" opacity="0.8" />
      {/* Ear nubs */}
      <rect x="3.5" y="13" width="3" height="5" rx="1.5" fill="url(#bodyGrad)" opacity="0.8" />
      <rect x="25.5" y="13" width="3" height="5" rx="1.5" fill="url(#bodyGrad)" opacity="0.8" />
      <defs>
        <linearGradient id="bodyGrad" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0d1f3c" />
        </linearGradient>
        <linearGradient id="faceGrad" x1="10" y1="8" x2="22" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4facfe" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="glowRing" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
