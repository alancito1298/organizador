'use client';

import { useEffect, useState, JSX } from 'react';
import { useParams } from 'next/navigation';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  ThumbsUp,
  ThumbsDown,
  X,
  Clock,
  ListPlus
} from 'lucide-react';

import Cargando from './Cargando';

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
  vacio: null,

  presente_buen_concepto:
    <ThumbsUp
      size={15}
      className="
      text-white
      bg-green-600
      w-2/3
      h-2/3
      rounded-full
      p-3
      mx-auto
    
      "
    />,

  presente_mal_concepto:
    <ThumbsDown
      size={15}
      className="
      text-white
      bg-red-800
      w-2/3
      h-2/3
      rounded-full
      p-3
      mx-auto
      "
    />,

  ausente:
    <X
      size={20}
      className="
    
      w-2/3
      h-2/3
      rounded-full
      p-3
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
      w-2/3
      h-2/3
      rounded-full
      p-3
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

  useEffect(() => {

    if (!cursoId) {

      setCargando(false);

      return;

    }

    const fetchData =
      async () => {

        setCargando(true);

        try {

          const token =
            localStorage.getItem(
              'token'
            );

            const headers = {
              Authorization:
                `Bearer ${token}`,
            };
            
            // CURSO
            const resCurso =
              await fetch(
                `${API}/cursos/${rawId}`,
                { headers }
              );
            
            const cursoData =
              await resCurso.json();
            
            setCurso(
              cursoData
            );
            
         

          // ALUMNOS
          const resAlumnos =
            await fetch(
              `${API}/inscripciones/curso/${rawId}`,
              { headers }
            );

          const alumnosData:
            AlumnoCurso[] =
              await resAlumnos.json();

          alumnosData.sort(
            (a, b) =>
              a.alumno.apellido.localeCompare(
                b.alumno.apellido
              )
          );

          // ASISTENCIAS
          const resAsistencias =
            await fetch(
              `${API}/asistencias/curso/${rawId}?trimestre=${trimestre}`,
              { headers }
            );

          const asistenciasData:
            Asistencia[] =
              await resAsistencias.json();

          // FECHAS
          const fechasSet =
            new Set<string>();

          for (
            const a
            of asistenciasData
          ) {

            fechasSet.add(
              a.fecha
                .split('T')[0]
            );

          }

          const fechasOrdenadas =
            [...fechasSet]
              .sort()
              .reverse();

          // MATRICES
          const matriz:
            EstadoVisual[][] = [];

          const idsMatriz:
            (number | null)[][] = [];

          for (
            const insc
            of alumnosData
          ) {

            const filaEstados:
              EstadoVisual[] = [];

            const filaIds:
              (number | null)[] = [];

            if (
              fechasOrdenadas.length === 0
            ) {

              filaEstados.push(
                'vacio'
              );

              filaIds.push(
                null
              );

            } else {

              for (
                const fecha
                of fechasOrdenadas
              ) {

                const asist =
                  asistenciasData.find(
                    (a) =>
                      a.alumnoCursoId ===
                        insc.id &&
                      a.fecha
                        .split('T')[0] ===
                        fecha
                  );

                filaEstados.push(
                  asist
                    ? estadoBackendAVisual(
                        asist.estado
                      )
                    : 'vacio'
                );

                filaIds.push(
                  asist
                    ? asist.id
                    : null
                );

              }

            }

            matriz.push(
              filaEstados
            );

            idsMatriz.push(
              filaIds
            );

          }

          setInscripciones(
            alumnosData
          );

          setFechas(
            fechasOrdenadas.length > 0
              ? fechasOrdenadas
              : [
                  new Date()
                    .toISOString()
                    .split('T')[0]
                ]
          );

          setDatos(
            matriz
          );

          setAsistenciaIds(
            idsMatriz
          );

        } catch (err) {

          console.error(
            'Error cargando asistencias:',
            err
          );

          setInscripciones([]);
          setFechas([]);
          setDatos([]);
          setAsistenciaIds([]);

        } finally {

          setCargando(false);

        }

      };

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

            if (
              asistenciaId
            ) {

              if (
                estadoVisual ===
                'vacio'
              ) {

                promesas.push(
                  fetch(
                    `${API}/asistencias/${asistenciaId}`,
                    {
                      method:
                        'DELETE',

                      headers: {
                        Authorization:
                          `Bearer ${token}`,
                      },
                    }
                  )
                );

              } else {

                promesas.push(
                  fetch(
                    `${API}/asistencias/${asistenciaId}`,
                    {
                      method:
                        'PUT',

                      headers: {
                        'Content-Type':
                          'application/json',

                        Authorization:
                          `Bearer ${token}`,
                      },

                      body:
                        JSON.stringify({
                          estado:
                            estadoBackend,
                        }),
                    }
                  )
                );

              }

            } else if (
              estadoBackend
            ) {

              const ci = i;
              const cj = j;

              promesas.push(
                fetch(
                  `${API}/asistencias`,
                  {
                    method:
                      'POST',

                    headers: {
                      'Content-Type':
                        'application/json',

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body:
                      JSON.stringify({
                        fecha,
                        estado:
                          estadoBackend,
                        trimestre,
                        alumnoCursoId,
                      }),
                  }
                ).then(
                  async (res) => {

                    if (res.ok) {

                      const nueva:
                        Asistencia =
                          await res
                            .clone()
                            .json();

                      setAsistenciaIds(
                        (prev) => {

                          const copia =
                            prev.map(
                              (f) => [...f]
                            );

                          copia[ci][cj] =
                            nueva.id;

                          return copia;

                        }
                      );

                    }

                    return res;

                  }
                )
              );

            }

          }

        }

        await Promise.all(
          promesas
        );

        setGuardadoOk(true);

        setTimeout(
          () => {

            window.location.reload();

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



  const descargarExcel = async () => {

    // CREAR LIBRO
    const workbook =
      new ExcelJS.Workbook();
  
    for (
      let t = 1;
      t <= 3;
      t++
    ) {
  
      // =====================
      // NUEVA HOJA
      // =====================
  
      const worksheet =
        workbook.addWorksheet(
          `${t}° Trimestre`
        );
  
      // =====================
      // TRAER ASISTENCIAS
      // DEL TRIMESTRE
      // =====================
  
      const token =
        localStorage.getItem(
          'token'
        );
  
      const headers = {
        Authorization:
          `Bearer ${token}`,
      };
  
      const resAsistencias =
        await fetch(
          `${API}/asistencias/curso/${rawId}?trimestre=${t}`,
          { headers }
        );
  
      const asistenciasData:
        Asistencia[] =
          await resAsistencias.json();
  
      // =====================
      // FECHAS
      // =====================
  
      const fechasSet =
        new Set<string>();
  
      for (
        const a
        of asistenciasData
      ) {
  
        fechasSet.add(
          a.fecha.split(
            'T'
          )[0]
        );
  
      }
  
      const fechasExcel =
        [...fechasSet]
          .sort()
          .reverse();
  
      // =====================
      // TITULO
      // =====================
  
      worksheet.mergeCells(
        'A1:F1'
      );
  
      const titulo =
        worksheet.getCell(
          'A1'
        );
  
      titulo.value =
        `Asistencias - ${t}° Trimestre
       `;
  
      titulo.font = {
        bold: true,
        size: 18,
        color: {
          argb:
            'FFFFFFFF'
        }
      };
  
      titulo.alignment = {
        vertical:
          'middle',
        horizontal:
          'center'
      };
  
      titulo.fill = {
        type:
          'pattern',
        pattern:
          'solid',
        fgColor: {
          argb:
            '6D28D9'
        }
      };
  
      worksheet.getRow(
        1
      ).height = 30;
  
      // =====================
      // ENCABEZADOS
      // =====================
  
      const encabezados = [
  
        'Alumno',
  
        ...fechasExcel.map(
          (fecha) =>
  
            new Date(
              fecha +
              'T00:00:00'
            ).toLocaleDateString(
              'es-AR'
            )
  
        )
  
      ];
  
      const headerRow =
        worksheet.addRow(
          encabezados
        );
  
      // =====================
      // ESTILOS HEADERS
      // =====================
  
      headerRow.eachCell(
        (cell) => {
  
          cell.font = {
            bold: true,
            color: {
              argb:
                'FFFFFFFF'
            }
          };
  
          cell.fill = {
            type:
              'pattern',
            pattern:
              'solid',
            fgColor: {
              argb:
                '7C3AED'
            }
          };
  
          cell.alignment = {
            horizontal:
              'center',
            vertical:
              'middle'
          };
  
          cell.border = {
            top: {
              style:
                'thin'
            },
            left: {
              style:
                'thin'
            },
            bottom: {
              style:
                'thin'
            },
            right: {
              style:
                'thin'
            }
          };
  
        }
      );
  
      // =====================
      // FILAS
      // =====================
  
      inscripciones.forEach(
        (
          insc
        ) => {
  
          const fila = [
  
            `${insc.alumno.apellido}, ${insc.alumno.nombre}`,
  
            ...fechasExcel.map(
              (
                fecha
              ) => {
  
                const asist =
                  asistenciasData.find(
                    (a) =>
                      a.alumnoCursoId ===
                        insc.id &&
                      a.fecha.split(
                        'T'
                      )[0] ===
                        fecha
                  );
  
                if (
                  !asist
                ) {
                  return '-';
                }
  
                switch (
                  asist.estado
                ) {
  
                  case 'presente_buen_concepto':
                    return 'P';
  
                  case 'presente_mal_concepto':
                    return 'PMC';
  
                  case 'ausente':
                    return 'A';
  
                  case 'justificada':
                    return 'J';
  
                  default:
                    return '-';
  
                }
  
              }
            )
  
          ];
  
          worksheet.addRow(
            fila
          );
  
          const row =
            worksheet.lastRow;
  
          if (row) {
  
            row.eachCell(
              (
                cell,
                colNumber
              ) => {
  
                if (
                  colNumber ===
                  1
                ) {
  
                  cell.font = {
                    bold: true
                  };
  
                  return;
  
                }
  
                const valor =
                  String(
                    cell.value
                  );
  
                let color =
                  'FFFFFF';
  
                switch (
                  valor
                ) {
  
                  case 'P':
                    color =
                      '22C55E';
                    break;
  
                  case 'PMC':
                    color =
                      'FB923C';
                    break;
  
                  case 'A':
                    color =
                      'EF4444';
                    break;
  
                  case 'J':
                    color =
                      '38BDF8';
                    break;
  
                  default:
                    color =
                      'FCD34D';
                    break;
  
                }
  
                cell.fill = {
                  type:
                    'pattern',
                  pattern:
                    'solid',
                  fgColor: {
                    argb:
                      color
                  }
                };
  
                cell.font = {
                  bold: true,
                  color: {
                    argb:
                      'FFFFFF'
                  }
                };
  
                cell.alignment = {
                  horizontal:
                    'center',
                  vertical:
                    'middle'
                };
  
                cell.border = {
                  top: {
                    style:
                      'thin'
                  },
                  left: {
                    style:
                      'thin'
                  },
                  bottom: {
                    style:
                      'thin'
                  },
                  right: {
                    style:
                      'thin'
                  }
                };
  
              }
            );
  
          }
  
        }
      );
  // =====================
// TEXTO FINAL
// =====================

worksheet.addRow([]);

const mensajeFinal =
  worksheet.addRow([
    'Para ver asistencias de otro trimestre busca en las pestañas de abajo 👇'
  ]);

worksheet.mergeCells(
  `A${mensajeFinal.number}:F${mensajeFinal.number}`
);

mensajeFinal.font = {
  bold: true,
  italic: true,
};

mensajeFinal.alignment = {
  horizontal: 'center',
  vertical: 'middle',
};

mensajeFinal.height = 30;
      // =====================
      // ANCHO COLUMNAS
      // =====================
  
      worksheet.columns.forEach(
        (
          column
        ) => {
  
          column.width =
            18;
  
        }
      );
  
    }
  
    // =====================
    // GENERAR ARCHIVO
    // =====================
  
    const nombreCurso =
  String(
    curso?.anio || 'curso'
  ).replace(/\s/g, '_');

const nombreMateria =
  String(
    curso?.materia || 'materia'
  ).replace(/\s/g, '_');

  const nombreEscuela =
  String(
    curso?.escuela || 'escuela'
  ).replace(/\s/g, '_');

const buffer =
  await workbook.xlsx.writeBuffer();

saveAs(

  new Blob([buffer]),

  `asistencias_${nombreCurso}°_${nombreMateria}_${nombreEscuela}.xlsx`

);
  
  };
  

  
  
  // =====================
  // RENDER
  // =====================


  return (

    <div className="
    p-1
    pb-32
    bg-violet-100
    min-h-screen
    w-400
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
{/* REFERENCIAS */}
<div className="
flex
flex-wrap
justify-center
items-center
gap-1
bg-violet-300
h-35
shadow-xl
">

  <div className="
  flex
  items-center
  
  gap-2
  bg-green-500
  text-white
  px-4
 
  rounded-2xl
  text-sm
  font-semibold
  shadow-md
  h-10 py-10
  ">
    <ThumbsUp size={18} />
    Presente (Buen concepto)
  </div>

  <div className="
  flex
  items-center
  gap-2
  bg-red-800
  text-white
  h-10 py-10      
  rounded-2xl
  text-sm
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
  border
  border-red-800
  px-4
  py-2
  rounded-2xl
  text-sm
  font-semibold
  shadow-md
  h-10
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
  px-4
  py-2
  rounded-2xl
  text-sm
  font-semibold
  shadow-md
  h-10
  w-1/3
  ">
    <Clock size={18} />
    Justificada
  </div>



</div>
      <p className="
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
      
      ">

        Mostrando asistencias
        del <strong className='fonto-bold text-violet-950'>{trimestre}°
        trimestre</strong>

      </p>

      {/* TABLA */}

      <div className="
      overflow-x-auto
      relative
      ">

        <table className="
        table-fixed
        border-collapse
        mb-40
        ">

          <thead>

            <tr>

              <th className="
              sticky
              left-0
              bg-violet-400
              border
              border-violet-400
              z-10
              text-violet-900
              p-2
              w-40
              text-left
              font-mono
              font-medium
              flex
              flex-col
              items-center
              ">
  <small className='text-xs font-medium text-violet-950  border-b w-full text-end m-0'>Fecha:</small>
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
                  w-16
                  h-16
                  sticky
                  left-0
                  bg-violet-200
                  text-violet-900
                  z-10
                  p-1
                  font-mono
                  border-b
                  border-violet-300
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
                        
                       
                        border
                        border-violet-200
                        
                        
                        
                       
                        text-center
                        }
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
  onClick={descargarExcel}
  className="
  fixed
  bottom-50
  right-0
  bg-emerald-600
  hover:bg-emerald-700
  text-white
  px-6
  py-3
  rounded-l-full
  border-amber-950
  border-r-0
  border-2
  shadow-2xl
  text-lg
  font-semibold
  transition-all
  "
  title="Descargar Excel"
>

  📊

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