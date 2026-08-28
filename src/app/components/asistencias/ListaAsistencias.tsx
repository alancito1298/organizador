'use client';

import { useEffect, useState, JSX } from 'react';
import { useParams } from 'next/navigation';
import {
  exportarExcelAsistencias
} from '../../utils/exportarExcelAsitencias';
import { exportarInformeCursoPdf } from '../../utils/exportarInformePdf';
import { enqueueSyncAction } from '@/app/utils/offlineSync';
import {
  ThumbsUp,
  ThumbsDown,
  X,
  Clock,
  ListPlus,
  Sheet,
  Download,
  FileText
} from 'lucide-react';

import Cargando from '../shared/Cargando';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

type EstadoVisual =
  | 'vacio'
  | 'presente_buen_concepto'
  | 'presente_mal_concepto'
  | 'ausente'
  | 'justificada';

type AlumnoCurso = {
  id: number;
  alumno: {
    id: number;
    nombre: string;
    apellido: string;
  };
};

type Asistencia = {
  id: number;
  fecha: string;
  estado: string;
  alumnoCursoId: number;
};

const ciclo: EstadoVisual[] = [
  'vacio',
  'presente_buen_concepto',
  'presente_mal_concepto',
  'ausente',
  'justificada',
];

const colores: Record<
  EstadoVisual,
  string
> = {
  vacio:
    'bg-gray-200',

  presente_buen_concepto:
    'bg-green-500',

  presente_mal_concepto:
    'bg-orange-400',

  ausente:
    'bg-red-500',

  justificada:
    'bg-cyan-400',
};

const iconos: Record<
  EstadoVisual,
  JSX.Element | null
> = {
  vacio: <p className='text-gray-800'>-</p>,

  presente_buen_concepto:
    <ThumbsUp
      size={15}
      className="
      text-white
      bg-green-600
      w-10
      h-10
      rounded-full
      p-1
      mx-auto
    
      "
    />,

  presente_mal_concepto:
    <ThumbsDown
      size={5}
      className="
      text-white
      bg-red-800
      w-10
      h-10
      rounded-full
      p-1
      mx-auto
      "
    />,

  ausente:
    <X
      size={20}
      className="
    
      w-10
      h-10
      rounded-full
      p-1
      
      mx-auto
      text-red-900
      border
      border-red-900

      "
    />,

  justificada:
    <Clock
      size={20}
      className="
      bg-blue-300
      w-10
      h-10
      rounded-full
      p-1
      mx-auto
    
      text-blue-800
      "
    />,
};

const estadoBackendAVisual = (
  estado: string
): EstadoVisual => {

  if (
    estado ===
    'presente_buen_concepto'
  ) {
    return 'presente_buen_concepto';
  }

  if (
    estado ===
    'presente_mal_concepto'
  ) {
    return 'presente_mal_concepto';
  }

  if (
    estado ===
    'ausente'
  ) {
    return 'ausente';
  }

  if (
    estado ===
    'justificada'
  ) {
    return 'justificada';
  }

  return 'vacio';

};

const estadoVisualABackend = (
  estado: EstadoVisual
): string | null => {

  switch (estado) {

    case 'vacio':
      return null;

    case 'presente_buen_concepto':
      return 'presente_buen_concepto';

    case 'presente_mal_concepto':
      return 'presente_mal_concepto';

    case 'ausente':
      return 'ausente';

    case 'justificada':
      return 'justificada';

    default:
      return null;

  }

};

const getSiguienteEstado = (
  estado: EstadoVisual
): EstadoVisual => {

  const idx =
    ciclo.indexOf(estado);

  return ciclo[
    (idx + 1) % ciclo.length
  ];

};

