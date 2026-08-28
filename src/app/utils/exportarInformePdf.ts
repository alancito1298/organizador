/**
 * exportarInformePdf.ts
 * Generador de Informes Pedagógicos y Boletines Escolares en PDF listos para imprimir.
 * Diseñado conforme a los estándares de evaluación del sistema educativo en Argentina.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DatosInformeCurso {
  escuela: string;
  anio: string;
  materia: string;
  docenteNombre?: string;
  periodo?: string; // ej: "1° Trimestre", "2° Trimestre", "3° Trimestre", "Anual"
  alumnos: {
    id: number;
    alumnoCursoId: number;
    nombre: string;
    apellido: string;
    dni?: string;
  }[];
  calificaciones?: {
    valor: number;
    alumnoCursoId: number;
    tipo: string;
    trimestre: number;
    fecha?: string;
  }[];
  asistencias?: {
    estado: string;
    alumnoCursoId: number;
    trimestre?: number;
  }[];
}

export function exportarInformeCursoPdf(datos: DatosInformeCurso) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const fechaEmision = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const periodoTexto = datos.periodo || 'Ciclo Lectivo Anual';

  // 1. ENCABEZADO INSTITUCIONAL
  doc.setFillColor(46, 16, 101); // Violeta oscuro #2e1065
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ORGANIZADOR DOCENTE — INFORME PEDAGÓGICO DE CURSO', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Fecha de emisión: ${fechaEmision} | Período: ${periodoTexto}`, 14, 18);

  // 2. METADATOS DEL CURSO (Tarjetas informativas)
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DATOS DEL CURSO', 14, 32);

  doc.setDrawColor(220, 220, 230);
  doc.setFillColor(248, 246, 255);
  doc.roundedRect(14, 35, 269, 14, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Institución / Escuela:`, 18, 41);
  doc.setFont('helvetica', 'bold');
  doc.text(`${datos.escuela || 'Sin especificar'}`, 52, 41);

  doc.setFont('helvetica', 'normal');
  doc.text(`Curso / Año:`, 110, 41);
  doc.setFont('helvetica', 'bold');
  doc.text(`${datos.anio || 'Sin especificar'}`, 132, 41);

  doc.setFont('helvetica', 'normal');
  doc.text(`Materia:`, 170, 41);
  doc.setFont('helvetica', 'bold');
  doc.text(`${datos.materia || 'Sin especificar'}`, 186, 41);

  if (datos.docenteNombre) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Docente:`, 18, 46);
    doc.setFont('helvetica', 'bold');
    doc.text(`${datos.docenteNombre}`, 34, 46);
  }

  // 3. CONSTRUCCIÓN DE FILAS DE ALUMNOS Y NOTAS
  const filasTabla: any[] = [];
  let totalPromedios = 0;
  let totalAprobados = 0;
  let totalDesaprobados = 0;
  let totalAsistenciasPresentes = 0;
  let totalAsistenciasTotal = 0;

  const alumnosOrdenados = [...datos.alumnos].sort((a, b) =>
    a.apellido.localeCompare(b.apellido)
  );

  alumnosOrdenados.forEach((alumno, index) => {
    // Calificaciones del alumno
    const notasAlumno = (datos.calificaciones || []).filter(
      (c) => c.alumnoCursoId === alumno.alumnoCursoId
    );

    const sumaNotas = notasAlumno.reduce((acc, n) => acc + Number(n.valor), 0);
    const promedio = notasAlumno.length > 0 ? Number((sumaNotas / notasAlumno.length).toFixed(2)) : null;

    if (promedio !== null) {
      totalPromedios += promedio;
      if (promedio >= 6) totalAprobados++;
      else totalDesaprobados++;
    }

    // Asistencias del alumno
    const asistenciasAlumno = (datos.asistencias || []).filter(
      (a) => a.alumnoCursoId === alumno.alumnoCursoId
    );

    const presentes = asistenciasAlumno.filter((a) => a.estado?.startsWith('presente')).length;
    const ausentes = asistenciasAlumno.filter((a) => a.estado === 'ausente').length;
    const justificadas = asistenciasAlumno.filter((a) => a.estado === 'justificada').length;
    const totalRegistros = asistenciasAlumno.length;

    totalAsistenciasPresentes += presentes + justificadas;
    totalAsistenciasTotal += totalRegistros;

    const porcentajeAsistencia =
      totalRegistros > 0 ? `${Math.round(((presentes + justificadas) / totalRegistros) * 100)}%` : '-';

    const estadoCondicion =
      promedio === null
        ? 'Sin notas'
        : promedio >= 7
        ? 'Aprobado'
        : promedio >= 6
        ? 'Aprobado (Justo)'
        : 'En Proceso / Desaprobado';

    const notasFormateadas =
      notasAlumno.length > 0
        ? notasAlumno.map((n) => `${n.valor} (${n.tipo.substring(0, 4)} T${n.trimestre})`).join(', ')
        : 'Sin notas';

    filasTabla.push([
      index + 1,
      `${alumno.apellido.toUpperCase()}, ${alumno.nombre}`,
      alumno.dni || '-',
      notasFormateadas,
      promedio !== null ? promedio.toFixed(2) : '-',
      presentes,
      ausentes,
      justificadas,
      porcentajeAsistencia,
      estadoCondicion,
    ]);
  });

  // 4. GENERAR TABLA CON AUTOTABLE
  autoTable(doc, {
    startY: 53,
    head: [
      [
        'N°',
        'Estudiante (Apellido y Nombre)',
        'DNI',
        'Detalle de Calificaciones',
        'Prom.',
        'Pres.',
        'Aus.',
        'Just.',
        '% Asis.',
        'Condición',
      ],
    ],
    body: filasTabla,
    theme: 'grid',
    headStyles: {
      fillColor: [76, 29, 149], // Violeta #4c1d95
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { fontStyle: 'bold', cellWidth: 55 },
      2: { halign: 'center', cellWidth: 20 },
      3: { cellWidth: 72 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 15 },
      5: { halign: 'center', cellWidth: 12 },
      6: { halign: 'center', cellWidth: 12 },
      7: { halign: 'center', cellWidth: 12 },
      8: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
      9: { halign: 'center', fontStyle: 'bold', cellWidth: 35 },
    },
    didParseCell: (data) => {
      // Colorear condicionalmente la columna de Condición
      if (data.section === 'body' && data.column.index === 9) {
        const val = String(data.cell.raw);
        if (val.startsWith('Aprobado')) {
          data.cell.styles.textColor = [22, 101, 52]; // Verde #166534
        } else if (val.includes('Desaprobado') || val.includes('En Proceso')) {
          data.cell.styles.textColor = [185, 28, 28]; // Rojo #b91c1c
        }
      }
    },
  });

  // 5. RESUMEN ESTADÍSTICO Y FIRMAS AL PIE
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  const posY = Math.min(finalY + 8, 175);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(46, 16, 101);
  doc.text('RESUMEN ESTADÍSTICO GRUPAL:', 14, posY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const cantAlumnos = alumnosOrdenados.length;
  const promGrupal =
    totalAprobados + totalDesaprobados > 0
      ? (totalPromedios / (totalAprobados + totalDesaprobados)).toFixed(2)
      : '-';

  const porcAsistenciaGrupal =
    totalAsistenciasTotal > 0
      ? `${Math.round((totalAsistenciasPresentes / totalAsistenciasTotal) * 100)}%`
      : '-';

  doc.text(
    `• Total Matriculados: ${cantAlumnos} | Promedio General del Aula: ${promGrupal} | Aprobados: ${totalAprobados} | En Proceso/Desaprobados: ${totalDesaprobados} | Asistencia General: ${porcAsistenciaGrupal}`,
    14,
    posY + 5
  );

  // Líneas para firma
  const firmaY = Math.min(posY + 20, 192);

  doc.setDrawColor(160, 160, 160);
  doc.line(40, firmaY, 110, firmaY);
  doc.line(180, firmaY, 250, firmaY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma y Aclaración del Docente', 50, firmaY + 4);
  doc.text('Firma y Sello de Dirección / Secretaría', 185, firmaY + 4);

  // Descargar archivo PDF
  const nombreArchivo = `Informe_${datos.materia.replace(/\s+/g, '_')}_${datos.anio.replace(/\s+/g, '_')}_${periodoTexto.replace(/\s+/g, '_')}.pdf`;
  doc.save(nombreArchivo);
}
