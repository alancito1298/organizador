'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';
const DEFAULT_DOCENTES_COUNT = 89;

interface ContadorDocentesProps {
  variant?: 'hero-inline' | 'floating-card';
  className?: string;
}

export default function ContadorDocentes({
  variant = 'hero-inline',
  className = '',
}: ContadorDocentesProps) {
  const [count, setCount] = useState<number>(DEFAULT_DOCENTES_COUNT);
  const [displayCount, setDisplayCount] = useState<number>(0);

  // Obtener último ID de usuario docente desde el backend
  useEffect(() => {
    let isMounted = true;
    const fetchContador = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${API}/docentes/public/contador`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data?.total && typeof data.total === 'number' && isMounted) {
            setCount(data.total);
          }
        }
      } catch {
        // En caso de fallo o timeout se mantiene DEFAULT_DOCENTES_COUNT (89)
      }
    };

    fetchContador();
    return () => {
      isMounted = false;
    };
  }, []);

  // Animación de conteo fluido de 0 a count
  useEffect(() => {
    let start = 0;
    const target = count;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = Math.ceil(target / totalSteps) || 1;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [count]);

  if (variant === 'floating-card') {
    return (
      <div
        className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md neumorphic-raised p-3.5 sm:p-4 rounded-2xl border border-white/80 dark:border-white/10 shadow-xl flex items-center gap-3.5 transition-all ${className}`}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-accent-violet to-violet-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-accent-violet/30 shrink-0">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-base sm:text-lg font-black text-on-surface tracking-tight">
              +{displayCount} Docentes
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-secondary font-semibold leading-tight">
            usando la app en sus escuelas
          </p>
        </div>
      </div>
    );
  }

  // Variant: 'hero-inline'
  return (
    <div className={`flex flex-wrap items-center gap-3 pt-2 ${className}`}>
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neumorphic-inset text-xs font-bold text-on-surface">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-accent-violet font-black">+{displayCount} docentes</span>
        <span className="text-secondary font-medium">ya usan la plataforma</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
        <span className="text-amber-500 text-xs">★★★★★</span>
        <span className="text-on-surface font-extrabold text-[11px]">4.9/5</span>
        <span className="text-secondary text-[11px]">en satisfacción docente</span>
      </div>
    </div>
  );
}

