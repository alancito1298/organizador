'use client';

import { useEffect, useState } from 'react';

import {
  ShieldCheck,
  GraduationCap,
  Users,
  Flame,
  ArrowRight,
  Calendar1,
  Calendar
} from 'lucide-react';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

type Perfil = {
  id: number;
  nombre: string;
  apellido: string;
};

type Resumen = {

    diasUsandoSistema: number;
  
    totalCursos: number;
  
    totalAlumnos: number;
  
    totalAsistencias: number;
  
    totalCalificaciones: number;
  
    totalHorarios: number;
  
    totalPlanificaciones: number;
  
  };

type Curso = {
  id: number;
};

type Suscripcion = {
  estado: string;
  plan?: {
    nombre: string;
  };
};

export default function PerfilResumen() {

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);
    const [resumen, setResumen] =
  useState<Resumen | null>(
    null
  );
    const [totalAlumnos, setTotalAlumnos] =
    useState(0);

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
  
      // DASHBOARD
      const resResumen =
        await fetch(
          `${API}/dashboard/resumen`,
          { headers }
        );
  
      const resumenData =
        await resResumen.json();
  
      // TOTAL ALUMNOS
      let total = 0;
  
      for (const curso of cursosData) {
  
        const res =
          await fetch(
            `${API}/inscripciones/curso/${curso.id}`,
            { headers }
          );
  
        const alumnos =
          await res.json();
  
        if (
          Array.isArray(alumnos)
        ) {
  
          total += alumnos.length;
  
        }
  
      }
  
      setTotalAlumnos(total);
  
      // STATES
      setPerfil(
        perfilData
      );
  
      setCursos(
        Array.isArray(
          cursosData
        )
          ? cursosData
          : []
      );
  
      setSuscripcion(
        suscripcionData
      );
  
      setResumen(
        resumenData
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
      bg-[#f7f5ff]
      ">
        <p className="
        text-violet-700
        animate-pulse
        ">
          Cargando perfil...
        </p>
      </div>
    );

  }

  return (

    <div className="
    min-h-screen
    bg-[#f7f5ff]
    p-4
    pb-32
    
    ">

      {/* TARJETA SUSCRIPCIÓN */}
      <div className="
     
      rounded-3xl
      shadow-sm
      p-5
      border
     
      ">

        {/* HEADER */}
        <div className="
        flex
        items-center
        justify-between
        mb-5
        
        ">

          <div className="
          flex
          items-center
          p-2
          ">

            <ShieldCheck
              size={18}
              className="
              text-violet-600
              "
            />

            <h2 className="
            text-violet-700
            font-semibold
            ">
              Suscripción
            </h2>

          </div>

          <div className="
          bg-violet-100
          text-violet-700
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          uppercase
          ">
          pro
          </div>

        </div>

        {/* GRID */}
        <div className="
        grid
        grid-cols-2
        gap-3
        mb-5
        ">

          {/* ESTADO */}
          <div className="
          bg-gray-50
          rounded-2xl
          p-4
          border
          border-gray-100
          ">

            <p className="
            text-xs
            text-gray-400
            uppercase
            mb-1
            ">
              Estado
            </p>

            <p className="
            text-violet-900
            font-bold
            text-lg
            ">
              {
                suscripcion?.estado ===
                'activa'
                  ? 'Activa'
                  : 'Inactiva'
              }
            </p>

          </div>

          {/* PLAN */}
          <div className="
          bg-gray-50
          rounded-2xl
          p-4
          border
          border-gray-100
          ">

            <p className="
            text-xs
            text-gray-400
            uppercase
            mb-1
            ">
              Plan
            </p>

            <p className="
            text-violet-900
            font-bold
            text-lg
            ">
              {
                suscripcion?.plan
                  ?.nombre ??
                'Free'
              }
            </p>

          </div>

        </div>

        {/* BOTÓN */}
        <button
          className="
          w-full
          bg-violet-600
          hover:bg-violet-700
          transition
          text-white
          rounded-2xl
          py-4
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          shadow-lg
          "
        >

          Cancelar Suscripción

          <ArrowRight
            size={18}
          />

        </button>

      </div>

      {/* STATS */}
      <div className="
      grid
      grid-cols-2
      gap-4
      mt-10
      ">

        {/* CURSOS */}
        <div className=" p-
        bg-violet-950
    
        rounded-3xl
    
     
        flex
        flex-col
        justify-between
        relative
        overflow-hidden
        ">
             <Users
            className="
            absolute
            top-5
            right-5
            text-violet-100
            "
            size={22}
          />
        

          <div />

          <div className='m-3'>

            <h3 className="
            text-6xl
            
            text-violet-100
            leading-none
            font-light  
            ">
              {cursos.length}
            </h3>

            <p className="
            text-violet-300
            text-xs
            uppercase
            font-semibold
            mt-2
            ">
              Cursos activos
            </p>

          </div>

        </div>

        {/* ALUMNOS */}
        <div className=" p-
        bg-violet-950
        rounded-3xl
        p-5
        min-h-[180px]
        flex
        flex-col
        justify-between
        relative
        overflow-hidden
        
        ">

         
  <GraduationCap
            className="
            absolute
            top-5
            right-5
            text-violet-100
            "
            size={22}
          />
          <div />

          <div className='m-3'>

            <h3 className="
            text-6xl
            font-light  
            text-violet-100
            leading-none
            ">
             {totalAlumnos}
            </h3>

            <p className="
            text-violet-300
            text-xs
            uppercase
            font-semibold
            mt-2
            ">
              Estudiantes
            </p>

          </div>

        </div>

         {/* DIAS */}
         <div className=" p-
        bg-violet-950
        rounded-3xl
        p-5
        min-h-[180px]
        flex
        flex-col
        justify-between
        relative
        overflow-hidden
        
        ">

         
<Flame 
            className="
            absolute
            top-5
            right-5
            text-violet-100
            "
            size={22}
          />
          <div />

          <div className='m-3'>

            <h3 className="
            text-6xl
            font-light  
            text-violet-100
            leading-none
            ">
             {
    resumen?.diasUsandoSistema
  } 
            </h3>

            <p className="
            text-violet-300
            text-xs
            uppercase
            font-semibold
            mt-2
            ">
              Dias online
            </p>

          </div>

        </div>
 {/* CICLO LECTIVO */}
 <div className=" p-
        bg-violet-950
        rounded-3xl
        p-5
        min-h-[180px]
        flex
        flex-col
        justify-between
        relative
        overflow-hidden
        
        ">

         
<Calendar1 
            className="
            absolute
            top-5
            right-5
            text-violet-100
            "
            size={22}
          />
          <div />

          <div className='m-3'>

            <h3 className="
            text-6xl
            font-light  
            text-violet-100
            leading-none
            ">
             2026
            </h3>

            <p className="
            text-violet-300
            text-xs
            uppercase
            font-semibold
            mt-2
            ">
             CICLO LECTIVO
            </p>

          </div>

        </div>
      </div>
      <button className='text-violet-950 uppercase text-xl text-center flex items-center justify-center rounded-2xl mt-10 h-20 w-full border '><Calendar></Calendar>Nuevo Año</button>
    
    </div>
  );
}