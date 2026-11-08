import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos del Servicio | Organizador Docente',
  description: 'Términos y Condiciones de Uso del servicio Organizador Docente.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-950 tracking-tight">
              Términos del Servicio
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Última actualización: Noviembre de 2026
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="space-y-8 text-base leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al registrarse, acceder o utilizar la plataforma <strong>Organizador Docente</strong> (a través de su versión web en organizadordocente.com o mediante la aplicación móvil Android distribuida en Google Play Store), usted acepta estar sujeto a estos Términos del Servicio y a nuestra Política de Privacidad. Si no está de acuerdo con alguno de estos términos, no debe utilizar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Descripción del Servicio</h2>
            <p>
              Organizador Docente es una herramienta de gestión académica diseñada para docentes y educadores. Permite la administración de cursos, materias, horarios de cursada, listas de estudiantes, registro de calificaciones, toma de asistencia diaria y agenda pedagógica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cuentas de Usuario y Seguridad</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Toda actividad realizada bajo su cuenta es de su exclusiva responsabilidad.</li>
              <li>El usuario se compromete a proporcionar información verídica y mantenerla actualizada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Planes y Suscripciones</h2>
            <p className="mb-2">
              Organizador Docente ofrece planes gratuitos con límites de uso y planes de suscripción de pago (Premium) con funcionalidades ampliadas y sin anuncios publicitarios:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Los pagos y suscripciones se gestionan de forma segura a través de pasarelas de pago autorizadas (como Mercado Pago).</li>
              <li>El usuario puede cancelar o gestionar su suscripción en cualquier momento desde su panel de perfil.</li>
              <li>Nos reservamos el derecho de modificar las tarifas de los planes previo aviso a los usuarios suscritos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Uso Aceptable y Responsabilidad de Datos</h2>
            <p>
              El docente declara que cuenta con las facultades necesarias para cargar datos organizativos relacionados con su actividad pedagógica (listas de alumnos, notas y asistencia). Queda terminantemente prohibido utilizar el servicio para fines ilícitos, transmitir código malicioso o vulnerar la privacidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual del software, diseño, logotipos y código fuente corresponden exclusivamente a los desarrolladores de Organizador Docente. El contenido académico y organizativo cargado por los docentes permanece bajo la titularidad del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de actualizar, modificar o discontinuar funciones del servicio para incorporar mejoras o cumplir normativas legales vigentes. Las modificaciones sustanciales serán notificadas a través de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Contacto</h2>
            <p>
              Para cualquier consulta legal, duda sobre estos términos o asistencia técnica, puede comunicarse a través del correo de soporte: <strong>organizadordocente710@gmail.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

