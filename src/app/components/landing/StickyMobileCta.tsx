'use client';

import Link from 'next/link';

export default function StickyMobileCta() {
  return (
    <div className="md:hidden fixed bottom-6 right-5 z-40">
      <Link
        href="/registro"
        className="bg-accent-violet text-white w-13 h-13 p-3.5 rounded-2xl shadow-xl shadow-accent-violet/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-white/40"
        aria-label="Registrarme gratis en Organizador Docente"
      >
        <span className="material-symbols-outlined text-2xl">rocket_launch</span>
      </Link>
    </div>
  );
}
