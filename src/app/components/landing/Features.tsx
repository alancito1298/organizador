"use client";

import Image from "next/image";

export default function Features({ items }: any) {
  return (
    <section className="container  px-6 py-8 mb-20 mx-auto lg:w-7/9 lg:py-16">
      <div className=" m-0 grid grid-cols-1 gap-8 w-full  md:grid-cols-2 xl:grid-cols-2  lg:w-3/4 lg:m-auto items-start justify-center">
     
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-10 space-y-4 m-2 lg:h-full w-auto lg:justify-beetween bg-violet-100 border rounded-4xl border-violet-900 h-auto  flex flex-col items-center justify-start"
          >
         
            {item.imagen && (
              <Image
                src={item.imagen}
                alt={item.alt || item.titulo}
                title={item.alt || item.titulo}
                width={800}
                height={500}
                className="w-full h-auto rounded-3xl border border-violet-300 shadow-md"
              />
            )}
          
             <h3 className="text-3xl mt-10 uppercase font-light m-2 text-violet-950 text-center h-auto">
              {item.titulo}
            </h3>
            <p className="text-violet-950 m-8 mb-10 text-xl text-center">
              {item.descripcion}
            </p>
            <a
              href="/registro"
              className="text-xs font-bold uppercase tracking-wider text-violet-900 bg-white hover:bg-violet-900 hover:text-white px-4 py-2 rounded-xl border border-violet-400 transition shadow-sm mt-auto"
            >
              Probar esta función gratis →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}