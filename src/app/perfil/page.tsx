'use client';

import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import PerfilDocente from "../components/PerfilDocente";

export default function Planificaciones() {
  return (
    <>
      <Navbar/>
        <PerfilDocente></PerfilDocente>
      <BottomNav />
    </>
  );
}






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
  ListPlus,
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

type Curso = {
  id: number;
  escuela: string;
  anio: string;
  materia: string;
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
  vacio: 'bg-amber-300',

  presente_buen_concepto:
    'bg-green-500',

  presente_mal_concepto:
    'bg-orange-400',

  ausente: 'bg-red-500',

  justificada: 'bg-cyan-400',
};

const iconos: Record<
  EstadoVisual,
  JSX.Element | null
> = {
  vacio: null,

  presente_buen_concepto: (
    <ThumbsUp
      size={20}
      className="text-white mx-auto"
    />
  ),

  presente_mal_concepto: (
    <ThumbsDown
      size={20}
      className="text-white mx-auto"
    />
  ),

  ausente: (
    <X
      size={20}
      className="text-white mx-auto"
    />
  ),

  justificada: (
    <Clock
      size={20}
      className="text-white mx-auto"
    />
  ),
};

const estadoBackendAVisual = (
  estado: string
): EstadoVisual => {
  if (
    estado ===
    'presente_buen_concepto'
  )
    return 'presente_buen_concepto';

  if (
    estado ===
    'presente_mal_concepto'
  )
    return 'presente_mal_concepto';

  if (estado === 'ausente')
    return 'ausente';

  if (
    estado === 'justificada'
  )
    return 'justificada';

  return 'vacio';
};