export default function AsistenciasTabla() {

  const params =
    useParams();

  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const cursoId =
    Number(rawId);

  const [
    guardadoOk,
    setGuardadoOk
  ] = useState(false);

  const [
    inscripciones,
    setInscripciones
  ] = useState<
    AlumnoCurso[]
  >([]);

  const [
    fechas,
    setFechas
  ] = useState<string[]>([
    new Date()
      .toISOString()
      .split('T')[0]
  ]);

  const [
    datos,
    setDatos
  ] = useState<
    EstadoVisual[][]
  >([]);

  const [
    asistenciaIds,
    setAsistenciaIds
  ] = useState<
    (number | null)[][]
  >([]);

  const [
    guardando,
    setGuardando
  ] = useState(false);

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    trimestre,
    setTrimestre
  ] = useState(1);

  const [
    curso,
    setCurso
  ] = useState<any>(null);
  // =====================
  // CARGA INICIAL
  // =====================

  const fetchData = async () => {
    if (!cursoId) {
      setCargando(false);
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // CURSO
      const resCurso = await fetch(`${API}/cursos/${rawId}`, { headers });
      const cursoData = await resCurso.json();
      setCurso(cursoData);

      // ALUMNOS
      const resAlumnos = await fetch(`${API}/inscripciones/curso/${rawId}`, { headers });
      const alumnosData: AlumnoCurso[] = await resAlumnos.json();
      alumnosData.sort((a, b) => a.alumno.apellido.localeCompare(b.alumno.apellido));

      // ASISTENCIAS
      const resAsistencias = await fetch(
        `${API}/asistencias/curso/${rawId}?trimestre=${trimestre}`,
        { headers }
      );
      const asistenciasData: Asistencia[] = await resAsistencias.json();

      // FECHAS
      const fechasSet = new Set<string>();
      for (const a of asistenciasData) {
        fechasSet.add(a.fecha.split('T')[0]);
      }
      const fechasOrdenadas = [...fechasSet].sort().reverse();

      // MATRICES
      const matriz: EstadoVisual[][] = [];
      const idsMatriz: (number | null)[][] = [];

      for (const insc of alumnosData) {
        const filaEstados: EstadoVisual[] = [];
        const filaIds: (number | null)[] = [];

        if (fechasOrdenadas.length === 0) {
          filaEstados.push('vacio');
          filaIds.push(null);
        } else {
          for (const fecha of fechasOrdenadas) {
            const asist = asistenciasData.find(
              (a) => a.alumnoCursoId === insc.id && a.fecha.startsWith(fecha)
            );
            filaEstados.push(asist ? estadoBackendAVisual(asist.estado) : 'vacio');
            filaIds.push(asist ? asist.id : null);
          }
        }

        matriz.push(filaEstados);
        idsMatriz.push(filaIds);
      }

      setInscripciones(alumnosData);
      setFechas(
        fechasOrdenadas.length > 0
          ? fechasOrdenadas
          : [new Date().toISOString().split('T')[0]]
      );
      setDatos(matriz);
      setAsistenciaIds(idsMatriz);
    } catch (err) {
      console.error('Error cargando asistencias:', err);
      setInscripciones([]);
      setFechas([]);
      setDatos([]);
      setAsistenciaIds([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cursoId, trimestre]);

  // =====================
  // AGREGAR FECHA
  // =====================

  const agregarFecha = () => {

    const hoy =
      new Date()
        .toISOString()
        .split('T')[0];

    if (
      fechas.includes(hoy)
    ) {

      alert(
        'Ya existe una columna para hoy.'
      );

      return;

    }

    setFechas(
      (prev) => [
        hoy,
        ...prev
      ]
    );

    setDatos(
      (prev) =>
        prev.map(
          (fila) => [
            'vacio',
            ...fila
          ]
        )
    );

    setAsistenciaIds(
      (prev) =>
        prev.map(
          (fila) => [
            null,
            ...fila
          ]
        )
    );

  };

  const editarFecha = (
    colIndex: number,
    valor: string
  ) => {

    setFechas(
      (prev) =>
        prev.map(
          (f, i) =>
            i === colIndex
              ? valor
              : f
        )
    );

  };

  // =====================
  // CAMBIO ESTADO
  // =====================

  const cambiarEstado = (
    filaIndex: number,
    colIndex: number
  ) => {

    setDatos(
      (prev) =>
        prev.map(
          (fila, i) =>
            fila.map(
              (
                estado,
                j
              ) =>
                i === filaIndex &&
                j === colIndex
                  ? getSiguienteEstado(
                      estado
                    )
                  : estado
            )
        )
    );

  };

  // =====================
  // GUARDAR
  // =====================

  const guardarTodo =
    async () => {

      const token =
        localStorage.getItem(
          'token'
        );

      if (!token) {

        alert(
          'No hay sesión activa'
        );

        return;

      }

      setGuardando(true);

      try {

        const promesas:
          Promise<Response>[] = [];

        for (
          let i = 0;
          i < datos.length;
          i++
        ) {

          for (
            let j = 0;
            j < fechas.length;
            j++
          ) {

            const estadoVisual =
              datos[i][j];

            const estadoBackend =
              estadoVisualABackend(
                estadoVisual
              );

            const asistenciaId =
              asistenciaIds[i]?.[j];

            const alumnoCursoId =
              inscripciones[i].id;

            const fecha =
              fechas[j];

            const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

            if (
              asistenciaId
            ) {

              if (
                estadoVisual ===
                'vacio'
              ) {
                if (isOffline) {
                  enqueueSyncAction({
                    url: `${API}/asistencias/${asistenciaId}`,
                    method: 'DELETE',
                    tipo: 'asistencia',
                    descripcion: `Eliminar asistencia`,
                  });
                } else {
                  promesas.push(
                    fetch(
                      `${API}/asistencias/${asistenciaId}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    ).catch(() => {
                      enqueueSyncAction({
                        url: `${API}/asistencias/${asistenciaId}`,
                        method: 'DELETE',
                        tipo: 'asistencia',
                        descripcion: `Eliminar asistencia`,
                      });
                      return new Response(null, { status: 200 });
                    })
                  );
                }

              } else {
                if (isOffline) {
                  enqueueSyncAction({
                    url: `${API}/asistencias/${asistenciaId}`,
                    method: 'PUT',
                    body: { estado: estadoBackend },
                    tipo: 'asistencia',
                    descripcion: `Actualizar asistencia`,
                  });
                } else {
                  promesas.push(
                    fetch(
                      `${API}/asistencias/${asistenciaId}`,
                      {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          estado: estadoBackend,
                        }),
                      }
                    ).catch(() => {
                      enqueueSyncAction({
                        url: `${API}/asistencias/${asistenciaId}`,
                        method: 'PUT',
                        body: { estado: estadoBackend },
                        tipo: 'asistencia',
                        descripcion: `Actualizar asistencia`,
                      });
                      return new Response(null, { status: 200 });
                    })
                  );
                }

              }

            } else if (
              estadoBackend
            ) {

              const ci = i;
              const cj = j;

              if (isOffline) {
                enqueueSyncAction({
                  url: `${API}/asistencias`,
                  method: 'POST',
                  body: {
                    fecha,
                    estado: estadoBackend,
                    trimestre,
                    alumnoCursoId,
                  },
                  tipo: 'asistencia',
                  descripcion: `Crear asistencia ${fecha}`,
                });
              } else {
                promesas.push(
                  fetch(
                    `${API}/asistencias`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        fecha,
                        estado: estadoBackend,
                        trimestre,
                        alumnoCursoId,
                      }),
                    }
                  ).then(
                    async (res) => {
                      if (res.ok) {
                        const nueva: Asistencia = await res.clone().json();
                        setAsistenciaIds((prev) => {
                          const copia = prev.map((f) => [...f]);
                          copia[ci][cj] = nueva.id;
                          return copia;
                        });
                      }
                      return res;
                    }
                  ).catch(() => {
                    enqueueSyncAction({
                      url: `${API}/asistencias`,
                      method: 'POST',
                      body: {
                        fecha,
                        estado: estadoBackend,
                        trimestre,
                        alumnoCursoId,
                      },
                      tipo: 'asistencia',
                      descripcion: `Crear asistencia ${fecha}`,
                    });
                    return new Response(null, { status: 200 });
                  })
                );
              }
            }

          }

        }

        await Promise.all(
          promesas
        );

        setGuardadoOk(true);
        fetchData();

        setTimeout(
          () => {
            setGuardadoOk(false);
          },
          3000
        );

      } catch (err) {

        console.error(err);

        alert(
          '❌ Error al guardar'
        );

      } finally {

        setGuardando(false);

      }

    };

  // =====================
  // LOADING
  // =====================

  if (cargando) {

    return (
      <Cargando
        texto="
Cargando asistencias..."
      />
    );

  }



  const descargarExcel =
  async () => {

    await exportarExcelAsistencias({

      curso,
      rawId,
      inscripciones,

    });

  };

  const handleExportarPdf = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      let calificacionesData: any[] = [];
      try {
        const resNotas = await fetch(`${API}/calificaciones/curso/${rawId}`, { headers });
        if (resNotas.ok) calificacionesData = await resNotas.json();
      } catch (e) {
        console.log("No se pudieron cargar notas para el PDF:", e);
      }

      const listaAsistencias: any[] = [];
      for (let i = 0; i < inscripciones.length; i++) {
        for (let j = 0; j < fechas.length; j++) {
          const est = datos[i]?.[j];
          if (est && est !== 'vacio') {
            listaAsistencias.push({
              alumnoCursoId: inscripciones[i].id,
              estado: est,
              trimestre,
            });
          }
        }
      }

      exportarInformeCursoPdf({
        escuela: curso?.escuela || '',
        anio: curso?.anio || '',
        materia: curso?.materia || '',
        alumnos: inscripciones.map((i: any) => ({
          id: i.alumno.id,
          alumnoCursoId: i.id,
          nombre: i.alumno.nombre,
          apellido: i.alumno.apellido,
        })),
        calificaciones: calificacionesData,
        asistencias: listaAsistencias,
      });
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar el informe PDF");
    }
  };

  
  
  // =====================
  // RENDER
  // =====================


  return (

    <div className="
    p-1
    bg-violet-100
    min-h-screen
  
    m-0
  
    
    ">

      {/* TRIMESTRES */}

      <div className="
      flex
      justify-center
      items-center
       w-full 
       h-20 
      border-b
      bg-violet-300
      
      
      ">

        {[1, 2, 3].map(
          (t) => (

            <button
              key={t}
              onClick={() =>
                setTrimestre(t)
              }
              className={`
             w-1/3
             
              
              font-bold
              transition-all

              ${
                trimestre === t
                  ? 'bg-violet-100 text-violet-950 border-b-4 rounded-xl h-15 font-bold scale-90'
                  : 'bg-violet-200 text-violet-700  rounded-lg h-15 font-light scale-90'
              }
              `}
            >

              {t}° Trimestre

            </button>

          )
        )}

      </div>

     <div> <p className="
      text-center
      text-violet-800
      mb-4
      flex
      flex-col
      items-center
      justify-center
      m-auto
      uppercase
      tracking-widest
      w-full
      h-auto
      text-lg
      font-bold
      
      ">

        Mostrando asistencias
        del <strong className='font-extralight border-l pl-2 text-4xl text-violet-950'>{trimestre}°
        trimestre</strong>

      </p>
      </div>
      {/* TABLA */}

      <div className="
w-screen
max-w-screen
overflow-x-scroll
overflow-y-hidden
">

<table className="
border-collapse

"
style={{
  width: 'max-content'
}}
>

          <thead>

            <tr>

            <th className="
sticky
left-0
bg-violet-400

border-violet-400
z-10
text-violet-900
p-2
border
w-[100px]
font-mono
font-medium
">
  <small className='text-xs flex justify-end-end font-medium text-violet-950  border-b w-full text-end m-0'>Fecha:</small>
                Alumno/a

              </th>

              {fechas.map(
                (
                  fecha,
                  j
                ) => (

                  <th
                    key={j}
                    className="
                    border
                    bg-violet-300
                    border-violet-400
                    p-1
                    text-center
                    min-w-[70px]
                    "
                  >

                    <div className="
                    flex
                    flex-col
                    items-center
                    gap-1
                    ">
                    
                      <span className="
                      text-violet-950
                      bg-violet-100
                      rounded
                      w-full
                      h-6
                      text-center
                      p-1
                      text-xs
                      font-bold
                      ">

                        {
                          fecha
                            ? new Date(
                                fecha +
                                'T00:00:00'
                              ).toLocaleDateString(
                                'es-AR',
                                {
                                  day:
                                    '2-digit',

                                  month:
                                    '2-digit',
                                }
                              )
                            : '--/--'
                        }

                      </span>

                      <button
                        onClick={() => {

                          const nueva =
                            prompt(
                              'Nueva fecha',
                              fecha
                            );

                          if (nueva) {

                            editarFecha(
                              j,
                              nueva
                            );

                          }

                        }}
                        className="
                        text-violet-900
                        text-xs
                        font-light

                        "
                      >

                        editar ✏️

                      </button>

                    </div>

                  </th>

                )
              )}

            </tr>

          </thead>

          <tbody>

            {inscripciones.length === 0 && (

              <tr>

                <td
                  colSpan={
                    fechas.length + 1
                  }
                  className="
                  text-center
                  text-violet-100
                  py-10
                  "
                >

                  No hay alumnos cargados

                </td>

              </tr>

            )}

            {inscripciones.map(
              (
                insc,
                i
              ) => (

                <tr
                  key={insc.id}
                >

                  <td className="
                  pl-1
                  sticky
                  left-0
                  bg-violet-200
                  text-violet-900
                  z-10
                  p-0
                  font-mono
                  border
                  border-violet-400
                  ">

                    {
                      insc.alumno
                        .apellido
                    }, {
                      insc.alumno
                        .nombre
                    }

                  </td>

                  {datos[i]?.map(
                    (
                      estado,
                      j
                    ) => (

                      <td
  key={j}
  onClick={() =>
    cambiarEstado(
      i,
      j
    )
  }
  className={`
 
  h-16
  border
  border-violet-200
  text-center
 
  `}
>
                      

                        {
                          iconos[estado]
                        }

                      </td>

                    )
                  )}

                </tr>

              )
            )}

          </tbody>

        </table>
        
      </div>
      <div className='w-full h-auto flex flex-col items-start justify-center'>{/* REFERENCIAS */}
<div className="
flex
flex-wrap
justify-center
items-center
gap-1
flex-row
h-full
mt-3
">

  <div className="
  flex

  items-center
  gap-2
  bg-green-500
  text-white
  border-4
  border-green-500
  text-xs
  px-4
  rounded-2xl
  p-8
  shadow-md
  h-8 py-10

  ">
    <ThumbsUp size={18} />
    Presente (Buen concepto)
  </div>

  <div className="
  flex
  items-center
  gap-2
  bg-red-500
  text-white
  border-4
  border-red-500
  text-xs
  h-8 py-10      
  rounded-2xl

  font-semibold
  shadow-md
  ">
    <ThumbsDown size={18} />
    Presente (Mal concepto)
  </div>

  <div className="
  flex
  items-center
  justify-center
  gap-2
  bg-white
  text-red-800
  border-4
  border-white
  px-4
  py-2
  rounded-2xl
  text-xs
  font-semibold
  shadow-md
  h-8
  w-1/3
  ">
    <X size={18} />
    Ausente
  </div>

  <div className="
  flex
  items-center
  justify-center
  gap-2
  bg-cyan-300
  text-blue-800
  border-4
  border-cyan-300
  px-4
  py-2
  rounded-2xl
  text-xs
  font-semibold
  shadow-md
  h-8
  w-1/3
  ">
    <Clock size={18} />
    Justificada
  </div>



</div>

<div className="flex flex-wrap items-center justify-center gap-4 max-w-xl mx-auto mt-6 mb-36 px-4">
  <button
    onClick={descargarExcel}
    className="flex-1 min-w-[200px] hover:bg-emerald-50 text-emerald-800 px-5 py-3 bg-white border-2 border-emerald-500 rounded-2xl shadow-lg text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-bold"
    title="Descargar Planilla Excel"
  >
    <Download className="w-4 h-4 text-emerald-600" />
    Planilla Excel (.xlsx)
  </button>

  <button
    onClick={handleExportarPdf}
    className="flex-1 min-w-[200px] hover:bg-violet-900 text-white px-5 py-3 bg-violet-950 border-2 border-violet-950 rounded-2xl shadow-lg text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-bold"
    title="Descargar Informe Pedagógico en PDF"
  >
    <FileText className="w-4 h-4 text-violet-200" />
    Descargar Informe PDF
  </button>
</div>
</div>
      {/* BOTONES */}

      <button
        onClick={
          agregarFecha
        }
        className="
        fixed
        bottom-35
        right-0
        bg-blue-600
        text-white
        px-6
        py-3
        rounded-l-full
        "
      >

        <ListPlus />

      </button>

    
      <button
        onClick={
          guardarTodo
        }
        disabled={
          guardando
        }
        className="
        fixed
        bottom-20
        right-0
        bg-green-600
        text-white
        px-6
        py-3
        rounded-l-full
        "
      >

        {
          guardando
            ? 'Guardando...'
            : '💾'
        }

      </button>

      {guardadoOk && (

        <div className="
        fixed
        top-30
        left-1/2
        -translate-x-1/2
        bg-violet-500
        text-white
        px-6
        py-3
        rounded-full
        ">

          ✅ Asistencias guardadas

        </div>

      )}

    </div>

  );

}