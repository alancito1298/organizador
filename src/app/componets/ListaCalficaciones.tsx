'use client';

import { useState } from 'react';
import { Input } from '../../../node_modules/postcss/lib/postcss';

const alumnos = Array(15).fill('Nombre Apellido');
const trimestres = ['1° TRIMESTRE', '2° TRIMESTRE', '3° TRIMESTRE'];
const notasPorTrimestre = 4;

const columnas = trimestres.flatMap((t) =>
  Array.from({ length: notasPorTrimestre }, (_, i) => ({
    trimestre: t,
    label: `${t} - ${i + 1}`,
  }))
);

export default function TablaNotasTrimestres() {
  const [datos, setDatos] = useState<string[][]>(
    alumnos.map(() => columnas.map(() => ''))
  );

  const handleInputChange = (alumnoIndex: number, colIndex: number, value: string) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        fila.map((celda, j) =>
          i === alumnoIndex && j === colIndex ? value : celda
        )
      )
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="min-w-max">
        <table className="border-collapse border-none table-">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-purple-700 text-white p-2 w-12 border-none">
                Nombre
              </th>
              {trimestres.map((t, ti) => (
                <th
                  key={ti}
                  colSpan={notasPorTrimestre}
                  className="text-center bg-purple-300 text-purple-900 w-10 font-semibold border-none"
                >
                  {t}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky left-0 z-10 bg-purple-700 p-2 border-none" />
              {columnas.map((col, i) => (
                <th key={i} className="text-xs  bg-purple-900 text-purple-100 border-none p-1">
          <select name="examen" id="1">
            <option value="">EVALUACION</option>
            <option value="">TRABAJO PRÁCTICO</option>
            <option value="">OTRO</option>
            </select> <br />
            <input type="text" className='text-violet-100 text-xl text-center'></input>
                </th>
                
              ))}
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
