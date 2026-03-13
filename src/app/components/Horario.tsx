'use client';

import { useState } from 'react';

type FilaHorario = {
  hora: string;
  dias: string[];
};

export default function Horario() {
  const [horario, setHorario] = useState<FilaHorario[]>([
    { hora: '', dias: ['', '', '', '', ''] },
  ]);

  const agregarFila = () => {
    setHorario([...horario, { hora: '', dias: ['', '', '', '', ''] }]);
  };

  const actualizarHora = (index: number, valor: string) => {
    const nuevoHorario = [...horario];
    nuevoHorario[index].hora = valor;
    setHorario(nuevoHorario);
  };

  const actualizarDia = (filaIndex: number, diaIndex: number, valor: string) => {
    const nuevoHorario = [...horario];
    nuevoHorario[filaIndex].dias[diaIndex] = valor;
    setHorario(nuevoHorario);
  };

  return (
    <div className="p-6 min-h-200">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">Horario semanal editable</h2>

      <div className="overflow-x-auto border border-violet-400 rounded-lg ">
        <table className="border-collapse w-300 min-w-[700px] ">
          <thead>
            <tr>
              <th className="sticky left-0 bg-violet-200 border w-48 border-violet-400 text-violet-900 p-2 z-10">
                Hora
              </th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Lunes</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Martes</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Miércoles</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Jueves</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Viernes</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Sábado</th>
              <th className="border border-violet-400 bg-yellow-200 text-violet-900 p-2 w-96">Domingo</th>
            </tr>
          </thead>
          <tbody>
            {horario.map((fila, filaIndex) => (
              <tr key={filaIndex}>
                <td className="sticky left-0 bg-white border border-violet-300 p-2 z-10">
                  <input
                    type="text"
                    placeholder="Ej: 08:00 - 09:00"
                    value={fila.hora}
                    onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                    className="border border-violet-300 rounded p-1 w-full text-violet-900"
                  />
                </td>
                {fila.dias.map((dia, diaIndex) => (
                  <td key={diaIndex} className="border border-violet-300 p-2">
                    <input
                      type="text"
                      placeholder="Comentario / Materia"
                      value={dia}
                      onChange={(e) =>
                        actualizarDia(filaIndex, diaIndex, e.target.value)
                      }
                      className="border border-violet-300 rounded p-1 w-full text-violet-900"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={agregarFila}
        className="mt-4 bg-violet-700 text-white px-4 py-2 rounded w-full hover:bg-violet-800"
      >
        + Agregar fila
      </button>
    </div>
  );
}
