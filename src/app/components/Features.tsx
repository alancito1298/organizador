"use client";

import Image from "next/image";

export default function Features({ items }: any) {
  return (
    <section className="container  px-6 py-8 mb-20 mx-auto lg:w-7/9 lg:py-16">
      <div className=" m-0 grid grid-cols-1 gap-8 w-full  md:grid-cols-2 xl:grid-cols-2  items-center justify-center">
     
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-10 space-y-4 mt-10 bg-violet-200 sm:bg-white  flex flex-col items-center"
          >
          <h3 className="text-2xl mt-10  font-semibold text-violet-700 w-7/9 ">
              {item.titulo}
            </h3>
            {item.imagen && (
              <Image
                src={item.imagen}
                alt={item.titulo}
                width={20000}
                height={5000}
                className="object-contain w-7/9 lg:w-1/2 rounded-4xl "
              />
            )}

          
            

            <p className="text-violet-950 mb-10 w-7/9">
              {item.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}