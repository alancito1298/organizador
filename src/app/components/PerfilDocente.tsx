'use client';

import { useEffect, useState } from 'react';




import PerfilResumen from './PerfilResumen';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

type Curso = {
  id: number;
  materia: string;
  escuela: string;
  anio: string;
};

type Perfil = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
};

type Suscripcion = {
  estado: string;
  fechaFin?: string;
  plan?: {
    nombre: string;
  };
};

export default function PerfilDocente() {

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [cursos, setCursos] =
    useState<Curso[]>([]);

  const [
    suscripcion,
    setSuscripcion,
  ] = useState<Suscripcion | null>(
    null
  );

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    setCargando(true);

    try {

      const token =
        localStorage.getItem(
          'token'
        );

      if (!token) return;

      const headers = {
        Authorization:
          `Bearer ${token}`,
      };

      // PERFIL
      const resPerfil =
        await fetch(
          `${API}/auth/me`,
          { headers }
        );

      const perfilData =
        await resPerfil.json();

      // CURSOS
      const resCursos =
        await fetch(
          `${API}/cursos`,
          { headers }
        );

      const cursosData =
        await resCursos.json();

      // SUSCRIPCIÓN
      const resSuscripcion =
        await fetch(
          `${API}/suscripciones/estado`,
          { headers }
        );

      const suscripcionData =
        await resSuscripcion.json();

      setPerfil(perfilData);

      setCursos(
        Array.isArray(cursosData)
          ? cursosData
          : []
      );

      setSuscripcion(
        suscripcionData
      );

    } catch (err) {

      console.error(err);

    } finally {

      setCargando(false);

    }
  };

  if (cargando) {

    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-violet-50
      ">
        <p className="
        text-violet-700
        animate-pulse
        text-lg
        ">
          Cargando perfil...
        </p>
      </div>
    );

  }

  return (

    <div className="
    min-h-screen
    bg-violet-50
    pb-32
    p-4
    w-full
    ">

      {/* HEADER */}
      <div className="
      bg-violet-950
      rounded-b-[40px]
      px-6
      py-12
      shadow-xl
      ">

        <div className="
        flex
        flex-col
        items-center
        text-center
        ">

          {/* AVATAR */}
          <div className="
          w-28
          h-28
          rounded-full
          bg-violet-300
          m-10
          flex
          items-center
          justify-center
          text-4xl
          font-bold
          text-violet-950
          shadow-lg
          mb-5
          ">
            {perfil?.nombre?.[0]}
            {perfil?.apellido?.[0]}
          </div>

          {/* NOMBRE */}
          <h1 className="
          text-xl
          uppercase
          text-white
          font-light
          ">
            {perfil?.nombre}{' '}
            {perfil?.apellido}
          </h1>

          {/* EMAIL */}
          <p className="
          text-violet-300
          text-sm
          mt-1
          ">
            {perfil?.email}
               {perfil?.id}
          </p>
          <p className="
          text-violet-400
          text-lg
            font-light
          mt-1
          ">
           ID: #001
               {perfil?.id}
          </p>

          {/* BADGE */}
          <div className="
          mt-5
          bg-violet-200
          text-violet-800
          px-5
          py-5
          rounded-full
          text-sm
          shadow
          font-medium
          mb-5 
          w-1/2
          
          ">
            🟢 {
              suscripcion?.estado ===
              'activa'
                ? 'Suscripción activa'
                : 'Sin suscripción'
            }
          </div>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="
        mx-5
        lg:mx-70
        lg:my-20
        lg:p-8
      ">
        {/* MENÚ */}
        
    <PerfilResumen></PerfilResumen>
          

       
      </div>

    </div>
  );
}