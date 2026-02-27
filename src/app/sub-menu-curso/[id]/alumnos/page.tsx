'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormularioAlumno from "./FormularioAlumno";







export type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
  contacto: string;
};

export default function CursoPage() {
  const params = useParams();
  const cursoId = Number(params.id);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    if (!cursoId) return;

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
          .filter(Boolean)
          .sort((a: any, b: any) => {
            const apellidoCompare = a.apellido.localeCompare(b.apellido);
            if (apellidoCompare !== 0) return apellidoCompare;
            return a.nombre.localeCompare(b.nombre);
          });
      
        setAlumnos(alumnosDelCurso);
      }
    };

    fetchAlumnos();
  }, [cursoId]);

  useEffect(() => {
    console.log("ALUMNOS ACTUALIZADOS:", alumnos);
  }, [alumnos]);

  if (!cursoId) return <p>Cargando...</p>;

  return (
    <>
      <FormularioAlumno
        cursoId={cursoId}
        onAlumnoCreado={(nuevo) =>
          setAlumnos((prev) => [...prev, nuevo])
        }
      />

{alumnos.length === 0 ? (
  <p>No hay alumnos</p>
) : (
  <table className="text-black"style={{ borderCollapse: "collapse", width: "100%" }}>
    <thead >
      <tr className="bg-violet-300">
        <th className="text-centro border-violet-900 border-1 w-1/3">Apellido</th>
        <th className="text-centro border-violet-900 border-1 w-1/3">Nombre</th>
        <th className="text-centro border-violet-900 border-1 w-1/5">Contacto</th>
        <th className="w-1/8 border-violet-900 border-1"></th>
      </tr>
    </thead>
    <tbody>
      {alumnos.map((alumno, index) => (
        <tr className="" key={alumno.id}>
          <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.apellido}</td>
          <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.nombre}</td>
          <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.contacto}</td>
          <td className="flex items-center justify-evenly"> 
            <button className="text-red-500 text-center justify-center p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3 " viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg>
            </button>
            <button className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </button>
        </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
 
  
    </>
  );
}