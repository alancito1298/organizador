import React from 'react';

export default function GooglePlayIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3.609 1.814L13.793 12 3.61 22.186c-.378-.363-.61-.912-.61-1.636V3.45c0-.724.232-1.273.61-1.636z"
        fill="#00E5FF"
      />
      <path
        d="M17.18 8.613L4.992 1.674c-.452-.258-.934-.342-1.383-.245L13.793 12l3.387-3.387z"
        fill="#00E676"
      />
      <path
        d="M3.609 22.571c.449.097.931.013 1.383-.245l12.188-6.939L13.793 12 3.609 22.571z"
        fill="#FF3D00"
      />
      <path
        d="M20.89 10.722l-3.71-2.109L13.793 12l3.387 3.387 3.71-2.109c1.077-.613 1.077-1.943 0-2.556z"
        fill="#FFD600"
      />
    </svg>
  );
}

