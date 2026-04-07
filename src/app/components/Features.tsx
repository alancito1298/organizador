"use client";

import Image from "next/image";

export default function Features({ items }: any) {
  return (
    <section className="container  px-6 py-8 mx-auto lg:w-7/9 lg:py-16">
      <div className=" m-0 grid grid-cols-1 gap-8 w-full  md:grid-cols-2 xl:grid-cols-2  items-center justify-center">
     
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-10 space-y-4 mt-10  rounded-xl flex flex-col items-center"
          >
            {/* IMAGEN */}
            {item.imagen && (
              <Image
                src={item.imagen}
                alt={item.titulo}
                width={20000}
                height={5000}
                className="object-contain w-7/9 rounded-4xl "
              />
            )}

            {/* TITULO */}
            <h3 className="text-2xl font-semibold text-violet-700 w-7/9  capitalize">
              {item.titulo}
            </h3>

            {/* DESCRIPCIÓN */}
            <p className="text-violet-950 w-7/9">
              {item.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}