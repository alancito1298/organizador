import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

type AlumnoCurso = {
  id: number;

  alumno: {
    nombre: string;
    apellido: string;
  };
};

type Columna = {
  tipo: string;
  trimestre: string;
  fecha: string;
};

type Props = {
  columnas: Columna[];

  datos: string[][];

  inscripciones: AlumnoCurso[];

  curso?: {
    escuela?: string;
    anio?: string;
    materia?: string;
  };
};

export async function exportarExcelCalificaciones({
  columnas,
  datos,
  inscripciones,
  curso,
}: Props) {

  const workbook =
    new ExcelJS.Workbook();

  // =====================
  // AGRUPAR TRIMESTRES
  // =====================

  for (
    let trimestre = 1;
    trimestre <= 3;
    trimestre++
  ) {

    const columnasTrimestre =
      columnas
        .map((col, index) => ({
          ...col,
          originalIndex: index,
        }))
        .filter(
          (col) =>
            Number(
              col.trimestre
            ) === trimestre
        );

    const worksheet =
      workbook.addWorksheet(
        `${trimestre}° Trimestre`
      );

    // =====================
    // TITULO
    // =====================

    worksheet.mergeCells(
      'A1:H1'
    );

    const titulo =
      worksheet.getCell(
        'A1'
      );

    titulo.value =
      `CALIFICACIONES - ${trimestre}° TRIMESTRE`;

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
    // INFO CURSO
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
    // SIN DATOS
    // =====================

    if (
      columnasTrimestre.length === 0
    ) {

      worksheet.addRow([
        `Sin calificaciones cargadas para el ${trimestre}° trimestre`,
      ]);

      continue;

    }

    // =====================
    // HEADERS
    // =====================

    const headers = [

      'Alumno',

      ...columnasTrimestre.map(
        (col) =>
          `${col.tipo}
${new Date(
  col.fecha +
  'T00:00:00'
).toLocaleDateString(
  'es-AR'
)}`
      ),

    ];

    const headerRow =
      worksheet.addRow(
        headers
      );

    headerRow.height = 40;

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

          wrapText:
            true,
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
    // FILAS
    // =====================

    inscripciones.forEach(
      (
        insc,
        filaIndex
      ) => {

        const fila = [

          `${insc.alumno.apellido}, ${insc.alumno.nombre}`,

          ...columnasTrimestre.map(
            (col) =>

              datos[
                filaIndex
              ][
                col.originalIndex
              ] || '-'

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
                colNumber === 1
              ) {

                cell.font = {
                  bold: true,
                };

                return;

              }

              const valor =
                Number(
                  cell.value
                );

              let color =
                'FFFFFF';

              if (
                !cell.value ||
                cell.value === '-'
              ) {

                color =
                  'E5E7EB';

              } else if (
                valor >= 6
              ) {

                color =
                  '22C55E';

              } else {

                color =
                  'EF4444';

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
    // MENSAJE FINAL
    // =====================

    worksheet.addRow([]);

    const mensajeFinal =
      worksheet.addRow([
        'Para ver otros trimestres utiliza las pestañas inferiores 👇',
      ]);

    worksheet.mergeCells(
      `A${mensajeFinal.number}:H${mensajeFinal.number}`
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

    // =====================
    // WIDTHS
    // =====================

    worksheet.columns.forEach(
      (column) => {

        column.width = 20;

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
  // BUFFER
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

    `calificaciones_${nombreEscuela}_${nombreCurso}_${nombreMateria}.xlsx`

  );

}