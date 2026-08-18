'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar cuando se escrolee más de 200px
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible || cerrado) return null;

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-50 animate-bounce-short">
      <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-950 border border-yellow-400/60 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-white backdrop-blur-md">
        <a
          href="/registro"
          className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-violet-950 font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow transition"
        >
          <Sparkles size={14} className="shrink-0 text-violet-950" />
          <span>Probar Gratis — Sin Tarjeta 🚀</span>
        </a>
        <button
          onClick={() => setCerrado(true)}
          className="text-violet-300 hover:text-white p-1 rounded-lg transition shrink-0"
          aria-label="Cerrar aviso"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
