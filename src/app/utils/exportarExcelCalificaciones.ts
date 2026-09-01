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

const formatearTipoEvaluacion = (tipo: string) => {
  switch (tipo) {
    case 'trabajo_practico':
      return 'TP';
    case 'Examen':
      return 'Examen';
    case 'final':
      return 'Final';
    default:
      return tipo || 'Nota';
  }
};

export async function exportarExcelCalificaciones({
  columnas,
  datos,
  inscripciones,
  curso,
}: Props) {
  const workbook = new ExcelJS.Workbook();

  // =====================
  // HOJA ÚNICA: TODAS LAS CALIFICACIONES JUNTAS
  // =====================
  const worksheet = workbook.addWorksheet('Calificaciones');

  const totalColumnas = Math.max(columnas.length + 5, 8);
  const ultimaLetraCol = String.fromCharCode(65 + Math.min(totalColumnas - 1, 25));

  // =====================
  // TÍTULO
  // =====================
  worksheet.mergeCells(`A1:${ultimaLetraCol}1`);
  const titulo = worksheet.getCell('A1');
  titulo.value = 'PLANILLA GENERAL DE CALIFICACIONES';
  titulo.font = {
    bold: true,
    size: 16,
    color: { argb: 'FFFFFFFF' },
  };
  titulo.alignment = { vertical: 'middle', horizontal: 'center' };
  titulo.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '6D28D9' },
  };
  worksheet.getRow(1).height = 32;

  // =====================
  // DATOS DEL CURSO
  // =====================
  worksheet.addRow([]);
  worksheet.addRow([`Escuela: ${curso?.escuela || '-'}`]);
  worksheet.addRow([`Curso: ${curso?.anio || '-'}`]);
  worksheet.addRow([`Materia: ${curso?.materia || '-'}`]);
  worksheet.addRow([]);

  // =====================
  // ENCABEZADOS DE COLUMNAS
  // =====================
  const encabezados = [
    'Alumno / Estudiante',
    ...columnas.map((col) => {
      const tipo = formatearTipoEvaluacion(col.tipo);
      const trim = col.trimestre ? `${col.trimestre}° Trim` : '';
      const fecha = col.fecha
        ? new Date(col.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
          })
        : '';
      return `${tipo} (${trim}${fecha ? ` - ${fecha}` : ''})`;
    }),
    'Prom. 1° Trim',
    'Prom. 2° Trim',
    'Prom. 3° Trim',
    'Promedio Final',
  ];

  const headerRow = worksheet.addRow(encabezados);
  headerRow.height = 28;

  headerRow.eachCell((cell, colNumber) => {
    const isAlumno = colNumber === 1;
    const isPromedio = colNumber > columnas.length + 1;

    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 11,
    };

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: isAlumno ? '4C1D95' : isPromedio ? '1E1B4B' : '7C3AED',
      },
    };

    cell.alignment = {
      horizontal: isAlumno ? 'left' : 'center',
      vertical: 'middle',
    };

    cell.border = {
      top: { style: 'thin', color: { argb: 'DDD6FE' } },
      left: { style: 'thin', color: { argb: 'DDD6FE' } },
      bottom: { style: 'thin', color: { argb: 'DDD6FE' } },
      right: { style: 'thin', color: { argb: 'DDD6FE' } },
    };
  });

  // =====================
  // FILAS DE ALUMNOS CON NOTAS Y PROMEDIOS
  // =====================
  inscripciones.forEach((insc, filaIndex) => {
    const notasAlumno = datos[filaIndex] || [];

    // Calcular promedios por trimestre y final
    const notasT1: number[] = [];
    const notasT2: number[] = [];
    const notasT3: number[] = [];
    const todasNotas: number[] = [];

    columnas.forEach((col, colIdx) => {
      const val = parseFloat(notasAlumno[colIdx]);
      if (!isNaN(val) && val > 0) {
        todasNotas.push(val);
        if (col.trimestre === '1') notasT1.push(val);
        else if (col.trimestre === '2') notasT2.push(val);
        else if (col.trimestre === '3') notasT3.push(val);
      }
    });

    const promT1 = notasT1.length > 0 ? (notasT1.reduce((a, b) => a + b, 0) / notasT1.length).toFixed(1) : '-';
    const promT2 = notasT2.length > 0 ? (notasT2.reduce((a, b) => a + b, 0) / notasT2.length).toFixed(1) : '-';
    const promT3 = notasT3.length > 0 ? (notasT3.reduce((a, b) => a + b, 0) / notasT3.length).toFixed(1) : '-';
    const promFinal = todasNotas.length > 0 ? (todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length).toFixed(1) : '-';

    const filaValores = [
      `${insc.alumno.apellido}, ${insc.alumno.nombre}`,
      ...columnas.map((_, colIdx) => {
        const val = notasAlumno[colIdx];
        return val !== undefined && val !== '' ? val : '-';
      }),
      promT1,
      promT2,
      promT3,
      promFinal,
    ];

    worksheet.addRow(filaValores);
    const row = worksheet.lastRow;

    if (row) {
      row.height = 22;
      row.eachCell((cell, colNumber) => {
        const isAlumno = colNumber === 1;
        const isPromFinal = colNumber === filaValores.length;
        const isPromTrim = colNumber >= filaValores.length - 3;

        if (isAlumno) {
          cell.font = { bold: true, size: 11 };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: filaIndex % 2 === 0 ? 'F5F3FF' : 'FFFFFF' },
          };
          return;
        }

        const valor = parseFloat(String(cell.value));
        let colorFondo = 'FFFFFF';
        let colorTexto = '374151';

        if (!isNaN(valor) && valor > 0) {
          if (valor >= 6) {
            colorFondo = isPromFinal ? '15803D' : isPromTrim ? 'BBF7D0' : 'DCFCE7';
            colorTexto = isPromFinal ? 'FFFFFF' : '166534';
          } else {
            colorFondo = isPromFinal ? 'B91C1C' : isPromTrim ? 'FECDD3' : 'FEE2E2';
            colorTexto = isPromFinal ? 'FFFFFF' : '991B1B';
          }
        } else {
          colorFondo = filaIndex % 2 === 0 ? 'F9FAFB' : 'FFFFFF';
          colorTexto = '9CA3AF';
        }

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colorFondo },
        };

        cell.font = {
          bold: isPromTrim || (!isNaN(valor) && valor >= 6),
          color: { argb: colorTexto },
          size: 11,
        };

        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } },
        };
      });
    }
  });

  // =====================
  // ANCHOS DE COLUMNAS
  // =====================
  worksheet.columns.forEach((column, index) => {
    if (index === 0) {
      column.width = 28;
    } else {
      column.width = 18;
    }
  });

  // =====================
  // DESCARGAR ARCHIVO
  // =====================
  const nombreEscuela = String(curso?.escuela || 'escuela').replace(/\s/g, '_');
  const nombreCurso = String(curso?.anio || 'curso').replace(/\s/g, '_');
  const nombreMateria = String(curso?.materia || 'materia').replace(/\s/g, '_');

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `calificaciones_${nombreEscuela}_${nombreCurso}_${nombreMateria}.xlsx`
  );
}