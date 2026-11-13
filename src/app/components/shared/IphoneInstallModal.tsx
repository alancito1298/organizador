'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AppleIcon from './AppleIcon';

interface IphoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IphoneInstallModal({ isOpen, onClose }: IphoneInstallModalProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafariBrowser = /safari/.test(ua) && !/chrome|crios|fxios|edgios/.test(ua);
      setIsIOS(isAppleDevice);
      setIsSafari(isSafariBrowser);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 font-mulish"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-surface-bg p-6 sm:p-8 shadow-2xl border border-white/80 neumorphic-raised max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl text-secondary hover:text-on-surface neumorphic-raised hover:scale-105 active:scale-95 transition-all"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-xl leading-none">close</span>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-black text-white flex items-center justify-center shadow-md shrink-0">
            <AppleIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full neumorphic-inset text-[10px] font-extrabold uppercase tracking-wider text-accent-violet mb-1">
              <span>📱</span> Acceso Directo iOS
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
              Instalar en iPhone o iPad
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-secondary font-medium leading-relaxed mb-6">
          Podés instalar <strong className="text-on-surface">Organizador Docente</strong> directamente en la pantalla de inicio de tu iPhone como una app nativa: pantalla completa, rápida y sin ocupar espacio en tu memoria.
        </p>

        {/* Pasos */}
        <div className="flex flex-col gap-3.5 mb-6">
          {/* Paso 1 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl neumorphic-inset">
            <div className="w-9 h-9 rounded-xl bg-accent-violet/15 text-accent-violet font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-on-surface">
                  Abrí Safari y tocá Compartir
                </span>
                <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600 inline-flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">ios_share</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-secondary leading-snug">
                En la barra inferior (o superior) de Safari, presioná el ícono de <strong>Compartir</strong> (un cuadrado con una flecha hacia arriba).
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl neumorphic-inset">
            <div className="w-9 h-9 rounded-xl bg-accent-violet/15 text-accent-violet font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-on-surface">
                  Elegí &ldquo;Agregar a inicio&rdquo;
                </span>
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 inline-flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">add_box</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-secondary leading-snug">
                Deslizá hacia abajo en las opciones del menú y tocá <strong>&ldquo;Agregar a inicio&rdquo;</strong> (o <em>&ldquo;Agregar a la pantalla de inicio&rdquo;</em>).
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl neumorphic-inset">
            <div className="w-9 h-9 rounded-xl bg-accent-violet/15 text-accent-violet font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-on-surface">
                  Tocá &ldquo;Agregar&rdquo; arriba a la derecha
                </span>
                <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 inline-flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-secondary leading-snug">
                Confirmá el nombre en la esquina superior derecha tocando <strong>&ldquo;Agregar&rdquo;</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Notificación dinámica contextual */}
        {isIOS && isSafari ? (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 flex items-center gap-2.5 mb-5 animate-pulse">
            <span className="material-symbols-outlined text-lg text-blue-600 shrink-0">arrow_downward</span>
            <span className="text-[11px] sm:text-xs font-bold leading-tight">
              ¡Estás en Safari en tu iPhone! Tocá ahora mismo el botón de compartir <span className="underline">[↑]</span> en la barra inferior de tu pantalla.
            </span>
          </div>
        ) : isIOS && !isSafari ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-center gap-2.5 mb-5">
            <span className="material-symbols-outlined text-lg text-amber-600 shrink-0">info</span>
            <span className="text-[11px] sm:text-xs font-bold leading-tight">
              Para crear el acceso directo en iPhone, te recomendamos abrir esta página en <strong>Safari</strong>.
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-900 flex items-center gap-2.5 mb-5">
            <span className="material-symbols-outlined text-lg text-accent-violet shrink-0">devices</span>
            <span className="text-[11px] sm:text-xs font-bold leading-tight">
              Abrí <strong>organizadordocente.com</strong> desde Safari en tu iPhone y seguí estos 3 pasos para tener tu acceso directo.
            </span>
          </div>
        )}

        {/* Botón de Entendido */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-accent-violet text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-accent-violet/25 hover:bg-accent-violet/90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>¡Entendido!</span>
          <span className="material-symbols-outlined text-sm">check</span>
        </button>
      </div>
    </div>
  );
}
