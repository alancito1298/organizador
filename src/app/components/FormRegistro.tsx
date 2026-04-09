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

  const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";
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

      if (!res.ok) {
        throw new Error("Error al registrarse");
      }

      setMensaje("✅ Cuenta creada correctamente");
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        provincia: "",
        localidad: "",
        fechaNacimiento: "",
      });
      router.push("/planes");
    } catch (error) {
      setMensaje("❌ Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg block m-auto w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>

      <label>Nombre</label>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Apellido</label>
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Contraseña</label>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Teléfono</label>
      <input
        type="tel"
        name="telefono"
        placeholder="000-0000"
        value={form.telefono}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Provincia</label>
      <input
        type="text"
        name="provincia"
        placeholder="Entre Ríos"
        value={form.provincia}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Localidad</label>
      <input
        type="text"
        name="localidad"
        placeholder="Villaguay"
        value={form.localidad}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg"
        required
      />

      <label>Fecha de nacimiento</label>
      <input
        type="date"
        name="fechaNacimiento"
        value={form.fechaNacimiento}
        onChange={handleChange}
        className="w-full mb-5 p-3 border rounded-lg"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Creando..." : "Registrarse"}
      </button>

      {mensaje && <p className="mt-4 text-center text-sm">{mensaje}</p>}
    </form>
  );
}