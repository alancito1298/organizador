'use client';

import { useEffect, useState } from 'react';
import { ArrowBigLeft, ArrowBigRight, Pin, Siren } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type AgendaItem = { id: number; fecha: string; descripcion: string };

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const toKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const hoyKey = () => {
  const h = new Date();
  return toKey(h.getFullYear(), h.getMonth(), h.getDate());
};

export default function AgendaCalendario() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [year, setYear]   = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const [modalAgregar, setModalAgregar]           = useState(false);
  const [modalVer, setModalVer]                   = useState(false);
  const [diaSeleccionado, setDiaSeleccionado]     = useState<string>('');
  const [notasDia, setNotasDia]                   = useState<AgendaItem[]>([]);
  const [descripcion, setDescripcion]             = useState('');
  const [guardando, setGuardando]                 = useState(false);
  const [eliminandoId, setEliminandoId]           = useState<number | null>(null);

  useEffect(() => { fetchAgenda(); }, []);

  const fetchAgenda = async () => {
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/agenda`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: AgendaItem[] = await res.json();
    setAgendaItems(data);
  };

  const diasConNotas = new Set(
    agendaItems.map((i) => i.fecha.split('T')[0])
  );

  // Construir grilla del mes
  const primerDia   = new Date(year, month, 1);
  const ultimoDia   = new Date(year, month + 1, 0).getDate();
  // Lunes = 0 ... Domingo = 6
  let offsetInicio  = primerDia.getDay() - 1;
  if (offsetInicio < 0) offsetInicio = 6;

  const celdas: (number | null)[] = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: ultimoDia }, (_, i) => i + 1),
  ];
  // Rellenar hasta múltiplo de 7
  while (celdas.length % 7 !== 0) celdas.push(null);

  const navMes = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  const handleClickDia = (dia: number) => {
    const key   = toKey(year, month, dia);
    const notas = agendaItems.filter((i) => i.fecha.split('T')[0] === key);
    setDiaSeleccionado(key);
    if (notas.length > 0) {
      setNotasDia(notas);
      setModalVer(true);
    } else {
      setDescripcion('');
      setModalAgregar(true);
    }
  };

  const guardarNota = async () => {
    if (!descripcion.trim() || !diaSeleccionado) return;
    setGuardando(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/agenda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha: new Date(diaSeleccionado + 'T12:00:00').toISOString(),
          descripcion: descripcion.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setModalAgregar(false);
      setDescripcion('');
      await fetchAgenda();
    } catch { alert('❌ Error al guardar'); }
    finally { setGuardando(false); }
  };

  const eliminarNota = async (id: number) => {
    setEliminandoId(id);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/agenda/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setNotasDia((prev) => prev.filter((n) => n.id !== id));
      await fetchAgenda();
    } catch { alert('❌ Error al eliminar'); }
    finally { setEliminandoId(null); }
  };

  const formatDia = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto select-none bg-violet-900 min-h-screen">

      {/* ── HEADER MES ── */}
     
      <h2 className="text-4xl pt-10 text-start font-bold text-violet-200 uppercase tracking-wide">
          {MESES[month]} <span className='font-extralight text-yellow-200'>{year}</span>
        </h2>
      {/* ── CABECERA DÍAS ── */}
      <div className="grid grid-cols-7 mb-1 bg-violet-200">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-violet-950 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── GRILLA ── */}
      <div className="grid grid-cols-7 sm:m-2  gap-1">
        {celdas.map((dia, idx) => {
          if (!dia) return <div key={`empty-${idx}`} />;

          const key       = toKey(year, month, dia);
          const esHoy     = key === hoyKey();
          const tieneNota = diasConNotas.has(key);
          const oscuro    = dia % 2 === 1;

          return (
            <button
              key={key}
              onClick={() => handleClickDia(dia)}
              className="  font-extralight text-8xl   rounded aspect-square transition-transform active:scale-95"
              style={{
                backgroundColor: esHoy
                  ? 'violet'
                  : oscuro ? '#c4b5fd' : '#ede9fe',
                color: esHoy || !oscuro ? '#4c1d95' : 'white',
                fontWeight: esHoy ? 800 : 600,
                fontSize: esHoy ? "1.2rem" : "0.85rem",
                boxShadow: esHoy ? '0 0 0 2px #7c3aed' : undefined,
              }}
            >  {dia}
             
              {tieneNota && (<div className=''>
              <Siren className='text-red-500'/>
            
              </div> )}
            
              
            </button>
          );
        })}
      </div>

      <div className='fixed bottom-50 left-0 right-0'>
      <div className="flex items-center min-w-screen justify-around bg-none ">
        <button
          onClick={() => navMes(-1)}
          className="w-16 h-16 rounded  bg-yellow-200 text-violet-950 flex items-center justify-center text-lg hover:bg-violet-800 transition"
        ><ArrowBigLeft /></button>
        <button
          onClick={() => navMes(1)}
          className="w-16 h-16 rounded bg-yellow-200 text-violet-950 flex items-center justify-center text-lg hover:bg-violet-800 transition"
        ><ArrowBigRight/></button>
      </div>
      </div>
      {/* ── MODAL AGREGAR ── */}
      {modalAgregar && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm">
            <h3 className="text-base font-bold text-violet-900 mb-1 text-center">📝 Nueva nota</h3>
            <p className="text-xs text-gray-500 text-center mb-3 capitalize">{formatDia(diaSeleccionado)}</p>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribí tu nota..."
              rows={3}
              className="w-full border border-violet-300 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <div className="flex gap-2 justify-center mt-3">
              <button onClick={() => setModalAgregar(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
                Cancelar
              </button>
              <button onClick={guardarNota} disabled={guardando || !descripcion.trim()}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 text-sm font-medium disabled:opacity-60">
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL VER NOTAS ── */}
      {modalVer && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm">
            <h3 className="text-base font-bold text-violet-900 mb-1 text-center">📅 Notas</h3>
            <p className="text-xs text-gray-500 text-center mb-3 capitalize">{formatDia(diaSeleccionado)}</p>

            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto mb-3">
              {notasDia.map((nota) => (
                <div key={nota.id} className="flex items-start justify-between bg-violet-50 rounded-xl p-2 gap-2">
                  <p className="text-sm text-violet-900 flex-1">{nota.descripcion}</p>
                  <button onClick={() => eliminarNota(nota.id)} disabled={eliminandoId === nota.id}
                    className="text-red-400 hover:text-red-600 transition shrink-0 text-xs">
                    {eliminandoId === nota.id ? '...' : '🗑️'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <button onClick={() => setModalVer(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
                Cerrar
              </button>
              <button onClick={() => { setModalVer(false); setDescripcion(''); setModalAgregar(true); }}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 text-sm font-medium">
                + Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}