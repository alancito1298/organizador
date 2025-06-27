'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

type Feriado = {
  date: string;
  name: string;
};

export default function Agenda() {
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [anotaciones, setAnotaciones] = useState<Record<string, string[]>>({});
  const [nuevaNota, setNuevaNota] = useState<Record<string, string>>({});
  const [feriados, setFeriados] = useState<Feriado[]>([]);

  const year = dayjs().year();

  // 🟡 Cargar feriados desde API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const obtenerFeriados = async () => {
      try {
        const res = await fetch(`https://argentina-publicholidays-api.vercel.app/api/v1/holidays?year=${year}`);
        const data = await res.json();
        setFeriados(data);
      } catch (error) {
        console.error('Error al obtener feriados:', error);
      }
    };

    obtenerFeriados();
  }, [year]);

  const seleccionarMes = (index: number) => {
    setMesSeleccionado(index);
  };

  const manejarCambio = (dia: number, valor: string) => {
    const clave = `${mesSeleccionado}-${dia}`;
    setNuevaNota((prev) => ({ ...prev, [clave]: valor }));
  };

  const agregarAnotacion = (dia: number) => {
    const clave = `${mesSeleccionado}-${dia}`;
    const nota = nuevaNota[clave]?.trim();
    if (!nota) return;

    setAnotaciones((prev) => ({
      ...prev,
      [clave]: [...(prev[clave] || []), nota],
    }));
    setNuevaNota((prev) => ({ ...prev, [clave]: '' }));
  };

  const eliminarAnotacion = (clave: string, index: number) => {
    setAnotaciones((prev) => {
      const nuevas = [...(prev[clave] || [])];
      nuevas.splice(index, 1);
      return { ...prev, [clave]: nuevas };
    });
  };

  const esFeriado = (fecha: string) => feriados.find((f) => f.date === fecha);

  return (
    <div className="p-4 pb-76">
      {!mesSeleccionado && (
        <div className="grid grid-cols-2 gap-4">
          {meses.map((mes, index) => (
            <button
              key={index}
              onClick={() => seleccionarMes(index)}
              className="bg-violet-200 text-violet-900 rounded-lg p-4 h-20 shadow-amber-300 font-extralight text-2xl hover:bg-violet-300"
            >
              {mes}
            </button>
          ))}
        </div>
      )}

      {mesSeleccionado !== null && (
        <div>
          <h2 className="text-4xl text-center text-amber-300 font-light uppercase mb-4">
            {meses[mesSeleccionado]}
          </h2>

          <button
            onClick={() => setMesSeleccionado(null)}
            className="mb-4 text-violet-200 text-2xl"
          >
            ← Volver a los meses
          </button>

          {(() => {
            const diasEnEsteMes = dayjs(`${year}-${mesSeleccionado + 1}`, 'YYYY-M').daysInMonth();

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(diasEnEsteMes)].map((_, dia) => {
                  const numeroDia = dia + 1;
                  const clave = `${mesSeleccionado}-${numeroDia}`;
                  const fechaCompleta = dayjs(`${year}-${mesSeleccionado + 1}-${numeroDia}`).format('YYYY-MM-DD');
                  const feriado = esFeriado(fechaCompleta);

                  return (
                    <div
                      key={dia}
                      className={`p-3 border rounded shadow ${
                        feriado ? 'bg-red-100 border-red-400' : 'bg-white border-purple-200'
                      }`}
                    >
                      <div className="font-semibold text-4xl text-start my-4 text-violet-900">
                        <span className={`p-3 h-20 w-20 mr-4 mb-4 rounded-full text-white inline-block text-center ${
                          feriado ? 'bg-red-600' : 'bg-violet-900'
                        }`}>
                          {numeroDia}
                        </span>
                        <small className="text-sm align-middle">
                          de {meses[mesSeleccionado]}
                        </small>
                      </div>

                      {feriado && (
                        <p className="text-red-700 text-sm font-medium mb-2">
                          🎉 {feriado.name}
                        </p>
                      )}

                      {/* Lista de anotaciones */}
                      {anotaciones[clave]?.length > 0 && (
                        <ul className="mb-2 text-violet-200 text-md uppercase">
                          {anotaciones[clave].map((nota, i) => (
                            <li key={i} className="flex justify-between items-center bg-violet-900 px-2 py-1 rounded mb-1">
                              <span className="flex-1">{nota}</span>
                              <button
                                onClick={() => eliminarAnotacion(clave, i)}
                                className="text-red-600 font-bold ml-2"
                              >
                                ❌
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Textarea nueva nota */}
                      <textarea
                        placeholder="Escribí una nueva anotación..."
                        value={nuevaNota[clave] || ''}
                        onChange={(e) => manejarCambio(numeroDia, e.target.value)}
                        className="w-full border rounded text-violet-950 border-violet-900 px-2 py-1 text-sm mb-2"
                      />

                      <button
                        onClick={() => agregarAnotacion(numeroDia)}
                        className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700"
                      >
                        Agregar anotación
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
