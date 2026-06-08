"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROVINCIAS = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export default function FormRegistro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repetirPassword: "",
    telefono: "",
    provincia: "",
    localidad: "",
    fechaNacimiento: "",
  });

  const API =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://backend-organizador.vercel.app";

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (form.password !== form.repetirPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const { repetirPassword, ...body } = form;

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al registrarse");

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      setMensaje("✅ Cuenta creada correctamente");
      router.push("/planes");
    } catch (error: any) {
      setMensaje(error.message || "❌ Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full mb-3 p-3 bg-white rounded-lg text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400";
  const labelClass = "text-sm font-medium text-violet-900 mb-1 block";

  return (
    <div className="flex flex-col items-center w-full bg-violet-50">
      <form
        onSubmit={handleSubmit}
        className="bg-purple-200 m-20 text-violet-950 p-8 border border-violet-300 shadow-lg w-full max-w-md"
      >
        <h2 className="text-4xl my-10 text-center uppercase">
          Crear tu cuenta
        </h2>

        <label className={labelClass}>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Repetir contraseña</label>
        <input
          type="password"
          name="repetirPassword"
          value={form.repetirPassword}
          onChange={handleChange}
          className={`${inputClass} ${
            form.repetirPassword && form.password !== form.repetirPassword
              ? "ring-2 ring-red-400"
              : ""
          }`}
          required
        />
        {form.repetirPassword && form.password !== form.repetirPassword && (
          <p className="text-red-500 text-xs -mt-2 mb-3">Las contraseñas no coinciden</p>
        )}

        <label className={labelClass}>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Provincia</label>
        <select
          name="provincia"
          value={form.provincia}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Seleccioná tu provincia</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label className={labelClass}>Localidad</label>
        <input
          type="text"
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <label className={labelClass}>Fecha de nacimiento</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <button
          type="submit"
          disabled={loading || form.password !== form.repetirPassword}
          className="w-full bg-violet-600 my-10 text-white p-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-60"
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>

        {mensaje && (
          <p className="mt-4 text-center text-sm">{mensaje}</p>
        )}
      </form>
    </div>
  );
}