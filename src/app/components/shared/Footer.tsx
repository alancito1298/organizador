'use client';

import Link from 'next/link';
import Image from 'next/image';
import ShareAndInstallButtons from './ShareAndInstallButtons';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full py-16 px-4 sm:px-6 border-t border-slate-800 font-mulish">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Image src="/odicono.svg" alt="Organizador Docente" width={28} height={28} className="brightness-0 invert" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              Organizador <span className="text-accent-violet">Docente</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            La plataforma definitiva para el docente. Simplificamos tu gestión pedagógica y administrativa para que puedas dedicarte a enseñar.
          </p>
          <div className="flex gap-2 mt-2">
            <ShareAndInstallButtons />
          </div>
        </div>

        {/* Modules Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Módulos Escolares</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/cursos">Mis Cursos</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/agenda">Agenda Docente</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/horario">Grilla de Horarios</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/planificaciones">Planificaciones Didácticas</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/perfil">Mi Perfil</Link></li>
          </ul>
        </div>

        {/* Pricing Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Acceso y Planes</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li><a className="text-slate-400 hover:text-white transition-colors" href="#precios">Plan Inicial Gratis</a></li>
            <li><a className="text-slate-400 hover:text-white transition-colors" href="#precios">Plan Plus Docente</a></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/registro">Crear Cuenta Gratis</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/login">Iniciar Sesión</Link></li>
            <li><Link className="text-slate-400 hover:text-white transition-colors" href="/recuperar">Recuperar Contraseña</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Seguridad y Ayuda</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li><span className="text-slate-400">Modo Offline en el Aula</span></li>
            <li><span className="text-slate-400">Exportación Segura a Excel</span></li>
            <li><span className="text-slate-400">Copias en la Nube Encriptadas</span></li>
            <li>
              <a
                className="text-slate-400 hover:text-white transition-colors"
                href="https://cv-sigma-umber.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contacto y Soporte
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <span>Términos y Condiciones</span>
          <span>Políticas de Privacidad</span>
          <a
            className="hover:text-slate-400 transition-colors"
            href="https://cv-sigma-umber.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contacto
          </a>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1">
          <p>© 2026 Organizador Docente. Todos los derechos reservados.</p>
          <p className="text-[10px] text-slate-600">
            Diseñado y desarrollado por{" "}
            <a
              href="https://cv-sigma-umber.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:underline"
            >
              Alan G. Amarillo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}