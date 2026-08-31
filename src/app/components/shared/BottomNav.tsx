"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { X, Calendar } from "lucide-react";
import AdBanner from "./AdBanner";

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type AgendaItem = {
  id: number;
  fecha: string;
  descripcion: string;
};

const BottomNav = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const [eventosHoy, setEventosHoy] = useState<AgendaItem[]>([]);
  const [eventosMañana, setEventosMañana] = useState<AgendaItem[]>([]);
  const [modalNotif, setModalNotif] = useState(false);
  const [modalIngreso, setModalIngreso] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    fetchAgenda();
  }, []);

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

      const hoyKey    = toKey(hoy);
      const mañanaKey = toKey(mañana);

      const hoyItems    = data.filter(i => i.fecha.split('T')[0] === hoyKey);
      const mañanaItems = data.filter(i => i.fecha.split('T')[0] === mañanaKey);

      setEventosHoy(hoyItems);
      setEventosMañana(mañanaItems);

      const yaVisto = sessionStorage.getItem('notif_modal_visto');
      if (hoyItems.length > 0 && !yaVisto) {
        setModalIngreso(true);
        sessionStorage.setItem('notif_modal_visto', '1');
      }
    } catch (err) {
      console.error('Error cargando agenda:', err);
    }
  };

  const totalNotif = eventosHoy.length + eventosMañana.length;

  return (
    <>
      {/* AdBanner flotante sobre el nav */}
      <div className={`fixed bottom-16 left-0 right-0 z-40 px-2 transition-transform duration-300 pointer-events-none ${visible ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <AdBanner />
        </div>
      </div>

      {/* BottomNavBar - nuevo diseño neumórfico */}
      <nav
        className={`md:hidden fixed bottom-unit left-1/2 -translate-x-1/2 z-50 flex gap-gutter items-center bg-surface-bg rounded-full px-gutter py-2 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all duration-300 ${
          visible ? "translate-y-0" : "translate-y-[200%]"
        }`}
      >
        {/* Back */}
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="flex flex-col items-center justify-center text-secondary p-2 hover:scale-110 transition-transform focus:outline-none"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          <span className="sr-only">Back</span>
        </button>

        {/* Home (active) */}
        <Link
          href="/home"
          aria-label="Home"
          className="flex flex-col items-center justify-center bg-surface-container-highest text-accent-violet rounded-full p-2 shadow-[inset_2px_2px_4px_#B8C6D9,inset_-2px_-2px_4px_#FFFFFF] scale-90 transition-all focus:outline-none"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          onClick={() => setModalNotif(true)}
          className="relative flex flex-col items-center justify-center text-secondary p-2 hover:scale-110 transition-transform focus:outline-none"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          {totalNotif > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalNotif}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </button>
      </nav>

      {/* MODAL NOTIFICACIONES */}
      {modalNotif && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-24">
          <div className="bg-surface-bg neumorphic-raised rounded-2xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-accent-violet flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">notifications</span>
                Notificaciones
              </h3>
              <button onClick={() => setModalNotif(false)} className="text-secondary hover:text-on-surface transition-colors">
                <X size={20} />
              </button>
            </div>

            {eventosHoy.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-accent-violet uppercase mb-2">📅 Hoy</p>
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
              className="w-full mt-2 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL AUTOMÁTICO AL INGRESAR */}
      {modalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-surface-bg neumorphic-raised rounded-2xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-accent-violet flex items-center gap-2">
                <Calendar size={18} /> Eventos de hoy
              </h3>
              <button onClick={() => setModalIngreso(false)} className="text-secondary hover:text-on-surface transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-secondary mb-3">
              Tenés {eventosHoy.length} evento{eventosHoy.length > 1 ? 's' : ''} agendado{eventosHoy.length > 1 ? 's' : ''} para hoy
            </p>

            <div className="flex flex-col gap-2 mb-4">
              {eventosHoy.map(e => (
                <div key={e.id} className="bg-surface-bg neumorphic-inset rounded-xl px-3 py-2 text-sm text-on-surface flex items-start gap-2">
                  <span className="text-accent-violet mt-0.5">•</span>
                  {e.descripcion}
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalIngreso(false)}
              className="w-full py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;