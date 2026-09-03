import type { Metadata } from 'next';
import PlanillaCursoClient from '@/app/components/cursos/PlanillaCursoClient';

export const metadata: Metadata = {
  title: 'Planilla Trimestral de Curso',
  description: 'Planilla completa por trimestre con asistencia, concepto y calificaciones de los alumnos.',
  robots: { index: false, follow: true },
};

export default function PlanillaPage() {
  return <PlanillaCursoClient />;
}
