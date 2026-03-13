'use client';

import { useState } from 'react';

type Alumno = {
  nombre: string;
  apellido: string;
  contacto: string;
};

export default function TablaAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([
    { nombre: 'nombre', apellido: 'apellido', contacto: '2342-5000' },
    { nombre: 'nombre', apellido: 'apellido', contacto: '2342-5000' },
    { nombre: 'nombre', apellido: 'apellido', contacto: '2342-5000' },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAlumno, setNuevoAlumno] = useState<Alumno>({
    nombre: '',
    apellido: '',
    contacto: '',
  });

  const agregarAlumno = () => {
    if (
      nuevoAlumno.nombre.trim() &&
      nuevoAlumno.apellido.trim() &&
      nuevoAlumno.contacto.trim()
    ) {
      setAlumnos([...alumnos, nuevoAlumno]);
      setNuevoAlumno({ nombre: '', apellido: '', contacto: '' });
      setMostrarFormulario(false);
    }
  };

  return (
    <div className="overflow-x-auto max-w-full m-4 min-h-200 ">
         <h4 className='text-violet-900 text-xl m-2 font-bebas font-bold'>E.E.T n°79</h4>
      <h3 className='text-violet-500 font-light m-2  uppercase text-3xl'>5to Matematica</h3>
   
      <table className="min-w-full border-collapse  p-2 text-center">
        <thead>
          <tr className="bg-blue-300 text-white">
            <th className= " bg-violet-900 rounded-tl-xl px-4 py-2">NOMBRE</th>
            <th className=" bg-violet-900   px-4 py-2">APELLIDO</th>
            <th className=" bg-violet-900 rounded-tr-xl  px-4 py-2">CONTACTO</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a, i) => (
            <tr key={i} className="bg-white hover:bg-violet-200">
              <td className="border text-violet-900 border-yellow-500 bg-yellow-100  uppercase px-4 py-2">{a.apellido}</td>
              <td className="border text-violet-900 border-yellow-500 bg-yellow-100  uppercase px-4 py-2">{a.nombre}</td>
              <td className="border text-violet-900 border-yellow-500 bg-yellow-100  uppercase px-4 py-2">{a.contacto}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="w-full bg-violet-900 rounded-b-xl hover:bg-yellow-300 text-4xl font-bold py-4 text-yellow-200"
              >
                +
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    

      {mostrarFormulario && (
        <div className="mt-4 bg-yellow-100 border border-violet-400 p-4 rounded-lg shadow w-full max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-3 text-violet-900">Agregar Alumno</h3>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoAlumno.nombre}
            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
            className=" mb-6 border border-violet-400 rounded px-3 py-1  w-full text-violet-900"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={nuevoAlumno.apellido}
            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })}
            className=" mb-6 border border-violet-400 rounded px-3 py-1  w-full text-violet-900"
          />
          <input
            type="text"
            placeholder="Contacto"
            value={nuevoAlumno.contacto}
            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, contacto: e.target.value })}
            className=" mb-6 border border-violet-400 rounded px-3 py-1  w-full text-violet-900"
          />

          <button
            onClick={agregarAlumno}
            className= "bg-violet-900 text-yellow-100 px-4 py-2 rounded w-full"
          >
            Guardar Alumno
          </button>
        </div>
      )}
    </div>
  );
}