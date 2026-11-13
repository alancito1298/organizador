'use client';

import { useState } from 'react';
import GooglePlayIcon from '../shared/GooglePlayIcon';
import AppleIcon from '../shared/AppleIcon';
import IphoneInstallModal from '../shared/IphoneInstallModal';

export default function InfoDispositivos() {
  const [iphoneModalOpen, setIphoneModalOpen] = useState(false);

  const dispositivos = [
    { icono: 'smartphone', nombre: 'Celular', subtitulo: 'Android & iPhone' },
    { icono: 'tablet_mac', nombre: 'Tablet', subtitulo: 'iPad & Android' },
    { icono: 'laptop_mac', nombre: 'Notebook', subtitulo: 'Windows, Mac & Linux' },
    { icono: 'desktop_windows', nombre: 'Computadora', subtitulo: 'PC de escritorio' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto font-mulish" id="dispositivos">
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-8 sm:p-12 border border-white/60 shadow-xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-accent-violet mb-4">
          <span className="material-symbols-outlined text-sm">devices</span>
          Multiplataforma 100% Accesible
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-3">
          Llevá tus clases en cualquier pantalla
        </h2>
        <p className="text-xs sm:text-sm text-secondary max-w-2xl mx-auto mb-10 font-medium">
          Instalá el acceso directo en tu celular o abrí la plataforma en tu computadora. Funciona en el aula con y sin internet con sincronización instantánea.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {dispositivos.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl neumorphic-inset hover:scale-105 transition-transform duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl neumorphic-raised flex items-center justify-center text-accent-violet group-hover:text-accent-violet group-hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-3xl">{d.icono}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-on-surface">{d.nombre}</span>
                <span className="text-[11px] text-secondary font-medium">{d.subtitulo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de Descarga e Instalación Rápida */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 pt-8 border-t border-violet-100">
          <a
            href="https://play.google.com/store/apps/details?id=com.organizadordocente.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Descargar app en Google Play Store (Android)"
            className="bg-slate-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border border-slate-800"
          >
            <GooglePlayIcon className="w-4 h-4 shrink-0" />
            <span>Descargar para Android</span>
          </a>
          <button
            type="button"
            onClick={() => setIphoneModalOpen(true)}
            title="Instalar acceso directo en iPhone / iPad"
            className="bg-slate-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
          >
            <AppleIcon className="w-4 h-4 shrink-0" />
            <span>Instalar en iPhone (Acceso Directo)</span>
          </button>
        </div>
      </div>

      <IphoneInstallModal isOpen={iphoneModalOpen} onClose={() => setIphoneModalOpen(false)} />
    </section>
  );
}