const estadoVisualABackend = (
  estado: EstadoVisual
): string | null => {
  if (estado === 'vacio')
    return null;

  return estado;
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
  const params = useParams();

  const rawId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const cursoId = Number(rawId);

  const [
    guardadoOk,
    setGuardadoOk,
  ] = useState(false);

  const [
    inscripciones,
    setInscripciones,
  ] = useState<AlumnoCurso[]>(
    []
  );

  const [fechas, setFechas] =
    useState<string[]>([]);

  const [datos, setDatos] =
    useState<
      EstadoVisual[][]
    >([]);

  const [
    asistenciaIds,
    setAsistenciaIds,
  ] = useState<
    (number | null)[][]
  >([]);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    trimestre,
    setTrimestre,
  ] = useState(1);

  const [curso, setCurso] =
    useState<Curso | null>(
      null
    );

  // =====================
  // CARGA INICIAL
  // =====================

  useEffect(() => {
    if (!cursoId) return;

    const fetchData =
      async () => {
        setCargando(true);

        try {
          const token =
            localStorage.getItem(
              'token'
            );

          const headers = {
            Authorization: `Bearer ${token}`,
          };

          // CURSO
          const resCurso =
            await fetch(
              `${API}/cursos/${rawId}`,
              { headers }
            );

          const cursoData =
            await resCurso.json();

          setCurso(cursoData);

          // ALUMNOS
          const resAlumnos =
            await fetch(
              `${API}/inscripciones/curso/${rawId}`,
              { headers }
            );

          const alumnosData: AlumnoCurso[] =
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

          const asistenciasData: Asistencia[] =
            await resAsistencias.json();

          // FECHAS
          const fechasSet =
            new Set<string>();

          for (const a of asistenciasData) {
            fechasSet.add(
              a.fecha.split('T')[0]
            );
          }

          const fechasOrdenadas =
            [...fechasSet]
              .sort()
              .reverse();

          // MATRICES
          const matriz: EstadoVisual[][] =
            [];

          const idsMatriz: (
            | number
            | null
          )[][] = [];

          for (const insc of alumnosData) {
            const filaEstados: EstadoVisual[] =
              [];

            const filaIds: (
              | number
              | null
            )[] = [];

            for (const fecha of fechasOrdenadas) {
              const asist =
                asistenciasData.find(
                  (a) =>
                    a.alumnoCursoId ===
                      insc.id &&
                    a.fecha.split(
                      'T'
                    )[0] === fecha
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
            fechasOrdenadas
          );

          setDatos(matriz);

          setAsistenciaIds(
            idsMatriz
          );
        } catch (err) {
          console.error(err);
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

    if (fechas.includes(hoy)) {
      alert(
        'Ya existe una columna para hoy.'
      );

      return;
    }

    setFechas((prev) => [
      hoy,
      ...prev,
    ]);

    setDatos((prev) =>
      prev.map((fila) => [
        'vacio',
        ...fila,
      ])
    );

    setAsistenciaIds((prev) =>
      prev.map((fila) => [
        null,
        ...fila,
      ])
    );
  };

  const editarFecha = (
    colIndex: number,
    valor: string
  ) => {
    setFechas((prev) =>
      prev.map((f, i) =>
        i === colIndex
          ? valor
          : f
      )
    );
  };

  // =====================
  // CAMBIAR ESTADO
  // =====================

  const cambiarEstado = (
    filaIndex: number,
    colIndex: number
  ) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        fila.map(
          (estado, j) =>
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
        const promesas: Promise<Response>[] =
          [];

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

            if (asistenciaId) {
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
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                );
              } else {
                promesas.push(
                  fetch(
                    `${API}/asistencias/${asistenciaId}`,
                    {
                      method: 'PUT',

                      headers: {
                        'Content-Type':
                          'application/json',

                        Authorization: `Bearer ${token}`,
                      },

                      body:
                        JSON.stringify(
                          {
                            estado:
                              estadoBackend,
                          }
                        ),
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
                    method: 'POST',

                    headers: {
                      'Content-Type':
                        'application/json',

                      Authorization: `Bearer ${token}`,
                    },

                    body:
                      JSON.stringify(
                        {
                          fecha,
                          estado:
                            estadoBackend,
                          trimestre,
                          alumnoCursoId,
                        }
                      ),
                  }
                ).then(
                  async (res) => {
                    if (res.ok) {
                      const nueva: Asistencia =
                        await res
                          .clone()
                          .json();

                      setAsistenciaIds(
                        (prev) => {
                          const copia =
                            prev.map(
                              (f) => [
                                ...f,
                              ]
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

        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
  // EXCEL
  // =====================

  const descargarExcel =
    async () => {
      const workbook =
        new ExcelJS.Workbook();

      const worksheet =
        workbook.addWorksheet(
          `Trimestre ${trimestre}`
        );

      // TITULO
      worksheet.mergeCells(
        'A1:H1'
      );

      const titulo =
        worksheet.getCell(
          'A1'
        );

      titulo.value =
        `ASISTENCIAS - ${trimestre}° TRIMESTRE`;

      titulo.font = {
        bold: true,
        size: 18,
        color: {
          argb: 'FFFFFFFF',
        },
      };

      titulo.alignment = {
        vertical: 'middle',
        horizontal:
          'center',
      };

      titulo.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '6D28D9',
        },
      };

      worksheet.getRow(
        1
      ).height = 30;

      // INFO CURSO
      worksheet.mergeCells(
        'A3:D3'
      );

      worksheet.getCell(
        'A3'
      ).value = `Curso: ${
        curso?.anio || ''
      }`;

      worksheet.mergeCells(
        'E3:H3'
      );

      worksheet.getCell(
        'E3'
      ).value = `Materia: ${
        curso?.materia || ''
      }`;

      worksheet.mergeCells(
        'A4:D4'
      );

      worksheet.getCell(
        'A4'
      ).value = `Escuela: ${
        curso?.escuela || ''
      }`;

      worksheet.mergeCells(
        'E4:H4'
      );

      worksheet.getCell(
        'E4'
      ).value = `Exportado: ${new Date().toLocaleDateString(
        'es-AR'
      )}`;

      // ENCABEZADOS
      const encabezados = [
        'Alumno',

        ...fechas.map(
          (fecha) =>
            new Date(
              fecha +
                'T00:00:00'
            ).toLocaleDateString(
              'es-AR'
            )
        ),
      ];

      const headerRow =
        worksheet.addRow(
          encabezados
        );

      headerRow.eachCell(
        (cell) => {
          cell.font = {
            bold: true,
            color: {
              argb: 'FFFFFFFF',
            },
          };

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: '7C3AED',
            },
          };

          cell.alignment = {
            horizontal:
              'center',
            vertical:
              'middle',
          };
        }
      );

      // FILAS
      inscripciones.forEach(
        (insc, i) => {
          const fila = [
            `${insc.alumno.apellido}, ${insc.alumno.nombre}`,

            ...datos[i].map(
              (estado) => {
                switch (
                  estado
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
            ),
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
                    bold: true,
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
                  type: 'pattern',
                  pattern:
                    'solid',
                  fgColor: {
                    argb: color,
                  },
                };

                cell.alignment = {
                  horizontal:
                    'center',
                  vertical:
                    'middle',
                };
              }
            );
          }
        }
      );

      // AUTO WIDTH
      worksheet.columns.forEach(
        (column) => {
          column.width = 18;
        }
      );

      // DESCARGAR
      const buffer =
        await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer]),
        `asistencias_trimestre_${trimestre}.xlsx`
      );
    };

  // =====================
  // LOADING
  // =====================

  if (cargando) {
    return (
      <Cargando texto="Cargando asistencias..." />
    );
  }

  return (
    <div className="p-2 pb-32 bg-purple-700 min-h-screen">

      {/* REFERENCIAS */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 bg-violet-900 border border-violet-700 rounded-3xl p-4 shadow-xl">

        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md">
          <ThumbsUp size={18} />
          Presente (Buen concepto)
        </div>

        <div className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md">
          <ThumbsDown size={18} />
          Presente (Mal concepto)
        </div>

        <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md">
          <X size={18} />
          Ausente
        </div>

        <div className="flex items-center gap-2 bg-cyan-400 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md">
          <Clock size={18} />
          Justificada
        </div>

      </div>

      {/* TRIMESTRES */}
      <div className="flex justify-center gap-3 mb-6">

        {[1, 2, 3].map(
          (t) => (
            <button
              key={t}
              onClick={() =>
                setTrimestre(
                  t
                )
              }
              className={`
              px-5
              py-3
              rounded-2xl
              font-bold
              transition-all

              ${
                trimestre ===
                t
                  ? 'bg-white text-violet-900 scale-105'
                  : 'bg-violet-900 text-violet-200'
              }
              `}
            >
              {t}°
              Trimestre
            </button>
          )
        )}

      </div>

      <div className="overflow-x-auto relative">

        <table className="table-fixed border-collapse mb-40">

          <thead>

            <tr>

              <th className="sticky left-0 bg-violet-950 z-10 text-violet-100 p-2 w-40 text-left">
                Alumno
              </th>

              {fechas.map(
                (
                  fecha,
                  j
                ) => (
                  <th
                    key={j}
                    className="border-2 bg-violet-950 border-violet-200 p-1 text-violet-900 text-center min-w-[70px]"
                  >
                    <div className="flex flex-col items-center gap-1">

                      <span className="text-violet-950 bg-amber-100 rounded px-2 py-1 text-xs font-bold">

                        {fecha
                          ? new Date(
                              fecha +
                                'T00:00:00'
                            ).toLocaleDateString(
                              'es-AR',
                              {
                                day: '2-digit',
                                month:
                                  '2-digit',
                              }
                            )
                          : '--/--'}

                      </span>

                      <button
                        onClick={() => {
                          const nueva =
                            prompt(
                              'Nueva fecha (YYYY-MM-DD):',
                              fecha
                            );

                          if (
                            nueva
                          )
                            editarFecha(
                              j,
                              nueva
                            );
                        }}
                        className="text-violet-400 text-xs font hover:text-violet-700 transition"
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

            {inscripciones.map(
              (
                insc,
                i
              ) => (
                <tr
                  key={
                    insc.id
                  }
                >

                  <td className="sticky left-0 bg-purple-700 text-violet-50 z-10 p-1 gap-0 font-mono w-46 font-light border-b-2 border-violet-300">

                    {
                      insc
                        .alumno
                        .apellido
                    },{' '}
                    {
                      insc
                        .alumno
                        .nombre
                    }

                  </td>

                  {datos[
                    i
                  ]?.map(
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
                        className={`w-16 h-16 border-2 border-violet-300 cursor-pointer transition-colors duration-150 text-center rounded-xl m-1 ${colores[estado]}`}
                      >
                        {
                          iconos[
                            estado
                          ]
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

      {/* BOTON EXCEL */}

      <button
        onClick={
          descargarExcel
        }
        className="fixed bottom-50 right-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-l-full border-amber-950 border-r-0 border-2 shadow-2xl text-lg font-semibold transition-all"
      >
        📊
      </button>

      {/* BOTON FECHA */}

      <button
        onClick={
          agregarFecha
        }
        className="fixed bottom-35 right-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-l-full border-amber-950 border-r-0 border-2 shadow-2xl text-lg font-semibold transition-all"
      >
        <ListPlus />
      </button>

      {/* BOTON GUARDAR */}

      <button
        onClick={
          guardarTodo
        }
        disabled={
          guardando
        }
        className="fixed bottom-20 right-0 border-amber-950 border-2 border-r-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-l-full shadow-8xl shadow-amber-900 text-lg font-semibold transition-all"
      >
        {guardando
          ? 'Guardando...'
          : '💾'}
      </button>

      {guardadoOk && (
        <div className="fixed top-30 left-1/2 -translate-x-1/2 z-50 p-6 bg-violet-500 text-center text-white px-6 py-3 rounded-full shadow-2xl text-lg font-semibold animate-bounce">
          ✅ Asistencias guardadas
        </div>
      )}

    </div>
  );
}