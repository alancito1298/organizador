'use client';

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

type Curso = {
  id: number;
  escuela: string;
  anio: string;
  materia: string;
};

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const pathname = usePathname();
  const [curso, setCurso] = useState<Curso | null>(null);

  useEffect(() => {
    const fetchCurso = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://backend-organizador.vercel.app/cursos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCurso(data);
    };

    if (id) fetchCurso();
  }, [id]);

  if (!curso) return <p className="text-center mt-10">Cargando...</p>;

  const menuItems = [
    //{ name: "Inicio", path: `/sub-menu-curso/${id}` },
    { name: "Asistencia", path: `/sub-menu-curso/${id}/asistencia` },
    { name: "Alumnos", path: `/sub-menu-curso/${id}/alumnos` },
    { name: "Calificaciones", path: `/sub-menu-curso/${id}/calificaciones` },
    //{ name: "Planificaciones", path: `/sub-menu-curso/${id}/planificaciones` },
    //{ name: "Bibliografía", path: `/sub-menu-curso/${id}/bibliografia` },
  ];

  return (
    <div className="min-w-screen  bg-violet-100">

      {/* HEADER */}
      <div className="bg-violet-950 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">
          {curso.anio}  - {curso.materia}
        </h1>
        <p className="uppercase font-sans font-bold">{curso.escuela}</p>
      </div>

      <nav className="flex w-full bg-violet-300 font-bebas ">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex-1 text-center py-3 w-auto text-sm font-medium shadow-amber-800  transition
            ${pathname === item.path
              ? "bg-violet-950 text-white"
              : "bg-purple-700 text-violet-100 hover:bg-violet-300"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* CONTENIDO */}
      <div className="p-6 max-w-5xl mx-auto">
        {children}
      </div>

    </div>
  );
}