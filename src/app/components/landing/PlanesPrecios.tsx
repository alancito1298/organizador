'use client';

export default function Planes() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="precios">
      <div className="text-center mb-xl">
        <h2 className="font-display-lg text-display-lg text-primary mb-sm">Elegí el plan ideal para vos</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Todos nuestros planes incluyen acceso desde cualquier dispositivo y soporte continuo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md max-w-7xl mx-auto items-stretch">

        {/* Plan 1: Gratis */}
        <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="inline-block bg-success-green/10 text-success-green font-label-sm px-sm py-xs rounded-full mb-md w-max">🌱 100% GRATIS</div>
          <h3 className="text-xl font-bold text-primary mb-xs">Gratis</h3>
          <div className="text-4xl font-bold text-primary mb-sm">$0 <span className="text-base font-normal text-on-surface-variant">/siempre</span></div>
          <ul className="mt-md mb-xl space-y-sm flex-1">
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-success-green text-[20px]">check</span> Hasta 2 cursos</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-success-green text-[20px]">check</span> Alumnos ilimitados</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-success-green text-[20px]">check</span> Asistencias y Calificaciones</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-success-green text-[20px]">check</span> Agenda y Horarios</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-on-surface-variant/50 text-[20px]">info</span> Anuncios discretos</li>
          </ul>
          <a className="w-full py-sm text-center rounded-lg border border-primary text-primary font-label-md hover:bg-surface-lavender transition-colors block" href="/registro">Registrarme Gratis</a>
        </div>

        {/* Plan 2: Básico Mensual */}
        <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="inline-block bg-primary/10 text-primary font-label-sm px-sm py-xs rounded-full mb-md w-max">RECOMENDADO</div>
          <h3 className="text-xl font-bold text-primary mb-xs">Básico Mensual</h3>
          <div className="text-4xl font-bold text-primary mb-sm">$3.999 <span className="text-base font-normal text-on-surface-variant">/mes</span></div>
          <ul className="mt-md mb-xl space-y-sm flex-1">
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Hasta 4 cursos</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Exportación Excel</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Notificaciones</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Sin publicidad</li>
          </ul>
          <a className="w-full py-sm text-center rounded-lg border border-primary text-primary font-label-md hover:bg-surface-lavender transition-colors block" href="/registro">Probar Gratis!</a>
        </div>

        {/* Plan 3: Plus Mensual (Highlighted) */}
        <div className="bg-primary text-white rounded-2xl p-lg shadow-lg flex flex-col border border-primary-container relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm px-md py-xs rounded-bl-lg font-bold">⭐ Más Popular</div>
          <div className="inline-block bg-white/20 text-white font-label-sm px-sm py-xs rounded-full mb-md w-max mt-4">¡30 DÍAS GRATIS!</div>
          <h3 className="text-xl font-bold mb-xs">Plus Mensual</h3>
          <div className="text-4xl font-bold mb-sm">$4.999 <span className="text-base font-normal text-primary-fixed-dim">/mes</span></div>
          <ul className="mt-md mb-xl space-y-sm flex-1">
            <li className="flex items-center gap-sm"><span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check</span> Cursos ilimitados</li>
            <li className="flex items-center gap-sm"><span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check</span> Planificaciones y Bibliografía</li>
            <li className="flex items-center gap-sm"><span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check</span> Exportación Excel Pro</li>
            <li className="flex items-center gap-sm"><span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check</span> Sin publicidad</li>
          </ul>
          <a className="w-full py-sm text-center rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-md hover:bg-tertiary transition-colors shadow-md font-bold block" href="/registro">Probar Gratis!</a>
        </div>

        {/* Plan 4: Básico Anual */}
        <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="inline-block bg-primary/10 text-primary font-label-sm px-sm py-xs rounded-full mb-md w-max">AHORRO ANUAL</div>
          <h3 className="text-xl font-bold text-primary mb-xs">Básico Anual</h3>
          <div className="text-4xl font-bold text-primary mb-sm">$24.999 <span className="text-base font-normal text-on-surface-variant">/año</span></div>
          <div className="text-xs text-secondary-container font-label-sm mb-md">Ahorrás $22.999</div>
          <ul className="mt-md mb-xl space-y-sm flex-1">
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Hasta 4 cursos</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Exportación Excel</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Sin publicidad</li>
          </ul>
          <a className="w-full py-sm text-center rounded-lg border border-primary text-primary font-label-md hover:bg-surface-lavender transition-colors block" href="/registro">Probar Gratis!</a>
        </div>

        {/* Plan 5: Plus Anual */}
        <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="inline-block bg-secondary-container text-white font-label-sm px-sm py-xs rounded-full mb-md w-max">MÁXIMO VALOR</div>
          <h3 className="text-xl font-bold text-primary mb-xs">Plus Anual</h3>
          <div className="text-4xl font-bold text-primary mb-sm">$39.999 <span className="text-base font-normal text-on-surface-variant">/año</span></div>
          <div className="text-xs text-secondary-container font-label-sm mb-md">Ahorrás $19.999</div>
          <ul className="mt-md mb-xl space-y-sm flex-1">
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Cursos ilimitados</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Planificaciones y Bibliografía</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Exportación Excel Pro</li>
            <li className="flex items-center gap-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Sin publicidad</li>
          </ul>
          <a className="w-full py-sm text-center rounded-lg border border-primary text-primary font-label-md hover:bg-surface-lavender transition-colors block" href="/registro">Probar Gratis!</a>
        </div>

      </div>

      <div className="text-center mt-lg text-on-surface-variant font-body-md text-sm">
        Los pagos son procesados de forma segura por <strong>MercadoPago</strong>.<br />
        Podés cancelar o cambiar de plan en cualquier momento.
      </div>
    </section>
  );
}