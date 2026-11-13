'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GooglePlayIcon from './GooglePlayIcon';
import AppleIcon from './AppleIcon';
import IphoneInstallModal from './IphoneInstallModal';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [iphoneModalOpen, setIphoneModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 py-3 transition-all duration-300 font-mulish">
      <nav
        className={`max-w-6xl mx-auto rounded-3xl transition-all duration-300 flex items-center justify-between px-5 py-3 ${
          scrolled
            ? 'bg-surface-bg/90 backdrop-blur-md shadow-[4px_4px_16px_#A3B1C6,-4px_-4px_16px_#FFFFFF] border border-white/70'
            : 'bg-surface-bg/75 backdrop-blur-sm border border-white/50'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-xl neumorphic-inset group-hover:scale-105 transition-transform">
            <Image src="/odicono.svg" alt="Organizador Docente" width={28} height={28} priority />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-on-surface flex items-center gap-1">
            Organizador <span className="text-accent-violet">Docente</span>
          </span>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <a
            href="#modulos"
            className="text-xs font-bold text-secondary hover:text-accent-violet px-3 py-2 rounded-xl transition-colors"
          >
            Módulos
          </a>
          <a
            href="#dispositivos"
            className="text-xs font-bold text-secondary hover:text-accent-violet px-3 py-2 rounded-xl transition-colors"
          >
            Accesibilidad
          </a>
          <a
            href="#precios"
            className="text-xs font-bold text-secondary hover:text-accent-violet px-3 py-2 rounded-xl transition-colors"
          >
            Precios
          </a>
          <a
            href="#faq"
            className="text-xs font-bold text-secondary hover:text-accent-violet px-3 py-2 rounded-xl transition-colors"
          >
            Preguntas Frecuentes
          </a>
        </div>

        {/* Botones Auth Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
          <div className="relative inline-block">
            <a
              href="https://play.google.com/store/apps/details?id=com.organizadordocente.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Descargar app en Google Play Store (Android - En actualización)"
              className="text-xs font-black bg-slate-950 hover:bg-black text-white px-3 py-2.5 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 border border-slate-800"
            >
              <GooglePlayIcon className="w-4 h-4 shrink-0" />
              <span>Android</span>
            </a>
            <span className="absolute -top-2 -right-1 bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow-sm border border-white">
              Mantenimiento
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIphoneModalOpen(true)}
            title="Instalar acceso directo en iPhone / iPad"
            className="text-xs font-black bg-slate-950 hover:bg-black text-white px-3 py-2.5 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 border border-slate-800 cursor-pointer"
          >
            <AppleIcon className="w-4 h-4 shrink-0" />
            <span>iPhone</span>
          </button>
          <Link
            href="/login"
            className="text-xs font-extrabold text-on-surface hover:text-accent-violet px-3 lg:px-4 py-2.5 rounded-2xl transition-all active:scale-95"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="text-xs font-extrabold bg-accent-violet text-white px-4 lg:px-5 py-2.5 rounded-2xl shadow-md shadow-accent-violet/25 hover:bg-accent-violet/90 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Registrarme Gratis</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {/* Botón Mobile Menu */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.organizadordocente.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Descargar app en Google Play (Android)"
            className="p-1.5 rounded-xl bg-slate-950 text-white shadow-sm flex items-center justify-center border border-slate-800 active:scale-95"
          >
            <GooglePlayIcon className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setIphoneModalOpen(true)}
            title="Instalar acceso directo en iPhone"
            className="p-1.5 rounded-xl bg-slate-950 text-white shadow-sm flex items-center justify-center border border-slate-800 active:scale-95 cursor-pointer"
          >
            <AppleIcon className="w-4 h-4" />
          </button>
          <Link
            href="/login"
            className="text-[11px] font-extrabold text-accent-violet px-2.5 py-1.5 rounded-xl neumorphic-inset"
          >
            Ingresar
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-2xl neumorphic-raised text-on-surface hover:text-accent-violet active:scale-95 transition-transform"
            aria-label="Alternar menú"
          >
            <span className="material-symbols-outlined text-xl leading-none">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Menú Desplegable Mobile */}
      {open && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl bg-surface-bg/95 backdrop-blur-md p-5 border border-white/70 shadow-[6px_6px_20px_#A3B1C6,-6px_-6px_20px_#FFFFFF] flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#modulos"
            onClick={() => setOpen(false)}
            className="text-xs font-extrabold text-on-surface hover:text-accent-violet p-2.5 rounded-xl hover:bg-violet-500/10 flex items-center justify-between"
          >
            <span>Módulos y Herramientas</span>
            <span className="material-symbols-outlined text-sm text-secondary">chevron_right</span>
          </a>
          <a
            href="#dispositivos"
            onClick={() => setOpen(false)}
            className="text-xs font-extrabold text-on-surface hover:text-accent-violet p-2.5 rounded-xl hover:bg-violet-500/10 flex items-center justify-between"
          >
            <span>Modo Offline y Dispositivos</span>
            <span className="material-symbols-outlined text-sm text-secondary">chevron_right</span>
          </a>
          <a
            href="#precios"
            onClick={() => setOpen(false)}
            className="text-xs font-extrabold text-on-surface hover:text-accent-violet p-2.5 rounded-xl hover:bg-violet-500/10 flex items-center justify-between"
          >
            <span>Planes y Precios</span>
            <span className="material-symbols-outlined text-sm text-secondary">chevron_right</span>
          </a>
          <a
            href="#faq"
            onClick={() => setOpen(false)}
            className="text-xs font-extrabold text-on-surface hover:text-accent-violet p-2.5 rounded-xl hover:bg-violet-500/10 flex items-center justify-between"
          >
            <span>Preguntas Frecuentes</span>
            <span className="material-symbols-outlined text-sm text-secondary">chevron_right</span>
          </a>

          <div className="pt-3 border-t border-violet-100 flex flex-col gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.organizadordocente.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-xs font-black bg-slate-950 hover:bg-black text-white text-center py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 border border-slate-800"
            >
              <GooglePlayIcon className="w-4 h-4" />
              <span>Descargar en Google Play (Android)</span>
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ml-1">
                Mantenimiento
              </span>
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setIphoneModalOpen(true);
              }}
              className="text-xs font-black bg-slate-950 hover:bg-black text-white text-center py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 border border-slate-800 cursor-pointer"
            >
              <AppleIcon className="w-4 h-4" />
              <span>Instalar en iPhone (Acceso Directo)</span>
            </button>
            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="text-xs font-extrabold bg-accent-violet text-white text-center py-3 rounded-2xl shadow-md shadow-accent-violet/25"
            >
              Registrarme Gratis (Hasta 4 cursos)
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-xs font-extrabold text-center py-2.5 rounded-2xl neumorphic-raised text-on-surface"
            >
              Ya tengo cuenta (Iniciar Sesión)
            </Link>
          </div>
        </div>
      )}

      {/* Modal de instrucciones para iPhone / iPad */}
      <IphoneInstallModal isOpen={iphoneModalOpen} onClose={() => setIphoneModalOpen(false)} />
    </header>
  );
}