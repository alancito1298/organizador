'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormularioAlumno from "./FormularioAlumno";

export type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
};

export default function CursoPage() {
  const params = useParams();
  const cursoId = params.id as string;

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://backend-organizador.vercel.app/inscripciones/curso/${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("INSCRIPCIONES:", data);

      if (Array.isArray(data)) {
        const alumnosDelCurso = data
          .map((i: any) => i.alumno)
          .filter(Boolean);

        setAlumnos(alumnosDelCurso);
      }
    };

    if (cursoId) fetchAlumnos();
  }, [cursoId]);

  return (
    <>
      <FormularioAlumno
        cursoId={cursoId}
        onAlumnoCreado={(nuevo) =>
          setAlumnos((prev) => [...prev, nuevo])
        }
      />

{alumnos.length === 0 && <p>No hay alumnos</p>}

{alumnos.map((alumno) => (
  <div key={alumno.id}>
    {alumno.nombre ?? "Sin nombre"}{" "}
    {alumno.apellido ?? ""}
  </div>
))}
      
      
    </>
  );
}