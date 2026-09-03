"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Usuario {
  nombre: string;
  apellido: string;
}

type AgendaItem = {
  id: number;
  fecha: string;
  descripcion: string;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

const NAV_LINKS = [
  { label: "Inicio",          href: "/home", isExternal: false },
  { label: "Agenda",          href: "/agenda", isExternal: false },
  { label: "Cursos",          href: "/cursos", isExternal: false },
  { label: "Planificaciones", href: "/planificaciones", isExternal: false },
  { label: "Ayuda",           href: "https://cv-sigma-umber.vercel.app/", isExternal: true },
];

export default function Navbar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalNotif, setModalNotif] = useState(false);
  const [eventosHoy, setEventosHoy] = useState<AgendaItem[]>([]);
  const [eventosMañana, setEventosMañana] = useState<AgendaItem[]>([]);
  const pathname = usePathname();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    fetchUsuario();
  }, []);

  useEffect(() => {
    const fetchAgenda = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API}/agenda`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: AgendaItem[] = await res.json();
        if (!Array.isArray(data)) return;
        const hoy    = new Date();
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const toKey = (d: Date) => d.toISOString().split('T')[0];
        setEventosHoy(data.filter(i => i.fecha.split('T')[0] === toKey(hoy)));
        setEventosMañana(data.filter(i => i.fecha.split('T')[0] === toKey(mañana)));
      } catch (err) {
        console.error('Error cargando agenda:', err);
      }
    };
    fetchAgenda();
  }, []);

  const totalNotif = eventosHoy.length + eventosMañana.length;

  return (
    <>
    <header className="fixed top-0 left-0 right-0 w-full z-50 h-20 bg-surface-bg shadow-[0px_4px_10px_rgba(163,177,198,0.3)]">
      <div className="h-full w-full flex justify-between items-center px-4 sm:px-6 md:px-margin-desktop">

        {/* Brand: Logo a la izquierda (en mobile solo icono, en desktop icono + nombre) */}
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="neumorphic-raised w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shrink-0">
            <Image src="/odicono.svg" alt="Organizador Docente" width={28} height={28} priority />
          </div>
          <span className="font-headline-md text-headline-md tracking-tight text-primary-container hidden md:block select-none uppercase">
            Organizador Docente
          </span>
        </Link>

        {/* Desktop Nav Links + Actions */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              if (link.isExternal) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-text-main hover:text-primary-container hover:bg-white/20"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "neumorphic-inset text-primary-container font-bold"
                      : "text-text-main hover:text-primary-container hover:bg-white/20"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Notificaciones */}
          <button
            aria-label="Notificaciones"
            onClick={() => setModalNotif(true)}
            className="neumorphic-raised w-9 h-9 rounded-full flex items-center justify-center text-text-main hover:text-primary-container relative hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            {totalNotif > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-violet text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalNotif}
              </span>
            )}
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-3 border-l border-outline-variant/40">
            {usuario && (
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[11px] font-bold text-primary-container tracking-wider uppercase">
                  {usuario.nombre}
                </span>
                <span className="text-[11px] font-bold text-primary-container tracking-wider uppercase">
                  {usuario.apellido}
                </span>
                <span className="text-secondary text-[9px] uppercase tracking-wider">Docente</span>
              </div>
            )}
            <Link
              href="/perfil"
              aria-label="Perfil"
              title="Mi Perfil"
              className="neumorphic-raised w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-primary-container"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_circle
              </span>
            </Link>
            <button
              onClick={cerrarSesion}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="neumorphic-raised w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-text-main hover:text-red-600"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
            </button>
          </div>
        </div>

        {/* Mobile: botón menú a la derecha */}
        <button
          className="md:hidden neumorphic-raised w-10 h-10 rounded-xl flex items-center justify-center text-text-main active:scale-95 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className="material-symbols-outlined text-[24px]">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-surface-bg shadow-[0px_8px_20px_rgba(163,177,198,0.4)] z-50 px-4 sm:px-6 py-4 flex flex-col gap-2 animate-in fade-in duration-150">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            if (link.isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all text-text-main hover:text-primary-container"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "neumorphic-inset text-primary-container font-bold"
                    : "text-text-main hover:text-primary-container"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMenuOpen(false);
              cerrarSesion();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:text-red-600 hover:bg-white/20 transition-all text-left"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>

    {/* MODAL NOTIFICACIONES */}
    {modalNotif && (
      <div className="fixed inset-0 z-[100] flex items-start justify-end pt-24 pr-8 bg-black/20" onClick={() => setModalNotif(false)}>
        <div
          className="bg-surface-bg neumorphic-raised rounded-2xl w-full max-w-sm p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">notifications</span>
              Notificaciones
            </h3>
            <button onClick={() => setModalNotif(false)} className="text-secondary hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {eventosHoy.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-primary-container uppercase mb-2">📅 Hoy</p>
              <div className="flex flex-col gap-2">
                {eventosHoy.map(e => (
                  <div key={e.id} className="bg-surface-bg neumorphic-inset rounded-xl px-3 py-2 text-sm text-on-surface">
                    {e.descripcion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {eventosMañana.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-secondary uppercase mb-2">📅 Mañana</p>
              <div className="flex flex-col gap-2">
                {eventosMañana.map(e => (
                  <div key={e.id} className="bg-surface-bg neumorphic-inset rounded-xl px-3 py-2 text-sm text-on-surface-variant">
                    {e.descripcion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalNotif === 0 && (
            <p className="text-center text-secondary text-sm py-4">No hay eventos para hoy ni mañana</p>
          )}

          <button
            onClick={() => setModalNotif(false)}
            className="w-full mt-2 py-2 rounded-xl bg-surface-bg neumorphic-raised text-primary-container font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Cerrar
          </button>
        </div>
      </div>
    )}
  </>
  );
}