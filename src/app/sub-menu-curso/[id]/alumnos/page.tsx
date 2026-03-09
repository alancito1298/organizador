'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormularioAlumno from "./FormularioAlumno";
import BottomNav from "@/app/components/BottomNav";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

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
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [editandoAlumno, setEditandoAlumno] = useState<Alumno | null>(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", apellido: "", contacto: "" });
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  useEffect(() => {
    if (!cursoId) return;
    fetchAlumnos();
  }, [cursoId]);

  const fetchAlumnos = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/inscripciones/curso/${cursoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
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

  // =====================
  // ELIMINAR
  // =====================
  const handleEliminar = async (alumno: Alumno) => {
    setEliminandoId(alumno.id);
  };

  const confirmarEliminar = async () => {
    if (!eliminandoId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/alumnos/${eliminandoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAlumnos((prev) => prev.filter((a) => a.id !== eliminandoId));
    } catch {
      alert(" Error al eliminar el alumno");
    } finally {
      setEliminandoId(null);
    }
  };

  // =====================
  // EDITAR
  // =====================
  const handleEditar = (alumno: Alumno) => {
    setEditandoAlumno(alumno);
    setFormEdit({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      contacto: alumno.contacto ?? "",
    });
  };

  const confirmarEditar = async () => {
    if (!editandoAlumno) return;
    setGuardandoEdit(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/alumnos/${editandoAlumno.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formEdit),
      });
      if (!res.ok) throw new Error();
      const actualizado = await res.json();
      setAlumnos((prev) =>
        prev.map((a) => (a.id === editandoAlumno.id ? { ...a, ...actualizado } : a))
      );
      setEditandoAlumno(null);
    } catch {
      alert("Error al editar el alumno");
    } finally {
      setGuardandoEdit(false);
    }
  };

  if (!cursoId) return <p>Cargando...</p>;

  return (
    <>
      <h3 className="text-black text-2xl text-center font-bebas">Alumnos listados de este curso</h3>

      {alumnos.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No hay alumnos</p>
      ) : (
        <table className="text-black mt-6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr className="bg-violet-300">
              <th className="border-violet-900 border-1 w-1/3 p-2">Apellido</th>
              <th className="border-violet-900 border-1 w-1/3 p-2">Nombre</th>
              <th className="border-violet-900 border-1 w-1/5 p-2">Contacto</th>
              <th className="w-1/8 border-violet-900 border-1"></th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="border-b border-violet-200">
                <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.apellido}</td>
                <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.nombre}</td>
                <td className="text-center p-1 text-2xl font-semibold uppercase">{alumno.contacto}</td>
                <td className="flex items-center justify-evenly py-2">
                  {/* ELIMINAR */}
                  <button
                    onClick={() => handleEliminar(alumno)}
                    className="text-red-500 hover:text-red-700 transition p-1"
                    title="Eliminar alumno"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                  </button>
                  {/* EDITAR */}
                  <button
                    onClick={() => handleEditar(alumno)}
                    className="text-yellow-500 hover:text-yellow-700 transition p-1"
                    title="Editar alumno"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <FormularioAlumno
        cursoId={cursoId}
        onAlumnoCreado={(nuevo) => setAlumnos((prev) => [...prev, nuevo])}
      />

      <BottomNav />

      {/* ===================== */}
      {/* MODAL ELIMINAR        */}
      {/* ===================== */}
      {eliminandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-violet-900 mb-2">¿Eliminar alumno?</h3>
            <p className="text-sm text-gray-500 mb-1">
              <strong>
                {alumnos.find((a) => a.id === eliminandoId)?.apellido},{" "}
                {alumnos.find((a) => a.id === eliminandoId)?.nombre}
              </strong>
            </p>
            <p className="text-xs text-red-500 mb-5">
              Se eliminarán todas sus asistencias y calificaciones.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setEliminandoId(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* MODAL EDITAR          */}
      {/* ===================== */}
      {editandoAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-violet-900 mb-4 text-center">✏️ Editar alumno</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                className="border border-violet-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formEdit.apellido}
                onChange={(e) => setFormEdit({ ...formEdit, apellido: e.target.value })}
                className="border border-violet-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                placeholder="Contacto (opcional)"
                value={formEdit.contacto}
                onChange={(e) => setFormEdit({ ...formEdit, contacto: e.target.value })}
                className="border border-violet-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-3 justify-center mt-5">
              <button
                onClick={() => setEditandoAlumno(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEditar}
                disabled={guardandoEdit}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition font-medium disabled:opacity-60"
              >
                {guardandoEdit ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}