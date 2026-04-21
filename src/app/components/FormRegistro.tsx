"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormRegistro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
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

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
  
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }
  
      const token = localStorage.getItem("token");

      await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMensaje("✅ Cuenta creada correctamente");
  
      router.push("/planes");
  
    } catch (error: any) {
      setMensaje(error.message || "❌ Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-violet-50">
      <form
        onSubmit={handleSubmit}
        className="bg-purple-200 m-20 text-violet-950 p-8 border border-violet-300 shadow-lg w-full max-w-md"
      >
        <h2 className="text-4xl my-10 text-center uppercase">
          Crear tu cuenta
        </h2>

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Provincia</label>
        <input
          type="text"
          name="provincia"
          value={form.provincia}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Localidad</label>
        <input
          type="text"
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          className="w-full mb-3 p-3 bg-white rounded-lg"
          required
        />

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          onChange={handleChange}
          className="w-full mb-5 p-3 bg-white rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 my-10 text-white p-3 rounded-lg hover:bg-blue-700 transition"
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