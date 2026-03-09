import { redirect } from 'next/navigation';

export default function CursoIndex({ params }: { params: { id: string } }) {
  redirect(`/sub-menu-curso/${params.id}/asistencia`);
}