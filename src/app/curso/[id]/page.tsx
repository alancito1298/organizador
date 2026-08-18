import { redirect } from 'next/navigation';

export default function CursoIndex({ params }: { params: { id: string } }) {
  redirect(`/curso/${params.id}/asistencia`);
}
