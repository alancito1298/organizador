"use client";

import { Smartphone, Tablet, Laptop, Monitor } from "lucide-react";

export default function InfoDispotivos() {
  const dispositivos = [
    {
      icon: <Smartphone size={32} />,
      titulo: "Celular",
      descripcion:
        "Accedé a tu información en cualquier momento desde tu teléfono, ideal para usar en clase o en movimiento.",
    },
    {
      icon: <Tablet size={32} />,
      titulo: "Tablet",
      descripcion:
        "Una experiencia cómoda y visual para gestionar cursos, asistencias y agenda con mayor espacio.",
    },
    {
      icon: <Laptop size={32} />,
      titulo: "Notebook",
      descripcion:
        "Perfecto para planificar, cargar calificaciones y organizar tu trabajo con mayor productividad y comodamente.",
    },
    {
      icon: <Monitor size={32} />,
      titulo: "PC de Escritorio",
      descripcion:
        "Trabajá con total comodidad en pantalla grande, ideal para gestionar toda tu información sin límites desde tu casa.",
    },
  ];

  return (
    <section className=" bg-violet-800 w-full ">
      {/* TÍTULO */}
      <div className="text-center mt-15 mb-10">
        <h2 className="text-5xl font-bold text-white-800 lg:text-6xl mt-40">
          Accedé desde cualquier dispositivo
        </h2>
        <p className="mt-3 text-2xl p-20 text-gray-100">
          Nuestra plataforma es totalmente multiplataforma, lo que significa que
          podés usarla desde cualquier dispositivo sin perder funcionalidad ni
          información.
        </p>
      </div>

      {/* GRID */}
      <div className=" lg:mx-50 flex flex-col items-center justify-center lg:mb-20 lg:grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {dispositivos.map((item, i) => (
          <div
            key={i}
            className="p-6 mb-5 w-7/8 lg:w-full h-50 border border-black rounded-2xl bg-violet-950 backdrop-blur-md shadow-sm hover:shadow-md transition"
          >
            <div className="text-violet-white mx-4 mt-4">{item.icon}</div>

            <h3 className="text-xl mx-4 text-yellow-200 uppercase font-mono font-extralight">
              {item.titulo}
            </h3>

            <p className="text-sm text-white m-4">{item.descripcion}</p>
          </div>
        ))}
      <span className="h-50 "></span></div>
    </section>
  );
}