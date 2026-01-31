'use client';

import { useState } from 'react';

type Planificacion = {
  curso: string;
  escuela: string;
  fecha: string;
  detalle: string;
  link: string;
};

export default function ListaPlanificaciones() {
  const [lista, setLista] = useState<Planificacion[]>([]);
  const [nueva, setNueva] = useState<Planificacion>({
    curso: '',
    escuela: '',
    fecha: '',
    detalle: '',
    link: '',
  });

  const guardar = () => {
    if (
      nueva.curso.trim() &&
      nueva.escuela.trim() &&
      nueva.fecha.trim() &&
      nueva.detalle.trim() &&
      nueva.link.trim()
    ) {
      setLista([...lista, nueva]);
      setNueva({ curso: '', escuela: '', fecha: '', detalle: '', link: '' });
    }
  };

  return (
    <div className="p-4 space-y-6 bg-violet-300 min-h-225">
      <h2 className="text-2xl text-violet-700 font-bold">Planificaciones</h2>

      {/* Formulario */}
      <div className="bg-violet-100 p-4 rounded-xl space-y-3 shadow-md">
        <input
          type="text"
          placeholder="Curso (ej. 3°)"
          value={nueva.curso}
          onChange={(e) => setNueva({ ...nueva, curso: e.target.value })}
          className="w-full p-2 rounded border text-violet-500 border-violet-300"
        />
        <input
          type="text"
          placeholder="Escuela (ej. Escuela N°91)"
          value={nueva.escuela}
          onChange={(e) => setNueva({ ...nueva, escuela: e.target.value })}
          className="w-full p-2 rounded border text-violet-500 border-violet-300"
        />
        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
          className="w-full p-2 rounded border text-violet-500 border-violet-300"
        />
        <input
          type="text"
          placeholder="Detalle (ej. Unidad 1, semana 2...)"
          value={nueva.detalle}
          onChange={(e) => setNueva({ ...nueva, detalle: e.target.value })}
          className="w-full p-2 rounded border text-violet-500 border-violet-300"
        />
        <input
          type="url"
          placeholder="Enlace (Drive, PDF...)"
          value={nueva.link}
          onChange={(e) => setNueva({ ...nueva, link: e.target.value })}
          className="w-full p-2 rounded border text-violet-500 border-violet-300"
        />

        <button
          onClick={guardar}
          className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800"
        >
          Guardar planificación
        </button>
      </div>

      {/* Lista de planificaciones */}
      {lista.length > 0 && (
        <div className="space-y-4">
          {lista.map((plan, i) => (
            <div key={i} className="bg-white shadow p-4 rounded-xl border border-violet-200">
              <p className="text-violet-800 font-semibold">{plan.curso} - {plan.escuela}</p>
              <p className="text-sm text-violet-500 mb-1">{plan.fecha}</p>
              <p className="text-violet-900">{plan.detalle}</p>
              <a href={plan.link} target="_blank" className="text-yellow-600 poppins decoration-none underline mt-2 block">
                Ver planificación
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
