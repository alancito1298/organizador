// src/utils/exportarExcel.ts

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

type Asistencia = {
  id: number;
  fecha: string;
  estado: string;
  alumnoCursoId: number;
};

type Props = {
  curso: {
    escuela?: string;
    anio?: string;
    materia?: string;
  };

  rawId: string | string[];

  inscripciones: {
    id: number;

    alumno: {
      nombre: string;
      apellido: string;
    };
  }[];
};

export async function exportarExcelAsistencias({
  curso,
  rawId,
  inscripciones,
}: Props) {

  // =====================
  // WORKBOOK
  // =====================

  const workbook =
    new ExcelJS.Workbook();

  // =====================
  // RECORRER TRIMESTRES
  // =====================

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
    // TOKEN
    // =====================

    const token =
      localStorage.getItem(
        'token'
      );

    const headers = {
      Authorization:
        `Bearer ${token}`,
    };

    // =====================
    // FETCH ASISTENCIAS
    // =====================

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
      `Asistencias - ${t}° Trimestre`;

    titulo.font = {
      bold: true,
      size: 18,
      color: {
        argb:
          'FFFFFFFF',
      },
    };

    titulo.alignment = {
      vertical:
        'middle',

      horizontal:
        'center',
    };

    titulo.fill = {
      type:
        'pattern',

      pattern:
        'solid',

      fgColor: {
        argb:
          '6D28D9',
      },
    };

    worksheet.getRow(
      1
    ).height = 30;

    // =====================
    // DATOS CURSO
    // =====================

    worksheet.addRow([]);

    worksheet.addRow([
      `Escuela: ${curso?.escuela || '-'}`,
    ]);

    worksheet.addRow([
      `Curso: ${curso?.anio || '-'}`,
    ]);

    worksheet.addRow([
      `Materia: ${curso?.materia || '-'}`,
    ]);

    worksheet.addRow([]);

    // =====================
    // SI NO HAY DATOS
    // =====================

    if (
      asistenciasData.length === 0
    ) {

      worksheet.addRow([
        `Sin asistencias cargadas para el ${t}° trimestre`,
      ]);

      continue;

    }

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

      ),

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
              'FFFFFFFF',
          },
        };

        cell.fill = {
          type:
            'pattern',

          pattern:
            'solid',

          fgColor: {
            argb:
              '7C3AED',
          },
        };

        cell.alignment = {
          horizontal:
            'center',

          vertical:
            'middle',
        };

        cell.border = {
          top: {
            style:
              'thin',
          },

          left: {
            style:
              'thin',
          },

          bottom: {
            style:
              'thin',
          },

          right: {
            style:
              'thin',
          },
        };

      }
    );

    // =====================
    // FILAS ALUMNOS
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
                type:
                  'pattern',

                pattern:
                  'solid',

                fgColor: {
                  argb:
                    color,
                },
              };

              cell.font = {
                bold: true,

                color: {
                  argb:
                    'FFFFFF',
                },
              };

              cell.alignment = {
                horizontal:
                  'center',

                vertical:
                  'middle',
              };

              cell.border = {
                top: {
                  style:
                    'thin',
                },

                left: {
                  style:
                    'thin',
                },

                bottom: {
                  style:
                    'thin',
                },

                right: {
                  style:
                    'thin',
                },
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
        'Para ver asistencias de otro trimestre busca en las pestañas de abajo 👇',
      ]);

    worksheet.mergeCells(
      `A${mensajeFinal.number}:F${mensajeFinal.number}`
    );

    mensajeFinal.font = {
      bold: true,
      italic: true,
    };

    mensajeFinal.alignment = {
      horizontal:
        'center',

      vertical:
        'middle',
    };

    mensajeFinal.height = 30;

    // =====================
    // COLUMNAS
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
  // NOMBRE ARCHIVO
  // =====================

  const nombreEscuela =
    String(
      curso?.escuela ||
      'escuela'
    ).replace(/\s/g, '_');

  const nombreCurso =
    String(
      curso?.anio ||
      'curso'
    ).replace(/\s/g, '_');

  const nombreMateria =
    String(
      curso?.materia ||
      'materia'
    ).replace(/\s/g, '_');

  // =====================
  // GENERAR BUFFER
  // =====================

  const buffer =
    await workbook.xlsx.writeBuffer();

  // =====================
  // DESCARGAR
  // =====================

  saveAs(

    new Blob(
      [buffer]
    ),

    `asistencias_${nombreEscuela}_${nombreCurso}_${nombreMateria}.xlsx`

  );

}