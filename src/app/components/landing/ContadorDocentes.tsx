'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';
const DEFAULT_DOCENTES_COUNT = 100;

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

  // Obtener conteo de docentes en vivo sin caché (con polling y detección de foco)
  useEffect(() => {
    let isMounted = true;
    let abortController: AbortController | null = null;

    const fetchContador = async () => {
      try {
        abortController?.abort();
        abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController?.abort(), 4000);

        // Parámetro _t único y headers estrictos para evitar cualquier caché de navegador o CDN
        const res = await fetch(`${API}/docentes/public/contador?_t=${Date.now()}`, {
          signal: abortController.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data?.total && typeof data.total === 'number' && isMounted) {
            setCount(data.total);
          }
        }
      } catch {
        // En caso de fallo de red o timeout se mantiene el valor actual
      }
    };

    // 1. Fetch inicial inmediato
    fetchContador();

    // 2. Intervalo en vivo: re-consultar cada 15 segundos
    const intervalId = setInterval(fetchContador, 15000);

    // 3. Re-consultar cuando la pestaña vuelve a ser visible o enfocada
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchContador();
      }
    };
    const handleFocus = () => {
      fetchContador();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      abortController?.abort();
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Animación de conteo fluido de 0 a count (o actualización suave en vivo sin reiniciar a 0)
  useEffect(() => {
    if (count === displayCount) return;

    const start = displayCount;
    const target = count;
    const diff = Math.abs(target - start);

    // Si es un incremento en vivo pequeño (+1, +2), la animación es corta; si es inicial, 1200ms
    const duration = diff <= 3 && start > 0 ? 400 : 1200;
    const stepTime = 20;
    const totalSteps = Math.max(1, Math.floor(duration / stepTime));
    const step = (target - start) / totalSteps;

    let current = start;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      current += step;
      if (stepCount >= totalSteps || (step > 0 ? current >= target : current <= target)) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [count, displayCount]);

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

