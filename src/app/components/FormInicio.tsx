"use client";

import { useState } from "react";
import GoogleButton from "./GoogleBoton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 👉 Acá luego conectás tu backend
    setTimeout(() => {
      setLoading(false);
      alert("Login simulado");
    }, 1000);
  };

  return (
    <div className="min-h-96 flex items-center justify-center px-4">
      <div className="w-full max-w-md  rounded-xl  p-8">
        <h1 className="text-2xl font-semibold text-yellow-200 text-center">
          Iniciar sesión
        </h1>

        <p className="text-sm text-white-500 text-center mt-2">
          Accedé a tu organizador
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm  text-white font-bold">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="
                mt-1 w-full rounded-lg border border-slate-300
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                bg-white font-bold text-violet-900
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm  text-white font-bold">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                mt-1 w-full rounded-lg border border-slate-300
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500  bg-white font-bold text-violet-900
              "
            />
          </div>
          <GoogleButton></GoogleButton>
          {/* BOTÓN */}
          <a
            type="submit"
            /*disabled={loading}*/
            href="/"
            className="
              w-full flex justify-center items-center
              rounded-lg bg-blue-600 text-white
              py-2 text-sm font-medium
              hover:bg-blue-700 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </a>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-yellow-200">
          ¿No tenés cuenta?{" "}
          <span className="text-violet-900 hover:underline cursor-pointer">
            Registrate
          </span><tr></tr>
        <strong className="bg-white text-red-800">Precioná ingresar para testear la prueba</strong>
        </div>
      </div>
    </div>
  );
}
