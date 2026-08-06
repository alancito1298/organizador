"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Home, Bell, ArrowLeft, X, Calendar } from "lucide-react";

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

      const hoy      = new Date();
      const mañana   = new Date();
      mañana.setDate(mañana.getDate() + 1);

      const toKey = (d: Date) => d.toISOString().split('T')[0];

      const hoyKey    = toKey(hoy);
      const mañanaKey = toKey(mañana);

      const hoyItems    = data.filter(i => i.fecha.split('T')[0] === hoyKey);
      const mañanaItems = data.filter(i => i.fecha.split('T')[0] === mañanaKey);

      setEventosHoy(hoyItems);
      setEventosMañana(mañanaItems);

      // Modal automático solo si hay eventos HOY y no se mostró antes
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
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 border-t border-violet-950 shadow-xl transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        } md:translate-y-0`}
      >
        <div className="max-w-md mx-auto flex justify-center items-center gap-10 h-16">

          <button
            onClick={() => router.back()}
            className="text-violet-950 rounded-2xl border-2 bg-violet-100 p-1"
          >
            <ArrowLeft size={35} />
          </button>

          <Link href="/home" className="text-violet-950 rounded-2xl border-2 bg-violet-100 p-1">
            <Home size={40} />
          </Link>

          {/* BOTÓN NOTIFICACIONES */}
          <button
            onClick={() => setModalNotif(true)}
            className="relative text-violet-950 rounded-2xl border-2 bg-violet-100 p-1"
          >
            <Bell size={32} />
            {totalNotif > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalNotif}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* MODAL NOTIFICACIONES (desde botón) */}
      {modalNotif && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-20">
          <div className="bg-white mb-40 rounded-2xl shadow-2xl w-full max-w-sm p-5">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2">
                <Bell size={18} /> Notificaciones
              </h3>
              <button onClick={() => setModalNotif(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* HOY */}
            {eventosHoy.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-violet-700 uppercase mb-2">📅 Hoy</p>
                <div className="flex flex-col gap-2">
                  {eventosHoy.map(e => (
                    <div key={e.id} className="bg-violet-50 rounded-xl px-3 py-2 text-sm text-violet-900">
                      {e.descripcion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAÑANA */}
            {eventosMañana.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-violet-500 uppercase mb-2">📅 Mañana</p>
                <div className="flex flex-col gap-2">
                  {eventosMañana.map(e => (
                    <div key={e.id} className="bg-violet-50 rounded-xl px-3 py-2 text-sm text-violet-700">
                      {e.descripcion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalNotif === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No hay eventos para hoy ni mañana</p>
            )}

            <button
              onClick={() => setModalNotif(false)}
              className="w-full mt-2 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition font-medium text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL AUTOMÁTICO AL INGRESAR (solo si hay eventos hoy) */}
      {modalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white/80 h-1/2 rounded-2xl shadow-2xl w-full flex flex-col justify-arround max-w-sm p-5">

            <div className="flex justify-between items-center mb-3 m-6">
              <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2">
                <Calendar size={18} /> Eventos de hoy
              </h3>
              <button onClick={() => setModalIngreso(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-violet-600 mb-3 m-6 ">Tenés {eventosHoy.length} evento{eventosHoy.length > 1 ? 's' : ''} agendado{eventosHoy.length > 1 ? 's' : ''} para hoy</p>

            <div className="flex flex-col text-lg gap-2 mb-4 h-1/2 m-6">
              {eventosHoy.map(e => (
                <div key={e.id} className="bg-violet-50 rounded-xl px-3 py-2 text-lg text-violet-900 flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  {e.descripcion}
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalIngreso(false)}
              className="w-auto py-2 rounded-xl bg-violet-600 m-4 text-white hover:bg-violet-700 transition font-medium text-sm"
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