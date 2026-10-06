import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitud de Eliminación de Cuenta | Organizador Docente',
  description: 'Página de solicitud de eliminación de cuenta y datos de usuario en Organizador Docente conforme a las políticas de Google Play.',
};

export default function EliminarCuentaPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-950 tracking-tight">
              Eliminación de Cuenta y Datos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Organizador Docente • Transparencia y Control de Datos
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            De conformidad con las políticas de privacidad y protección del usuario de <strong>Google Play</strong>, los usuarios de <strong>Organizador Docente</strong> pueden solicitar la eliminación permanente de su cuenta y todos los datos asociados en cualquier momento.
          </p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-indigo-950 mb-2">
              Opción 1: Eliminación directa desde la Aplicación Móvil
            </h2>
            <p className="text-sm text-indigo-900 mb-2">
              Si tenés acceso a la app, podés eliminar tu cuenta de forma inmediata:
            </p>
            <ol className="list-decimal pl-5 text-sm space-y-1 text-indigo-900">
              <li>Abrí la app <strong>Organizador Docente</strong> e iniciá sesión.</li>
              <li>Ingresá a la pestaña <strong>Perfil</strong>.</li>
              <li>Desplazate hasta la sección <strong>Información Legal</strong>.</li>
              <li>Tocá el botón <strong>Eliminar mi cuenta y datos</strong> y confirmá la acción.</li>
            </ol>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Opción 2: Solicitud vía Correo Electrónico (Sin instalar la app)
            </h2>
            <p className="text-sm text-slate-700 mb-3">
              Si desinstalaste la aplicación o no podés ingresar, envianos un correo electrónico solicitando la baja de tu cuenta:
            </p>
            <div className="bg-white p-4 rounded-lg border border-slate-300 text-sm">
              <p><strong>Destinatario:</strong> <a href="mailto:organizadordocente710@gmail.com" className="text-indigo-600 underline">organizadordocente710@gmail.com</a></p>
              <p><strong>Asunto:</strong> Solicitud de eliminación de cuenta y datos</p>
              <p><strong>Cuerpo del mensaje:</strong> Indicar la dirección de correo electrónico con la que te registraste en la plataforma.</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              * La solicitud será procesada y confirmada dentro de las 48 horas hábiles.
            </p>
          </div>

          <section className="pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">¿Qué datos se eliminan?</h3>
            <ul className="list-disc pl-5 text-sm space-y-1.5 text-slate-600">
              <li>Tu perfil de docente (nombre, apellido, email, teléfono, contraseña).</li>
              <li>Todos tus cursos, divisiones, materias y escuelas registradas.</li>
              <li>Todas las listas de alumnos vinculadas a tus cursos.</li>
              <li>El historial completo de asistencias tomadas.</li>
              <li>Todas las calificaciones, notas y evaluaciones registradas.</li>
              <li>Tus horarios, agenda y planificaciones pedagógicas.</li>
            </ul>
          </section>

          <section className="pt-2">
            <h3 className="text-lg font-bold text-slate-900 mb-2">¿Se conserva algún dato?</h3>
            <p className="text-sm text-slate-600">
              <strong>No se conserva ningún dato personal ni académico.</strong> Toda la información se elimina de forma permanente y definitiva de nuestras bases de datos en un plazo máximo de 30 días tras la confirmación de la solicitud.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
