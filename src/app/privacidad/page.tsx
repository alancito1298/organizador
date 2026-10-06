import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Organizador Docente',
  description: 'Política de Privacidad y Tratamiento de Datos de Organizador Docente.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-950 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Última actualización: Octubre de 2026
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
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introducción</h2>
            <p>
              En <strong>Organizador Docente</strong> (disponible en web y aplicaciones móviles Android), valoramos y respetamos la privacidad de nuestros usuarios. Esta Política de Privacidad describe qué información recopilamos, cómo la utilizamos y qué controles tienen los usuarios sobre sus datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Información que recopilamos</h2>
            <p className="mb-2">Para brindar las funcionalidades del sistema, recopilamos la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Datos de la cuenta del docente:</strong> Nombre, apellido, dirección de correo electrónico y contraseña encriptada (o identificador de autenticación de Google si se utiliza inicio de sesión social).
              </li>
              <li>
                <strong>Información académica y pedagógica:</strong> Cursos, materias, divisiones, horarios, asistencias, calificaciones, agenda y planificaciones creadas y gestionadas exclusivamente por el docente.
              </li>
              <li>
                <strong>Datos de los estudiantes ingresados por el docente:</strong> Nombres y apellidos de alumnos, y opcionalmente número de documento o datos de contacto estrictamente necesarios para el seguimiento escolar.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Finalidad del tratamiento de datos</h2>
            <p className="mb-2">Los datos se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Permitir el acceso seguro a la plataforma y sincronizar la información entre dispositivos.</li>
              <li>Facilitar la organización de clases, cómputo de asistencias y registro de evaluaciones.</li>
              <li>Garantizar el correcto funcionamiento técnico y la seguridad del servicio.</li>
            </ul>
            <p className="mt-3 font-semibold text-slate-800">
              Nunca vendemos ni compartimos datos personales con terceros para fines publicitarios o comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Seguridad y almacenamiento</h2>
            <p>
              Toda la comunicación entre la aplicación móvil, la plataforma web y nuestros servidores se realiza mediante protocolos seguros y cifrados (HTTPS / SSL). Las contraseñas se almacenan mediante algoritmos de hash criptográfico unidireccional (bcrypt) y los tokens de sesión se guardan de forma segura en el almacenamiento protegido del dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Eliminación de cuenta y retención de datos</h2>
            <p className="mb-3">
              El usuario tiene el derecho total de solicitar y efectuar la eliminación de su cuenta y todos sus datos asociados en cualquier momento:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Desde la aplicación móvil:</strong> Ingresando a la pestaña <em>Perfil</em> &gt; <em>Información Legal</em> &gt; <em>Eliminar mi cuenta y datos</em>. Esta acción borra de forma permanente e irreversible la cuenta del docente y todos los cursos, listas de alumnos, asistencias y calificaciones vinculadas.
              </li>
              <li>
                <strong>Vía correo electrónico:</strong> Enviando una solicitud de eliminación a{' '}
                <a
                  href="mailto:organizadordocente710@gmail.com"
                  className="text-indigo-600 underline font-medium"
                >
                  organizadordocente710@gmail.com
                </a>
                . La solicitud será procesada dentro de las 48 horas hábiles.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contacto</h2>
            <p>
              Si tenés dudas, consultas o sugerencias sobre esta Política de Privacidad o el tratamiento de tus datos, podés contactarnos a:{' '}
              <a
                href="mailto:organizadordocente710@gmail.com"
                className="text-indigo-600 underline font-medium"
              >
                organizadordocente710@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
