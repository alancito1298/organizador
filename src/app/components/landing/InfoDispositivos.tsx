'use client';

import { Smartphone, Tablet, Laptop, Monitor } from "lucide-react";

export default function InfoDispositivo() {
  const dispositivos = [
    {
      icon: <Smartphone size={36} />,
      titulo: "Celular",
      descripcion: "Accedé a tu información en cualquier momento desde tu teléfono, ideal para usar en clase o en movimiento.",
    },
    {
      icon: <Tablet size={36} />,
      titulo: "Tablet",
      descripcion: "Una experiencia cómoda y visual para gestionar cursos, asistencias y agenda con mayor espacio.",
    },
    {
      icon: <Laptop size={36} />,
      titulo: "Notebook",
      descripcion: "Perfecto para planificar, cargar calificaciones y organizar tu trabajo con mayor comodidad.",
    },
    {
      icon: <Monitor size={36} />,
      titulo: "PC",
      descripcion: "Trabajá con total comodidad en pantalla grande, ideal para gestionar toda tu información docente.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 bg-violet-50/90 border-y border-violet-100 text-center" id="dispositivos">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-violet-950 uppercase tracking-tight mb-4">
          Accedé desde cualquier dispositivo
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
          Llevá tu agenda y planillas a todas partes. Tu información se sincroniza automáticamente en la nube.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {dispositivos.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-violet-200/70 flex items-center justify-center text-violet-950 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md group-hover:border-violet-400">
                {item.icon}
              </div>
              <span className="font-bold text-lg text-violet-950">{item.titulo}</span>
              <p className="text-xs text-gray-500 hidden sm:block max-w-[200px] leading-relaxed">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}