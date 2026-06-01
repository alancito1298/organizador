'use client';

import { useState } from 'react';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

export function usePerfilAlumno() {
  const [perfil, setPerfil] =
    useState<any>(null);

  const [cargando, setCargando] =
    useState(false);

  const cargarPerfil =
    async (
      alumnoCursoId: number
    ) => {
      try {
        setCargando(true);

        const token =
          localStorage.getItem(
            'token'
          );

        const res =
          await fetch(
            `${API}/alumnos/perfil/${alumnoCursoId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setPerfil(data);

        return data;
      } finally {
        setCargando(false);
      }
    };

  return {
    perfil,
    cargando,
    cargarPerfil,
  };
}