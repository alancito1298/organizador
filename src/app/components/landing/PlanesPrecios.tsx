'use client';

import { useState } from 'react';

export default function Planes() {
  const [esAnual, setEsAnual] = useState(false);

  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="precios">
      <div className="text-center mb-lg">
        <h2 className="font-display-lg text-display-lg text-primary mb-sm">Elegí el plan ideal para vos</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Comenzá gratis con todas las herramientas esenciales o desbloqueá el potencial completo con el Plan Plus.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="flex items-center justify-center gap-sm mt-md">
          <span className={`text-sm font-medium ${!esAnual ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            Facturación Mensual
          </span>
          <button
            type="button"
            onClick={() => setEsAnual(!esAnual)}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary/20 transition-colors focus:outline-none p-1"
            aria-label="Cambiar periodo de facturación"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-primary transition-transform ${
                esAnual ? 'translate-x-7 bg-tertiary-fixed' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-xs ${esAnual ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            Facturación Anual
            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-xs px-xs py-[2px] rounded-full font-bold">
              Ahorrá $20.000
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-4xl mx-auto items-stretch">
        {/* Plan 1: Gratis */}
        <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="inline-block bg-success-green/10 text-success-green font-label-sm px-sm py-xs rounded-full mb-md font-bold">
              🌱 100% GRATIS
            </div>
            <h3 className="text-2xl font-bold text-primary mb-xs">Plan Gratis</h3>
            <p className="text-xs text-on-surface-variant mb-md">Ideal para organizarte sin costo inicial.</p>
            <div className="text-4xl font-bold text-primary mb-sm">
              $0 <span className="text-base font-normal text-on-surface-variant">/siempre</span>
            </div>

            <hr className="my-md border-outline-variant/50" />

            <ul className="space-y-sm flex-1">
              <li className="flex items-center gap-sm text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-success-green text-[22px]">check_circle</span>
                <span><strong>Hasta 4 cursos</strong> simultáneos</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-success-green text-[22px]">check_circle</span>
                <span>Alumnos ilimitados</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-success-green text-[22px]">check_circle</span>
                <span>Asistencias y Calificaciones</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-success-green text-[22px]">check_circle</span>
                <span>Agenda y Horarios docentes</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface-variant/50">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-[22px]">cancel</span>
                <span className="line-through">Exportación a Excel</span>
              </li>
              <li className="flex items-center gap-sm text-on-surface-variant/50">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-[22px]">cancel</span>
                <span className="line-through">Planificaciones y Bibliografía</span>
              </li>
            </ul>
          </div>

          <a
            className="w-full py-md text-center rounded-xl border-2 border-primary text-primary font-bold hover:bg-surface-lavender transition-colors block mt-xl"
            href="/registro"
          >
            Registrarme Gratis
          </a>
        </div>

        {/* Plan 2: Plus (Destacado) */}
        <div className="bg-primary text-white rounded-2xl p-lg shadow-xl flex flex-col justify-between border-2 border-primary-container relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm px-md py-xs rounded-bl-lg font-bold">
            ⭐ MÁS POPULAR
          </div>

          <div>
            <div className="inline-block bg-white/20 text-white font-label-sm px-sm py-xs rounded-full mb-md mt-2 font-bold">
              ¡30 DÍAS PRUEBA GRATIS!
            </div>
            <h3 className="text-2xl font-bold mb-xs">Plan Plus</h3>
            <p className="text-xs text-white/80 mb-md">Potencia completa para gestionar todas tus escuelas.</p>
            
            <div className="text-4xl font-bold mb-sm">
              {esAnual ? '$39.999' : '$4.999'}
              <span className="text-base font-normal text-primary-fixed-dim">
                {esAnual ? ' /año' : ' /mes'}
              </span>
            </div>
            {esAnual && (
              <div className="text-xs text-tertiary-fixed font-bold mb-xs">
                Equivalente a $3.333/mes (Ahorrás $20.000 al año)
              </div>
            )}

            <hr className="my-md border-white/20" />

            <ul className="space-y-sm flex-1">
              <li className="flex items-center gap-sm font-semibold">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">smart_toy</span>
                <span><strong>🤖 Asistente Pedagógico con IA</strong></span>
              </li>
              <li className="flex items-center gap-sm font-semibold">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">star</span>
                <span><strong>Cursos ilimitados</strong></span>
              </li>
              <li className="flex items-center gap-sm font-semibold">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">star</span>
                <span><strong>Exportación e Importación Excel Pro</strong></span>
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
                <span>Planificaciones y Bibliografía pedagógica</span>
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
                <span>Alumnos y materias ilimitadas</span>
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
                <span>Sin publicidad y soporte prioritario</span>
              </li>
            </ul>
          </div>

          <a
            className="w-full py-md text-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-bold hover:bg-tertiary transition-colors shadow-md block mt-xl text-lg"
            href="/registro"
          >
            ¡Probar 30 Días Gratis!
          </a>
        </div>
      </div>

      <div className="text-center mt-lg text-on-surface-variant font-body-md text-sm">
        Los pagos se procesan de forma segura mediante <strong>MercadoPago</strong>.<br />
        Podés cancelar o cambiar tu suscripción en cualquier momento sin compromisos.
      </div>
    </section>
  );
}