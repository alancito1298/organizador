'use client';

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Features({ items }: any) {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden" id="modulos">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-violet-950 uppercase tracking-tight mb-4">
          ¿Cómo funciona?
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Organizá tus clases sin perder tiempo. Gestioná cursos, alumnos, asistencia y notas desde un solo lugar diseñado para tu comodidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex flex-col items-center bg-violet-50/70 rounded-2xl p-6 shadow-sm border border-violet-200/60 hover:shadow-md transition group"
          >
            {item.imagen && (
              <div className="w-full h-72 rounded-xl overflow-hidden mb-6 shadow-inner bg-white flex items-center justify-center border border-violet-100">
                <Image
                  src={item.imagen}
                  alt={item.alt || item.titulo}
                  title={item.alt || item.titulo}
                  width={800}
                  height={500}
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <h3 className="font-bold text-lg sm:text-xl text-violet-950 text-center mb-2">
              {item.titulo.replace(/^[✔\s]+/, "")}
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed flex-1">
              {item.descripcion}
            </p>

            <a
              href="/registro"
              className="mt-auto text-violet-900 font-bold text-xs uppercase tracking-wider hover:text-indigo-600 transition flex items-center gap-1 bg-white px-4 py-2.5 rounded-xl border border-violet-200 shadow-xs"
            >
              <span>Probar esta función</span>
              <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}