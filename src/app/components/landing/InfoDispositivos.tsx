'use client';

export default function InfoDispositivos() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-lavender border-y border-outline-variant/20 text-center" id="dispositivos">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display-lg text-display-lg text-primary mb-md">Accedé desde cualquier dispositivo</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">Llevá tu agenda y planillas a todas partes. Funciona con y sin internet en el aula, con sincronización automática en la nube.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          <div className="flex flex-col items-center gap-sm group">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md group-hover:border-primary-fixed-dim">
              <span className="material-symbols-outlined text-[40px]">smartphone</span>
            </div>
            <span className="font-headline-md text-lg text-primary">Celular</span>
          </div>
          <div className="flex flex-col items-center gap-sm group">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md group-hover:border-primary-fixed-dim">
              <span className="material-symbols-outlined text-[40px]">tablet_mac</span>
            </div>
            <span className="font-headline-md text-lg text-primary">Tablet</span>
          </div>
          <div className="flex flex-col items-center gap-sm group">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md group-hover:border-primary-fixed-dim">
              <span className="material-symbols-outlined text-[40px]">laptop_mac</span>
            </div>
            <span className="font-headline-md text-lg text-primary">Notebook</span>
          </div>
          <div className="flex flex-col items-center gap-sm group">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md group-hover:border-primary-fixed-dim">
              <span className="material-symbols-outlined text-[40px]">desktop_windows</span>
            </div>
            <span className="font-headline-md text-lg text-primary">PC</span>
          </div>
        </div>
      </div>
    </section>
  );
}