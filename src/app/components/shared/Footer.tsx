'use client';

import Link from 'next/link';
import Image from 'next/image';
import ShareAndInstallButtons from './ShareAndInstallButtons';

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary w-full py-xl px-margin-desktop border-t border-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-xl">
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-md">
          <div className="flex items-center gap-sm">
            <Image src="/odicono.svg" alt="Organizador Docente" width={32} height={32} className="brightness-0 invert" />
            <span className="font-headline-md text-headline-md font-bold text-on-primary">Organizador Docente</span>
          </div>
          <p className="font-body-md text-sm text-on-primary/80 leading-relaxed">
            La herramienta definitiva para el docente moderno. Simplificamos tu gestión administrativa para que puedas enfocarte en lo que más importa: enseñar.
          </p>
          <div className="flex gap-sm mt-sm">
            <ShareAndInstallButtons />
          </div>
        </div>

        {/* Modules Column */}
        <div className="flex flex-col gap-md">
          <h4 className="font-headline-md text-lg text-white">Módulos de Gestión</h4>
          <ul className="flex flex-col gap-sm">
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/cursos">Mis Cursos</Link></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/agenda">Agenda</Link></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/horario">Grilla de Horarios</Link></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/planificaciones">Planificaciones</Link></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/perfil">Perfil</Link></li>
          </ul>
        </div>

        {/* Pricing Column */}
        <div className="flex flex-col gap-md">
          <h4 className="font-headline-md text-lg text-white">Planes y Precios</h4>
          <ul className="flex flex-col gap-sm">
            <li><a className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="#precios">Plan Gratis</a></li>
            <li><a className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="#precios">Plan Básico</a></li>
            <li><a className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="#precios">Plan Plus</a></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/registro">Crear Cuenta</Link></li>
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/login">Iniciar Sesión</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-md">
          <h4 className="font-headline-md text-lg text-white">Soporte y Seguridad</h4>
          <ul className="flex flex-col gap-sm">
            <li><Link className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="/recuperar">Recuperar Contraseña</Link></li>
            <li><a className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="https://www.organizadordocente.com">Sitio Oficial</a></li>
            <li><span className="text-on-primary/70 text-sm">Exportación Segura</span></li>
            <li><span className="text-on-primary/70 text-sm">Datos Protegidos</span></li>
            <li><a className="text-on-primary/70 hover:text-white hover:underline transition-colors text-sm" href="https://cv-sigma-umber.vercel.app/" target="_blank" rel="noopener noreferrer">Centro de Ayuda</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-lg border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-wrap justify-center md:justify-start gap-md">
          <span className="text-on-primary/60 hover:text-white text-xs transition-colors cursor-pointer">Privacidad</span>
          <span className="text-on-primary/60 hover:text-white text-xs transition-colors cursor-pointer">Términos de Uso</span>
          <a className="text-on-primary/60 hover:text-white text-xs transition-colors" href="https://cv-sigma-umber.vercel.app/" target="_blank" rel="noopener noreferrer">Contacto</a>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-on-primary/60 text-xs">© 2026 Organizador Docente. Todos los derechos reservados.</p>
          <p className="text-on-primary/40 text-[10px] uppercase tracking-widest">Desarrollado por <a href="https://cv-sigma-umber.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline text-on-primary/60">Alan G. Amarillo</a></p>
        </div>
      </div>
    </footer>
  );
}