'use client';

import { useState } from "react";
import { Alumno } from "./page";

type Props = {
  cursoId: string;
  onAlumnoCreado: (alumno: Alumno) => void;
};

export default function FormularioAlumno({
  cursoId,
  onAlumnoCreado,
}: Props) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    contacto: "",
  });

  const [loading, setLoading] = useState(false);

  const agregarAlumno = async () => {
    if (!form.nombre || !form.apellido) {
      alert("Nombre y apellido son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // 1️⃣ Crear alumno
      const resAlumno = await fetch(
        "https://backend-organizador.vercel.app/alumnos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: form.nombre,
            apellido: form.apellido,
            dni: form.dni || undefined,
            contacto: form.contacto || undefined,
          }),
        }
      );

      if (!resAlumno.ok) {
        throw new Error("Error creando alumno");
      }

      const alumnoCreado = await resAlumno.json();

      // 2️⃣ Crear inscripción
      const resInscripcion = await fetch(
        "https://backend-organizador.vercel.app/inscripciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            alumnoId: Number(alumnoCreado.id),
            cursoId: Number(cursoId),
          }),
        }
      );

      if (!resInscripcion.ok) {
        await fetch(
          `https://backend-organizador.vercel.app/alumnos/${alumnoCreado.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        throw new Error("Error creando inscripción");
      }

      // ✅ Actualizar lista en el padre
      onAlumnoCreado(alumnoCreado);

      // ✅ Limpiar formulario
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        contacto: "",
      });

      alert("Alumno creado e inscripto correctamente");

    } catch (error) {
      console.error(error);
      alert("Hubo un problema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) =>
            setForm({ ...form, apellido: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="DNI (opcional)"
          value={form.dni}
          onChange={(e) =>
            setForm({ ...form, dni: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Contacto (opcional)"
          value={form.contacto}
          onChange={(e) =>
            setForm({ ...form, contacto: e.target.value })
          }
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={agregarAlumno}
        disabled={loading}
        className={`px-6 py-2 rounded mt-4 text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-violet-700 hover:bg-violet-800"
        }`}
      >
        {loading ? "Creando..." : "Agregar Alumno"}
      </button>
    </div>
  );
}