// components/Agenda.tsx
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Recordatorio = {
  id: string;
  fecha: string; // YYYY-MM-DD
  nota: string;
  asunto: string;
};

export default function Agenda() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [fecha, setFecha] = useState('');
  const [asunto, setAsunto] = useState('');
  const [nota, setNota] = useState('');

  // Cargar recordatorios desde localStorage al iniciar
  useEffect(() => {
    const data = localStorage.getItem('recordatorios');
    if (data) setRecordatorios(JSON.parse(data));
  }, []);

  // Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
  }, [recordatorios]);

  const agregarRecordatorio = () => {
    if (!fecha || !nota) return;

    const nuevo: Recordatorio = {
      id: uuidv4(),
      fecha,
      asunto,
      nota,
    };

    setRecordatorios([...recordatorios, nuevo]);
    setFecha('');
    setAsunto('');
    setNota('');
    
  };

  const eliminar = (id: string) => {
    setRecordatorios(recordatorios.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 min-h-180">
      <h2 className="text-2xl uppercase mb-4">Agenda</h2>

      {/* Formulario */}
      <div className="mb-4 bg-yellow-400 p-3 rounded-l">
     <label htmlFor="fecha" className='uppercase m-3 text-violet-900 font-bebas'style={{ fontFamily: 'Bebas Neue' }}>fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="border-none bg-yellow-100 text-violet-900  p-1 h-12  m-2 rounded-l px-2 py-1 mr-2 w-auto min-w-8/9"
        />
           <label className='font-atma' style={{ fontFamily: 'Atma Bold' }}>Asunto</label>
        <input
          type="text"
          placeholder="Asunto?"
          value={asunto}
          onChange={e => setAsunto(e.target.value)}
          className="border-none bg-yellow-100 text-violet-900 p-1 h-12  m-2 rounded-l px-2 py-1 mr-2  min-w-8/9"
        />
       
        <input
          type="text"
          placeholder="Escribe la nota..."
          value={nota}
          onChange={e => setNota(e.target.value)}
          className="border-none bg-yellow-100 text-violet-900 p-1  h-12 m-2  rounded-l px-2 py-1 mr-2 w-auto min-w-8/9"
        />
        <button onClick={agregarRecordatorio} className="bg-violet-900 m-4 text-white px-4 py-1 rounded">
          Agregar
        </button>
      </div>
 <h5 className='text-xl mb-10 mt-15 bg-violet-900 p-3 rounded-l'>Fechas Importantes!!!</h5>
      {/* Lista de fechas programadas */}
      <ul className="space-y-2">
        {recordatorios.map(r => {
            const dateObj = new Date(r.fecha);
            const diaSemana = dateObj.toLocaleDateString('es-AR',{
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            return (
              <li key={r.id} className="flex justify-between items-center text-gray-800 bg-gray-100 px-4 py-2 rounded">
                <div>
                 {diaSemana}<br /> <strong className='uppercase text-violet-900'>{r.asunto}</strong> 
                  <br /> {r.nota}
                </div>
                <button onClick={() => eliminar(r.id)} className="text-red-500 hover:underline">
                  Eliminar
                </button>
              </li>
            );
            })}
      </ul>
    </div>
  );
}
