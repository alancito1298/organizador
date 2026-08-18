'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-violet-100 fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-violet-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <BookOpen size={22} className="text-yellow-400" />
          </div>
          <span className="font-bold text-lg sm:text-xl text-violet-950 tracking-tight">
            Organizador Docente
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <a href="#modulos" className="hover:text-violet-900 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition">Módulos</a>
            <a href="#dispositivos" className="hover:text-violet-900 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition">Accesibilidad</a>
            <a href="#precios" className="hover:text-violet-900 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition">Precios</a>
            <a href="/login" className="hover:text-violet-900 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition">Iniciar Sesión</a>
          </div>

          <a
            href="/registro"
            className="font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-violet-950 to-indigo-900 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md"
          >
            Registrarme Gratis
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        {mounted && (
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-violet-950 p-2 rounded-lg hover:bg-violet-50 transition"
            aria-label="Abrir menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* MOBILE DROPDOWN */}
      {mounted && open && (
        <div className="md:hidden bg-white border-b border-violet-100 px-6 py-6 space-y-4 shadow-xl">
          <a href="#modulos" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-violet-900 py-1">Módulos</a>
          <a href="#dispositivos" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-violet-900 py-1">Accesibilidad</a>
          <a href="#precios" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-violet-900 py-1">Precios</a>
          <a href="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-violet-900 py-1">Iniciar Sesión</a>
          <a
            href="/registro"
            className="block text-center font-bold text-xs uppercase tracking-wider bg-violet-950 text-white px-5 py-3 rounded-xl shadow mt-2"
          >
            Registrarme Gratis
          </a>
        </div>
      )}
    </nav>
  );
}