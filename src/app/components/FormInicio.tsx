"use client";

import { useState } from "react";
import GoogleButton from "./GoogleBoton";
import { setToken } from "../../lib/token";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch("https://backend-organizador.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        throw new Error("Credenciales incorrectas");
      }
  
      const data = await res.json();

      setToken(data.access_token);
  
      window.location.replace("/home");
    } catch (error) {
      alert("Error al iniciar sesión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-8/9  flex  items-center justify-center bg-none mt-20 ">
      
        

        <form onSubmit={handleSubmit} className="mt-6 p-8  border-2 bg-violet-100 border-violet-300 space-y-5">
          {/* EMAIL */}
          <h1 className="text-4xl uppercase font-extralight mt-8 text-violet-950 text-center">
          Iniciar sesión
        </h1>

        <p className="text-sm font-semibold text-white-500 text-center mt-2 text-violet-800 ">
          Accedé a tu organizador
        </p>
          <div>
            <label className="block text-sm text-violet-800 font-bold">
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
            <label className="block text-sm text-violet-800 font-bold">
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
                focus:border-blue-500 bg-white font-bold text-violet-900
              "
            />
          </div>

          <GoogleButton />

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex justify-center items-center
              rounded-lg bg-violet-950 text-white
              py-2 text-sm font-medium
              hover:bg-blue-700 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <span className="text-violet-900 hover:underline font-bold cursor-pointer">
            <a href="/registro">Registrate</a>
          </span>
          <br />
         
        </div>
        </form>

  
        
      </div>
   
  );
}