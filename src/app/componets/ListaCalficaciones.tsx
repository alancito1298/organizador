'use client';

import { useState } from 'react';

const alumnos = Array(15).fill('Nombre Apellido');

type Columna = {
  tipo: string;
  trimestre: string;
  fecha: string;
};

export default function TablaNotasEditable() {
  const [columnas, setColumnas] = useState<Columna[]>([
    { tipo: '', trimestre: '', fecha: '' },
    { tipo: '', trimestre: '', fecha: '' },
    { tipo: '', trimestre: '', fecha: '' },
  ]);

  const [datos, setDatos] = useState<string[][]>(
    alumnos.map(() => Array(3).fill(''))
  );

  const agregarColumna = () => {
    setColumnas((prev) => [...prev, { tipo: '', trimestre: '', fecha: '' }]);
    setDatos((prev) => prev.map((fila) => [...fila, '']));
  };

  const handleInputChange = (alumnoIndex: number, colIndex: number, value: string) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        fila.map((celda, j) =>
          i === alumnoIndex && j === colIndex ? value : celda
        )
      )
    );
  };

  const handleColumnaChange = (
    index: number,
    campo: keyof Columna,
    value: string
  ) => {
    setColumnas((prev) =>
      prev.map((col, i) =>
        i === index ? { ...col, [campo]: value } : col
      )
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="min-w-max">
        <table className="border-collapse border-none">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-purple-700 text-white p-2 w-48 border-none">
                Nombre
              </th>
              {columnas.map((_, i) => (
                <th key={i} className="text-xs bg-purple-900 text-purple-100 border-none p-1 w-36">
                  <select
                    className="bg-violet-800 rounded-xl text-sm w-full mb-1"
                    value={columnas[i].tipo}
                    onChange={(e) => handleColumnaChange(i, 'tipo', e.target.value)}
                  >
                    <option value="">EVALUACIÓN</option>
                    <option value="TP">TRABAJO PRÁCTICO</option>
                    <option value="OTRO">OTRO</option>
                    <option value="FINAL">FINAL</option>
                  </select>
                  <select
                    className="bg-yellow-500 text-violet-900 rounded-xl text-sm w-full mb-1"
                    value={columnas[i].trimestre}
                    onChange={(e) => handleColumnaChange(i, 'trimestre', e.target.value)}
                  >
                    <option value="">Trimestre</option>
                    <option value="1">1° Trimestre</option>
                    <option value="2">2° Trimestre</option>
                    <option value="3">3° Trimestre</option>
                    <option value="Mesa">Mesa</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Fecha"
                    className="text-violet-100 text-sm bg-violet-700 w-full rounded px-1"
                    value={columnas[i].fecha}
                    onChange={(e) => handleColumnaChange(i, 'fecha', e.target.value)}
                  />
                </th>
              ))}
              {/* Botón + */}
              <th className='bg-yellow-500 w-24'>
                <button
                  onClick={agregarColumna}
                  className="text-violet-900 px-3 py-1  text-2xl h-full font-light hover:bg-green-700"
                  title="Agregar columna"
                >
                  + 
              
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, i) => (
              <tr key={i}>
                <td className="sticky left-0 z-10 bg-purple-600 text-white border px-2 py-1 w-48">
                  {alumnos[i]}
                </td>
                {fila.map((valor, j) => (
                  <td key={j} className="border p-1 bg-purple-100">
                    <input
                      type="text"
                      value={valor}
                      onChange={(e) => handleInputChange(i, j, e.target.value)}
                      className="w-full h-10 text-center text-violet-900 text-xl font-bold border border-none rounded bg-white outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
