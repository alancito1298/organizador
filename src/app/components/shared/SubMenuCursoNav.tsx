'use client';

import React from 'react';
import Link from 'next/link';

interface Props {
  cursoId: number;
  seccionActual: 'alumnos' | 'asistencia' | 'calificaciones' | 'planilla';
  materia?: string;
  escuela?: string;
  anio?: string;
}

const formatearGradoCurso = (anio: string | number | undefined) => {
  if (!anio) return '';
  const str = String(anio).trim();
  const lower = str.toLowerCase();
  if (lower.includes('año') || lower.includes('grado') || lower.includes('to') || lower.includes('do') || lower.includes('ro') || lower.includes('er')) {
    return str;
  }
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    const nombres: Record<number, string> = {
      1: '1er Año',
      2: '2do Año',
      3: '3er Año',
      4: '4to Año',
      5: '5to Año',
      6: '6to Año',
      7: '7mo Año',
    };
    return nombres[num] || `${num}° Año`;
  }
  return `${str}° Año`;
};

export default function SubMenuCursoNav({ cursoId, seccionActual, materia, escuela, anio }: Props) {
  const tabs = [
    {
      id: 'alumnos',
      label: 'Alumnos',
      icon: 'groups',
      href: `/sub-menu-curso/${cursoId}/alumnos`,
    },
    {
      id: 'asistencia',
      label: 'Asistencia',
      icon: 'how_to_reg',
      href: `/sub-menu-curso/${cursoId}/asistencia`,
    },
    {
      id: 'calificaciones',
      label: 'Calificaciones',
      icon: 'grade',
      href: `/sub-menu-curso/${cursoId}/calificaciones`,
    },
    {
      id: 'planilla',
      label: 'Planilla Trimestral',
      icon: 'table_chart',
      href: `/sub-menu-curso/${cursoId}/planilla`,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 mb-6">
      {/* Sub-Navegación de Secciones del Curso */}
      <div className="bg-surface-bg neumorphic-raised rounded-2xl p-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 border border-white/60 shadow-sm">
        <div className="flex items-center gap-1 min-w-max w-full">
          {tabs.map((tab) => {
            const activa = seccionActual === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex-1 min-w-[120px] sm:min-w-[140px] py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-center ${
                  activa
                    ? 'bg-accent-violet text-white shadow-md font-extrabold scale-[1.02]'
                    : 'text-secondary hover:text-accent-violet hover:bg-violet-50/50'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activa ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
