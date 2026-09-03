"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import GoogleButton from "./GoogleBoton";
import { setToken } from "../../../lib/token";

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

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

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

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (mensajeError) setMensajeError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    if (form.password !== form.repetirPassword) {
      setMensajeError("Las contraseñas no coinciden. Por favor revisalas.");
      return;
    }

    if (form.password.length < 6) {
      setMensajeError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { repetirPassword, ...body } = form;

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          email: body.email.trim(),
          nombre: body.nombre.trim(),
          apellido: body.apellido.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear la cuenta. Verifica los datos.");
      }

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
      }

      setMensajeExito("¡Cuenta creada exitosamente! Redirigiendo a tus planes...");
      setTimeout(() => {
        router.push("/planes");
      }, 1000);
    } catch (error: any) {
      setMensajeError(error.message || "Error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsNoCoinciden = form.repetirPassword && form.password !== form.repetirPassword;

  return (
    <div className="w-full max-w-xl mx-auto font-mulish">
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 sm:p-10 border border-white/60 shadow-xl flex flex-col gap-6">
        {/* Header con Isotipo */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="inline-flex p-3 rounded-2xl neumorphic-inset text-accent-violet hover:scale-105 transition-transform mb-1">
            <Image src="/odicono.svg" alt="Organizador Docente" width={38} height={38} priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full neumorphic-inset text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
            Plan 100% Gratis Disponible
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Comenzá a organizar tus clases
          </h1>
          <p className="text-xs sm:text-sm text-secondary font-medium max-w-md">
            Creá tu cuenta docente en menos de un minuto y llevá el control de tus cursos, asistencias y notas.
          </p>
        </div>

        {/* Mensajes de Alerta */}
        {mensajeError && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{mensajeError}</span>
          </div>
        )}

        {mensajeExito && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Botón de Google */}
        <div className="flex flex-col gap-2">
          <GoogleButton />
          <div className="flex items-center gap-3 my-1">
            <div className="h-px bg-outline-variant/30 flex-1"></div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">o registrate con tus datos</span>
            <div className="h-px bg-outline-variant/30 flex-1"></div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* NOMBRE Y APELLIDO (2 COLUMNAS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Nombre
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  person
                </span>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  autoComplete="given-name"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="apellido" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Apellido
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  badge
                </span>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  autoComplete="family-name"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  className="w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* EMAIL Y TELÉFONO (2 COLUMNAS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="docente@ejemplo.com"
                  required
                  className="w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="telefono" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Teléfono / WhatsApp
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  call
                </span>
                <input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  autoComplete="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="11 2345-6789"
                  required
                  className="w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* PROVINCIA Y LOCALIDAD (2 COLUMNAS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="provincia" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Provincia
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  map
                </span>
                <select
                  id="provincia"
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-11 pr-8 rounded-2xl neumorphic-inset bg-surface-bg border-none text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium appearance-none cursor-pointer"
                >
                  <option value="">Seleccioná provincia</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-sm">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="localidad" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Localidad
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  location_city
                </span>
                <input
                  id="localidad"
                  type="text"
                  name="localidad"
                  value={form.localidad}
                  onChange={handleChange}
                  placeholder="Ciudad o Barrio"
                  required
                  className="w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* FECHA DE NACIMIENTO */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fechaNacimiento" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
              Fecha de Nacimiento
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                calendar_today
              </span>
              <input
                id="fechaNacimiento"
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                required
                className="w-full py-3 pl-11 pr-4 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
              />
            </div>
          </div>

          {/* CONTRASEÑAS (2 COLUMNAS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full py-3 pl-11 pr-11 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-main p-1 focus:outline-none"
                  aria-label={mostrarPassword ? "Ocultar" : "Mostrar"}
                >
                  <span className="material-symbols-outlined text-lg">
                    {mostrarPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="repetirPassword" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                  lock_reset
                </span>
                <input
                  id="repetirPassword"
                  type={mostrarPassword ? "text" : "password"}
                  name="repetirPassword"
                  autoComplete="new-password"
                  value={form.repetirPassword}
                  onChange={handleChange}
                  placeholder="Repetí tu clave"
                  required
                  className={`w-full py-3 pl-11 pr-3 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none font-medium ${
                    passwordsNoCoinciden ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-accent-violet/50"
                  }`}
                />
              </div>
            </div>
          </div>
          {passwordsNoCoinciden && (
            <p className="text-red-500 text-xs font-bold -mt-2">Las contraseñas no coinciden.</p>
          )}

          {/* BOTÓN REGISTRARSE */}
          <button
            type="submit"
            disabled={loading || Boolean(passwordsNoCoinciden)}
            className="w-full mt-3 py-3.5 rounded-2xl bg-accent-violet text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-accent-violet/25 hover:bg-accent-violet/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando tu cuenta...
              </>
            ) : (
              <>
                <span>Crear mi cuenta gratis</span>
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Card */}
        <div className="text-center text-xs text-secondary pt-2 border-t border-violet-100/60">
          ¿Ya tenés una cuenta creada?{" "}
          <Link href="/login" className="font-extrabold text-accent-violet hover:underline ml-1">
            Iniciá sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}