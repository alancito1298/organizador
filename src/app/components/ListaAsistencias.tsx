'use client';

import { JSX, useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

const estados = ['violeta', 'verde', 'rojo', 'gris'] as const;
type Estado = typeof estados[number];

const getNextEstado = (estado: Estado): Estado => {
  const index = estados.indexOf(estado);
  return estados[(index + 1) % estados.length];
};

const coloresTailwind: Record<Estado, string> = {
  violeta: 'bg-amber-300',
  verde: 'bg-green-500',
  rojo: 'bg-red-500',
  gris: 'bg-gray-400',
};

const iconos: Record<Estado, JSX.Element | null> = {
  violeta: null,
  verde: <ThumbsUp size={20} className="text-white mx-auto" />,
  rojo: <ThumbsDown size={20} className="text-white mx-auto" />,
  gris: <X size={20} className="text-white mx-auto" />,
};

const alumnos = Array(15).fill('Nombre Apellido');
const clases = Array.from({ length: 25 }, (_, i) => i + 1);

export default function AsistenciasTabla() {
  const [datos, setDatos] = useState<Estado[][]>(
    alumnos.map(() => clases.map(() => 'violeta'))
  );

  const cambiarEstado = (alumnoIndex: number, claseIndex: number) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        fila.map((estado, j) =>
          i === alumnoIndex && j === claseIndex ? getNextEstado(estado) : estado
        )
      )
    );
  };

  return (
    <div className="overflow-x-auto p-2 pb-96 ">
      <p className='text-center text-violet-600 font-bold uppercase'> toca los casilleros</p>
      <div className="min-w-max">
        <table className="table-fixed border-collapse gap-2">
          <thead>
            <tr>
              <th className="sticky left-0 bg-violet-200 border-none z-10 border flex flex-col items-end justify-end text-violet-900 p-2 w-20 text-left">
               <span>Clase:</span> 
                <span>Fecha:</span>
              </th>
              {clases.map((n) => (
                <th key={n} className=" border-2 p-1 border-violet-200  text-violet-900 text-center">
                  {n}<input className=' w-20 bg-violet-900 text-amber-300 rounded-l p-1'></input>
                </th>
              ))}  <button className='bg-gray-800 h-10 w-10'>G</button>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, i) => (
              <tr key={i}>
                <td className="sticky left-0 font-poppins font-700 border-violet-400 border-b-2 bg-violet-200 text-violet-900 ronde  w-20 text-m font-bold z-10">
                  {alumnos[i]}
                </td >
                {fila.map((estado, j) => (
                  <td
                    key={j}
                    className={` w-20 h-20 border-2 border-violet-400 cursor-pointer transition-colors duration-200 text-center ${coloresTailwind[estado]}`}
                    onClick={() => cambiarEstado(i, j)}
                  >
                    {iconos[estado]}
                  
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
