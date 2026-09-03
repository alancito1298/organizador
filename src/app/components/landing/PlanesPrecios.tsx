'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Planes() {
  const [esAnual, setEsAnual] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto font-mulish" id="precios">
      <div className="text-center mb-12 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-accent-violet">
          <span className="material-symbols-outlined text-sm">payments</span>
          Planes Transparentes
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Elegí el plan ideal para tu labor docente
        </h2>
        <p className="text-sm sm:text-base text-secondary max-w-2xl">
          Comenzá 100% gratis con tus primeros cursos o desbloqueá cursos ilimitados, Asistente IA y planillas Excel Pro.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="mt-4 inline-flex items-center p-1.5 rounded-full neumorphic-inset bg-surface-bg">
          <button
            type="button"
            onClick={() => setEsAnual(false)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              !esAnual
                ? 'bg-accent-violet text-white shadow-md shadow-accent-violet/25'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Facturación Mensual
          </button>
          <button
            type="button"
            onClick={() => setEsAnual(true)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              esAnual
                ? 'bg-accent-violet text-white shadow-md shadow-accent-violet/25'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span>Facturación Anual</span>
            <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Ahorrás 33%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* Plan 1: Gratis */}
        <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 sm:p-9 border border-white/60 shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold mb-4 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              100% GRATIS PARA SIEMPRE
            </div>
            <h3 className="text-2xl font-extrabold text-on-surface mb-1">Plan Inicial</h3>
            <p className="text-xs text-secondary mb-6">Todas las funciones básicas para comenzar sin tarjeta de crédito.</p>

            <div className="text-4xl font-extrabold text-on-surface mb-2 flex items-baseline gap-1">
              $0
              <span className="text-sm font-bold text-secondary">/ sin costo</span>
            </div>
            <p className="text-[11px] text-secondary font-medium mb-6">Sin vencimiento. Usalo todo el ciclo lectivo.</p>

            <div className="h-px bg-outline-variant/30 my-4"></div>

            <ul className="space-y-3 text-xs sm:text-sm text-text-main">
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span><strong>Hasta 4 cursos</strong> simultáneos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Alumnos y matrículas ilimitadas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Toma de asistencia y conceptos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Carga de calificaciones y promedios</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Agenda escolar y grilla horaria semanal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Modo Offline en el aula sin internet</span>
              </li>
              <li className="flex items-center gap-2.5 text-secondary/50">
                <span className="material-symbols-outlined text-secondary/40 text-lg shrink-0">cancel</span>
                <span className="line-through">Exportación a planillas Excel</span>
              </li>
              <li className="flex items-center gap-2.5 text-secondary/50">
                <span className="material-symbols-outlined text-secondary/40 text-lg shrink-0">cancel</span>
                <span className="line-through">Asistente Pedagógico con IA ilimitado</span>
              </li>
            </ul>
          </div>

          <Link
            href="/registro"
            className="w-full mt-8 py-3.5 text-center rounded-2xl neumorphic-raised font-extrabold text-xs uppercase tracking-wider text-accent-violet hover:bg-accent-violet hover:text-white transition-all shadow-sm block active:scale-95"
          >
            Registrarme Gratis
          </Link>
        </div>

        {/* Plan 2: Plus (Destacado) */}
        <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 sm:p-9 border-2 border-accent-violet/40 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          {/* Ribbon Superior */}
          <div className="absolute top-0 right-0 bg-accent-violet text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm">
            ⭐ RECOMENDADO DOCENTE
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-accent-violet/15 text-accent-violet px-3 py-1 rounded-full text-xs font-extrabold mb-4 border border-accent-violet/30">
              <span className="material-symbols-outlined text-sm">bolt</span>
              ¡30 DÍAS DE PRUEBA GRATIS!
            </div>
            <h3 className="text-2xl font-extrabold text-on-surface mb-1">Plan Plus</h3>
            <p className="text-xs text-secondary mb-6">Máxima potencia para docentes con muchas materias y escuelas.</p>

            <div className="text-4xl font-extrabold text-accent-violet mb-2 flex items-baseline gap-1">
              {esAnual ? '$39.999' : '$4.999'}
              <span className="text-sm font-bold text-secondary">
                {esAnual ? ' / año' : ' / mes'}
              </span>
            </div>
            {esAnual ? (
              <p className="text-[11px] text-emerald-600 font-bold mb-6">
                Equivale a $3.333/mes (Ahorrás $20.000 pagando anual)
              </p>
            ) : (
              <p className="text-[11px] text-secondary font-medium mb-6">
                Podés pausar o cancelar en cualquier momento sin costo.
              </p>
            )}

            <div className="h-px bg-outline-variant/30 my-4"></div>

            <ul className="space-y-3 text-xs sm:text-sm text-text-main">
              <li className="flex items-center gap-2.5 font-bold text-accent-violet">
                <span className="material-symbols-outlined text-accent-violet text-lg shrink-0">smart_toy</span>
                <span>🤖 Asistente Pedagógico con IA Ilimitado</span>
              </li>
              <li className="flex items-center gap-2.5 font-bold">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">all_inclusive</span>
                <span>Cursos y divisiones ilimitadas</span>
              </li>
              <li className="flex items-center gap-2.5 font-bold">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">table_view</span>
                <span>Exportación e Importación de Planillas Excel (.xlsx)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Módulo de Planificaciones anuales y secuencias</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Bibliografía y diseños curriculares argentinos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Sincronización en la nube multidispositivo</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
                <span>Soporte prioritario por WhatsApp</span>
              </li>
            </ul>
          </div>

          <Link
            href="/registro"
            className="w-full mt-8 py-3.5 text-center rounded-2xl bg-accent-violet text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-accent-violet/30 hover:bg-accent-violet/90 active:scale-95 transition-all block"
          >
            ¡Probar 30 Días Gratis Ahora!
          </Link>
        </div>
      </div>

      <p className="text-center mt-8 text-xs text-secondary">
        Los cobros se realizan de forma 100% segura mediante <strong>Mercado Pago</strong> con débito, crédito o dinero en cuenta.
      </p>
    </section>
  );
}