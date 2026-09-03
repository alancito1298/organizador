'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-margin-desktop h-24 transition-all duration-300">
      <Link href="/home" className="flex items-center gap-sm">
        <Image src="/odicono.svg" alt="Organizador Docente" width={32} height={32} />
        <span className="font-headline-md text-headline-md font-bold text-primary hidden md:inline">Organizador Docente</span>
      </Link>

      <div className="hidden md:flex items-center gap-lg ml-auto">
        <div className="flex items-center">
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md hover:bg-surface-lavender px-sm py-xs rounded-md" href="#modulos">Módulos</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md hover:bg-surface-lavender px-sm py-xs rounded-md" href="#dispositivos">Accesibilidad</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md hover:bg-surface-lavender px-sm py-xs rounded-md" href="#precios">Precios</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md hover:bg-surface-lavender px-sm py-xs rounded-md" href="/login">Iniciar Sesión</a>
        </div>
        <a className="font-label-md text-label-md bg-gradient-to-r from-primary to-secondary text-white px-lg py-sm rounded-full hover:shadow-lg hover:scale-[1.02] transition-all shadow-md hidden md:block" href="/registro">Registrarme Gratis</a>
      </div>

      {/* Mobile Toggle */}
      {mounted && (
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary p-2" aria-label="Toggle menu">
          <span className="material-symbols-outlined text-3xl">{open ? 'close' : 'menu'}</span>
        </button>
      )}

      {/* Mobile Dropdown */}
      {mounted && open && (
        <div className="md:hidden fixed top-24 left-0 w-full bg-white border-b border-outline-variant/30 p-md flex flex-col gap-sm shadow-xl z-50">
          <a href="#modulos" onClick={() => setOpen(false)} className="text-on-surface-variant font-label-md py-xs">Módulos</a>
          <a href="#dispositivos" onClick={() => setOpen(false)} className="text-on-surface-variant font-label-md py-xs">Accesibilidad</a>
          <a href="#precios" onClick={() => setOpen(false)} className="text-on-surface-variant font-label-md py-xs">Precios</a>
          <a href="/login" onClick={() => setOpen(false)} className="text-on-surface-variant font-label-md py-xs">Iniciar Sesión</a>
          <a href="/registro" className="font-label-md bg-primary text-white text-center py-sm rounded-full mt-sm">Registrarme Gratis</a>
        </div>
      )}
    </nav>
  );
}