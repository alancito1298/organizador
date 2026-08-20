'use client';

import Image from "next/image";

export default function Features({ items }: any) {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop overflow-hidden" id="modulos">
      <div className="text-center mb-xl max-w-3xl mx-auto">
        <h2 className="font-display-lg text-display-lg text-primary mb-md">¿En qué te ayudamos?</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Cada módulo está pensado para ahorrarte tiempo real. Mirá todo lo que podés hacer desde un solo lugar.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl max-w-7xl mx-auto">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex flex-col items-center bg-surface-lavender rounded-2xl p-md shadow-sm border border-outline-variant/50">
            {item.imagen && (
              <div className="w-full h-80 rounded-xl overflow-hidden mb-lg shadow-inner bg-surface flex items-center justify-center">
                <Image
                  src={item.imagen}
                  alt={item.alt || item.titulo}
                  title={item.alt || item.titulo}
                  width={800}
                  height={500}
                  className="h-full w-auto object-contain"
                />
              </div>
            )}
            <h3 className="font-headline-md text-headline-md text-primary text-center mb-sm">{item.titulo}</h3>
            <p className="font-body-md text-body-md text-center text-on-surface-variant mb-md">{item.descripcion}</p>
            <a className="mt-auto text-secondary font-label-md hover:underline flex items-center gap-xs" href="/registro">
              Probar esta función <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}