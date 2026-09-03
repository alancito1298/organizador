'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/shared/Navbar';
import BottomNav from '@/app/components/shared/BottomNav';
import Footer from '@/app/components/shared/Footer';
import SubMenuCursoNav from '@/app/components/shared/SubMenuCursoNav';
import PerfilAlumnoModal from '@/app/components/alumnos/PerfilAlumnoModal';
import { usePerfilAlumno } from '@/app/hooks/usePerfilAlumno';
import { getToken } from '@/lib/token';
import { exportarExcelCalificaciones } from '@/app/utils/exportarExcelCalificaciones';
import { exportarExcelAsistencias } from '@/app/utils/exportarExcelAsitencias';
import { exportarInformeCursoPdf } from '@/app/utils/exportarInformePdf';
import { Download, FileSpreadsheet, FileText, Search, ArrowUpDown, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type AlumnoCurso = {
  id: number;
  alumno: {
    id: number;
    nombre: string;
    apellido: string;
    dni?: string;
    contacto?: string;
  };
};

type Asistencia = {
  id: number;
  fecha: string;
  estado: string;
  alumnoCursoId: number;
};

type Calificacion = {
  id: number;
  valor: number;
  alumnoCursoId: number;
  tipo: string;
  trimestre: number;
  fecha: string;
};

type ColumnaEvaluacion = {
  tipo: string;
  trimestre: string;
  fecha: string;
};

const formatearGradoCurso = (anio: string | number | undefined) => {
  if (!anio) return '';
  const str = String(anio).trim();
  const lower = str.toLowerCase();
  if (lower.includes('año') || lower.includes('grado') || lower.includes('to') || lower.includes('do') || lower.includes('ro') || lower.includes('er')) {
    return str;
  }
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    const nombres: Record<number, string> = {
      1: '1er Año', 2: '2do Año', 3: '3er Año', 4: '4to Año', 5: '5to Año', 6: '6to Año', 7: '7mo Año',
    };
    return nombres[num] || `${num}° Año`;
  }
  return `${str}° Año`;
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

export default function PlanillaCursoClient() {
  const params = useParams();
  const cursoId = Number(params.id);
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [cursoInfo, setCursoInfo] = useState<{ materia: string; escuela: string; anio: string } | null>(null);
  const [inscripciones, setInscripciones] = useState<AlumnoCurso[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  // Pestañas: 1 (1° Trim), 2 (2° Trim), 3 (3° Trim), 4 (Consolidado Anual)
  const [trimestrePestana, setTrimestrePestana] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [criterioOrden, setCriterioOrden] = useState<'apellido' | 'asistencia' | 'promedio'>('apellido');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'promocionados' | 'riesgo'>('todos');

  // Descargas
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);

  // Perfil Alumno Modal
  const { perfil, cargarPerfil } = usePerfilAlumno();
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  useEffect(() => {
    if (!cursoId) return;
    fetchData();
  }, [cursoId]);

  const fetchData = async () => {
    setCargando(true);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resCurso, resInsc, resAsis, resNotas] = await Promise.all([
        fetch(`${API}/cursos`, { headers }),
        fetch(`${API}/inscripciones/curso/${rawId}`, { headers }),
        fetch(`${API}/asistencias/curso/${rawId}`, { headers }),
        fetch(`${API}/calificaciones/curso/${rawId}`, { headers }),
      ]);

      if (resCurso.ok) {
        const cursos = await resCurso.json();
        const cursoActual = cursos.find((c: any) => c.id === cursoId);
        if (cursoActual) {
          setCursoInfo({
            materia: cursoActual.materia,
            escuela: cursoActual.escuela,
            anio: cursoActual.anio,
          });
        }
      }

      if (resInsc.ok) {
        const dataInsc: AlumnoCurso[] = await resInsc.json();
        if (Array.isArray(dataInsc)) {
          dataInsc.sort((a, b) => a.alumno.apellido.localeCompare(b.alumno.apellido));
          setInscripciones(dataInsc);
        }
      }

      if (resAsis.ok) {
        const dataAsis = await resAsis.json();
        if (Array.isArray(dataAsis)) setAsistencias(dataAsis);
      }

      if (resNotas.ok) {
        const dataNotas = await resNotas.json();
        if (Array.isArray(dataNotas)) setCalificaciones(dataNotas);
      }
    } catch (err) {
      console.error('Error al cargar datos de la planilla:', err);
    } finally {
      setCargando(false);
    }
  };

  // Columnas de evaluaciones para el trimestre actual
  const columnasEvaluacionesTrimestre = useMemo(() => {
    const colsMap = new Map<string, ColumnaEvaluacion>();

    calificaciones.forEach((nota) => {
      const trimMatch = trimestrePestana === 4 || Number(nota.trimestre) === trimestrePestana;
      if (trimMatch) {
        const fechaFormat = nota.fecha ? nota.fecha.split('T')[0] : '';
        const key = `${nota.tipo}||${nota.trimestre}||${fechaFormat}`;
        if (!colsMap.has(key)) {
          colsMap.set(key, {
            tipo: nota.tipo,
            trimestre: String(nota.trimestre),
            fecha: fechaFormat,
          });
        }
      }
    });

    return [...colsMap.values()].sort((a, b) => {
      if (a.trimestre !== b.trimestre) return Number(a.trimestre) - Number(b.trimestre);
      return a.fecha.localeCompare(b.fecha);
    });
  }, [calificaciones, trimestrePestana]);

  // Datos procesados por alumno para la planilla
  const planillaProcesada = useMemo(() => {
    return inscripciones.map((insc) => {
      const alum = insc.alumno;

      // ── Asistencias del Trimestre / Anual ──
      const asistenciasAlumno = asistencias.filter((a) => {
        if (a.alumnoCursoId !== insc.id) return false;
        if (trimestrePestana === 4) return true;
        // Para asistencias, si a.fecha cae en trimestre o si el backend provee la propiedad
        const m = new Date(a.fecha.split('T')[0]).getMonth() + 1;
        let trimCalculado = 1;
        if (m >= 6 && m <= 8) trimCalculado = 2;
        else if (m >= 9) trimCalculado = 3;
        return trimCalculado === trimestrePestana;
      });

      const totalClases = asistenciasAlumno.length;
      const presentes = asistenciasAlumno.filter(
        (a) => a.estado === 'presente_buen_concepto' || a.estado === 'presente'
      ).length;
      const presenteMalConcepto = asistenciasAlumno.filter((a) => a.estado === 'presente_mal_concepto').length;
      const ausentes = asistenciasAlumno.filter((a) => a.estado === 'ausente').length;
      const justificadas = asistenciasAlumno.filter((a) => a.estado === 'justificada').length;

      const totalAsistieron = presentes + presenteMalConcepto;
      const porcentajeAsistencia = totalClases > 0 ? Math.round((totalAsistieron / totalClases) * 100) : 0;

      // ── Evaluaciones Conceptuales del Trimestre ──
      let conceptoEstado = 'Sin registros';
      let conceptoBadge = 'bg-gray-100 text-gray-600 border-gray-200';
      let conceptoIcono = 'help_outline';

      if (totalAsistieron > 0) {
        const ratioMalConcepto = presenteMalConcepto / totalAsistieron;
        if (ratioMalConcepto === 0 && presentes > 0) {
          conceptoEstado = 'Excelente Concepto';
          conceptoBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          conceptoIcono = 'stars';
        } else if (ratioMalConcepto < 0.25) {
          conceptoEstado = 'Muy Buen Concepto';
          conceptoBadge = 'bg-green-50 text-green-700 border-green-200';
          conceptoIcono = 'thumb_up';
        } else if (ratioMalConcepto < 0.5) {
          conceptoEstado = 'Concepto Regular';
          conceptoBadge = 'bg-amber-50 text-amber-700 border-amber-200';
          conceptoIcono = 'warning';
        } else {
          conceptoEstado = 'A Mejorar Concepto';
          conceptoBadge = 'bg-rose-50 text-rose-700 border-rose-200';
          conceptoIcono = 'error';
        }
      }

      // ── Calificaciones del Trimestre ──
      const notasTrimestre: number[] = [];
      const notasPorColumna: Record<string, number | null> = {};

      columnasEvaluacionesTrimestre.forEach((col) => {
        const key = `${col.tipo}||${col.trimestre}||${col.fecha}`;
        const notaObj = calificaciones.find(
          (n) =>
            n.alumnoCursoId === insc.id &&
            n.tipo === col.tipo &&
            String(n.trimestre) === col.trimestre &&
            n.fecha.split('T')[0] === col.fecha
        );

        if (notaObj && !isNaN(Number(notaObj.valor)) && Number(notaObj.valor) > 0) {
          const val = Number(notaObj.valor);
          notasPorColumna[key] = val;
          notasTrimestre.push(val);
        } else {
          notasPorColumna[key] = null;
        }
      });

      const promedioTrimestral =
        notasTrimestre.length > 0
          ? Math.round((notasTrimestre.reduce((a, b) => a + b, 0) / notasTrimestre.length) * 10) / 10
          : null;

      // Promedios de cada trimestre para la vista consolidada anual (Tab 4)
      const notasT1 = calificaciones.filter((n) => n.alumnoCursoId === insc.id && Number(n.trimestre) === 1 && Number(n.valor) > 0).map((n) => Number(n.valor));
      const notasT2 = calificaciones.filter((n) => n.alumnoCursoId === insc.id && Number(n.trimestre) === 2 && Number(n.valor) > 0).map((n) => Number(n.valor));
      const notasT3 = calificaciones.filter((n) => n.alumnoCursoId === insc.id && Number(n.trimestre) === 3 && Number(n.valor) > 0).map((n) => Number(n.valor));

      const promT1 = notasT1.length > 0 ? Math.round((notasT1.reduce((a, b) => a + b, 0) / notasT1.length) * 10) / 10 : null;
      const promT2 = notasT2.length > 0 ? Math.round((notasT2.reduce((a, b) => a + b, 0) / notasT2.length) * 10) / 10 : null;
      const promT3 = notasT3.length > 0 ? Math.round((notasT3.reduce((a, b) => a + b, 0) / notasT3.length) * 10) / 10 : null;

      const promsDisponibles = [promT1, promT2, promT3].filter((p): p is number => p !== null);
      const promedioFinalAnual =
        promsDisponibles.length > 0
          ? Math.round((promsDisponibles.reduce((a, b) => a + b, 0) / promsDisponibles.length) * 10) / 10
          : null;

      return {
        inscripcionId: insc.id,
        alumnoId: alum.id,
        nombre: alum.nombre,
        apellido: alum.apellido,
        dni: alum.dni,
        totalClases,
        presentes,
        presenteMalConcepto,
        ausentes,
        justificadas,
        porcentajeAsistencia,
        conceptoEstado,
        conceptoBadge,
        conceptoIcono,
        notasPorColumna,
        promedioTrimestral,
        promT1,
        promT2,
        promT3,
        promedioFinalAnual,
      };
    });
  }, [inscripciones, asistencias, calificaciones, trimestrePestana, columnasEvaluacionesTrimestre]);

  // Filtrar y ordenar lista procesada
  const planillaFiltradaYOrdenada = useMemo(() => {
    let result = [...planillaProcesada];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) => a.nombre.toLowerCase().includes(q) || a.apellido.toLowerCase().includes(q)
      );
    }

    if (filtroEstado === 'promocionados') {
      result = result.filter((a) => (a.promedioTrimestral !== null ? a.promedioTrimestral >= 6 : false));
    } else if (filtroEstado === 'riesgo') {
      result = result.filter((a) => (a.promedioTrimestral !== null ? a.promedioTrimestral < 6 : true));
    }

    if (criterioOrden === 'apellido') {
      result.sort((a, b) => a.apellido.localeCompare(b.apellido));
    } else if (criterioOrden === 'asistencia') {
      result.sort((a, b) => b.porcentajeAsistencia - a.porcentajeAsistencia);
    } else if (criterioOrden === 'promedio') {
      result.sort((a, b) => (b.promedioTrimestral ?? 0) - (a.promedioTrimestral ?? 0));
    }

    return result;
  }, [planillaProcesada, searchQuery, filtroEstado, criterioOrden]);

  const abrirPerfilAlumno = async (inscripcionId: number) => {
    await cargarPerfil(inscripcionId);
    setPerfilAbierto(true);
  };

  const handleExportarExcelPlanilla = async () => {
    try {
      setDescargandoExcel(true);
      if (trimestrePestana === 4) {
        const colsMap = new Map<string, { tipo: string; trimestre: string; fecha: string }>();
        calificaciones.forEach((n) => {
          const col = { tipo: n.tipo, trimestre: String(n.trimestre), fecha: n.fecha.split('T')[0] };
          colsMap.set(`${col.tipo}||${col.trimestre}||${col.fecha}`, col);
        });
        const cols = Array.from(colsMap.values());
        const matriz: string[][] = inscripciones.map((insc) =>
          cols.map((col) => {
            const found = calificaciones.find(
              (n) => n.alumnoCursoId === insc.id && n.tipo === col.tipo && String(n.trimestre) === col.trimestre && n.fecha.split('T')[0] === col.fecha
            );
            return found ? String(found.valor) : '';
          })
        );
        await exportarExcelCalificaciones({
          columnas: cols,
          datos: matriz,
          inscripciones,
          curso: cursoInfo || undefined,
        });
      } else {
        await exportarExcelAsistencias({
          curso: cursoInfo || undefined,
          rawId: String(cursoId),
          inscripciones,
        });
      }
    } catch (err) {
      console.error('Error al exportar planilla:', err);
    } finally {
      setDescargandoExcel(false);
    }
  };

  const handleExportarPdfPlanilla = async () => {
    try {
      setDescargandoPdf(true);
      exportarInformeCursoPdf({
        escuela: cursoInfo?.escuela || '',
        anio: cursoInfo?.anio || '',
        materia: cursoInfo?.materia || '',
        alumnos: inscripciones.map((i) => ({
          id: i.alumno.id,
          alumnoCursoId: i.id,
          nombre: i.alumno.nombre,
          apellido: i.alumno.apellido,
        })),
        calificaciones: calificaciones.map((n) => ({
          alumnoCursoId: n.alumnoCursoId,
          valor: Number(n.valor),
          tipo: n.tipo,
          trimestre: Number(n.trimestre) || 1,
          fecha: n.fecha,
        })),
        asistencias,
      });
    } catch (err) {
      console.error('Error al generar PDF:', err);
    } finally {
      setDescargandoPdf(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-margin-page pt-28 md:pt-36 pb-32">
        {/* Encabezado */}
        <section className="mb-4">
          <h1 className="font-display-lg text-3xl md:text-4xl text-accent-violet uppercase tracking-tight font-extrabold flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">table_chart</span>
            Planillas Trimestrales de Seguimiento
          </h1>
          <p className="text-secondary text-sm font-semibold mt-1">
            Visualización integral de asistencia, concepto y calificaciones por trimestre estilo planilla.
          </p>
        </section>

        {/* Sub-Navegación del Curso */}
        <SubMenuCursoNav
          cursoId={cursoId}
          seccionActual="planilla"
          materia={cursoInfo?.materia}
          escuela={cursoInfo?.escuela}
          anio={cursoInfo?.anio}
        />

        {/* Pestañas de Selector de Trimestre */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface-bg neumorphic-raised p-2 rounded-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setTrimestrePestana(t)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                  trimestrePestana === t
                    ? 'bg-accent-violet text-white shadow-md font-extrabold'
                    : 'text-secondary hover:text-accent-violet hover:bg-violet-50/60'
                }`}
              >
                <span className="material-symbols-outlined text-base">calendar_view_week</span>
                {t}° Trimestre
              </button>
            ))}
            <button
              onClick={() => setTrimestrePestana(4)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                trimestrePestana === 4
                  ? 'bg-accent-violet text-white shadow-md font-extrabold'
                  : 'text-secondary hover:text-accent-violet hover:bg-violet-50/60'
              }`}
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              Consolidado Anual
            </button>
          </div>

          {/* Botones de Descarga */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportarExcelPlanilla}
              disabled={descargandoExcel}
              className="px-3.5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-emerald-700 font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Descargar esta planilla en formato Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{descargandoExcel ? 'Generando...' : 'Excel'}</span>
            </button>
            <button
              onClick={handleExportarPdfPlanilla}
              disabled={descargandoPdf}
              className="px-3.5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-rose-700 font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Descargar planilla o informe en PDF"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>{descargandoPdf ? 'Generando...' : 'PDF'}</span>
            </button>
          </div>
        </div>

        {/* Buscador & Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estudiante en la planilla..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-bg neumorphic-inset text-xs font-semibold focus:outline-none text-on-surface"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-secondary">
            {/* Ordenamiento */}
            <div className="flex items-center gap-1 bg-surface-bg neumorphic-inset rounded-xl p-1">
              <span className="text-[10px] uppercase font-bold text-secondary px-2 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Orden:
              </span>
              <button
                onClick={() => setCriterioOrden('apellido')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  criterioOrden === 'apellido' ? 'bg-accent-violet text-white shadow-xs' : 'hover:text-accent-violet'
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setCriterioOrden('asistencia')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  criterioOrden === 'asistencia' ? 'bg-accent-violet text-white shadow-xs' : 'hover:text-accent-violet'
                }`}
              >
                % Asist
              </button>
              <button
                onClick={() => setCriterioOrden('promedio')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  criterioOrden === 'promedio' ? 'bg-accent-violet text-white shadow-xs' : 'hover:text-accent-violet'
                }`}
              >
                Promedio
              </button>
            </div>

            {/* Filtro por estado */}
            <select
              value={filtroEstado}
              onChange={(e: any) => setFiltroEstado(e.target.value)}
              className="py-2 px-3 rounded-xl bg-surface-bg neumorphic-raised text-xs font-bold text-accent-violet focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos los Alumnos</option>
              <option value="promocionados">Aprobados / Promocionados (≥ 6)</option>
              <option value="riesgo">En Riesgo (&lt; 6)</option>
            </select>
          </div>
        </div>

        {/* Planilla Grid Estilo Excel / Spreadsheet */}
        {cargando ? (
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-accent-violet">Cargando planilla del curso...</p>
          </div>
        ) : planillaFiltradaYOrdenada.length === 0 ? (
          <div className="bg-surface-bg neumorphic-inset rounded-3xl p-8 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-secondary">grid_off</span>
            <p className="text-sm font-bold text-secondary">No se encontraron estudiantes para mostrar en la planilla.</p>
          </div>
        ) : (
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-4 overflow-hidden border border-white/60 shadow-lg">
            <div className="overflow-x-auto no-scrollbar max-w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                {/* Categorías de Columnas Supremos */}
                <thead>
                  <tr className="bg-surface-bg text-accent-violet text-[11px] font-extrabold uppercase tracking-wider border-b border-outline-variant/30">
                    <th className="p-3 bg-violet-50/80 sticky left-0 z-20 shadow-sm border-r border-violet-200">
                      1. Alumnos ({planillaFiltradaYOrdenada.length})
                    </th>
                    <th className="p-3 text-center bg-emerald-50/60 border-r border-emerald-200/80" colSpan={4}>
                      2. Asistencia ({trimestrePestana === 4 ? 'Anual' : `${trimestrePestana}° Trim`})
                    </th>
                    <th className="p-3 text-center bg-amber-50/60 border-r border-amber-200/80">
                      3. Concepto
                    </th>
                    {trimestrePestana < 4 ? (
                      <>
                        <th
                          className="p-3 text-center bg-indigo-50/60 border-r border-indigo-200/80"
                          colSpan={Math.max(columnasEvaluacionesTrimestre.length, 1)}
                        >
                          4. Calificaciones y Trabajos ({columnasEvaluacionesTrimestre.length} Evaluaciones)
                        </th>
                        <th className="p-3 text-center bg-violet-100/70 text-accent-violet font-extrabold">
                          Promedio {trimestrePestana}° Trim
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="p-3 text-center bg-violet-50/70 border-r border-violet-200/80">Prom. 1° Trim</th>
                        <th className="p-3 text-center bg-violet-50/70 border-r border-violet-200/80">Prom. 2° Trim</th>
                        <th className="p-3 text-center bg-violet-50/70 border-r border-violet-200/80">Prom. 3° Trim</th>
                        <th className="p-3 text-center bg-violet-900 text-white font-extrabold">Promedio Final Anual</th>
                      </>
                    )}
                  </tr>

                  {/* Encabezados de Sub-columnas */}
                  <tr className="bg-surface-bg text-secondary text-[10px] font-extrabold uppercase border-b border-outline-variant/40">
                    <th className="p-2.5 sticky left-0 z-20 bg-surface-bg border-r border-outline-variant/30">
                      Estudiante
                    </th>
                    <th className="p-2 text-center text-emerald-800" title="Presentes">P</th>
                    <th className="p-2 text-center text-amber-800" title="Presente Mal Concepto">PMC</th>
                    <th className="p-2 text-center text-rose-800" title="Ausentes">A</th>
                    <th className="p-2 text-center text-emerald-950 font-extrabold border-r border-outline-variant/30">% Asist</th>
                    <th className="p-2 text-center border-r border-outline-variant/30">Evaluación Conceptual</th>

                    {trimestrePestana < 4 ? (
                      <>
                        {columnasEvaluacionesTrimestre.length === 0 ? (
                          <th className="p-2 text-center text-gray-400 italic border-r border-outline-variant/30">Sin evaluaciones</th>
                        ) : (
                          columnasEvaluacionesTrimestre.map((col, idx) => (
                            <th key={`head-col-${idx}`} className="p-2 text-center font-bold text-accent-violet truncate max-w-[110px]" title={`${col.tipo} - ${col.fecha}`}>
                              {formatearTipoEvaluacion(col.tipo)} <br />
                              <span className="text-[9px] text-secondary font-semibold">{col.fecha ? col.fecha.slice(5) : ''}</span>
                            </th>
                          ))
                        )}
                        <th className="p-2 text-center font-extrabold text-accent-violet">Nota Final</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2 text-center">1° T</th>
                        <th className="p-2 text-center">2° T</th>
                        <th className="p-2 text-center">3° T</th>
                        <th className="p-2 text-center font-extrabold text-accent-violet">Final</th>
                      </>
                    )}
                  </tr>
                </thead>

                {/* Filas de Estudiantes */}
                <tbody className="divide-y divide-outline-variant/20 font-medium">
                  {planillaFiltradaYOrdenada.map((alum, rowIdx) => (
                    <tr
                      key={alum.inscripcionId}
                      className={`hover:bg-violet-50/40 transition-colors ${rowIdx % 2 === 0 ? 'bg-surface-bg' : 'bg-surface-bg/60'}`}
                    >
                      {/* Columna Alumno Fija (Sticky) */}
                      <td className="p-2.5 sticky left-0 z-10 bg-surface-bg border-r border-outline-variant/30 shadow-xs">
                        <button
                          onClick={() => abrirPerfilAlumno(alum.inscripcionId)}
                          className="flex items-center gap-2 text-left hover:text-accent-violet group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center text-accent-violet font-extrabold text-[11px] shrink-0">
                            {alum.apellido.charAt(0)}
                          </div>
                          <div className="truncate">
                            <span className="font-extrabold text-on-surface group-hover:text-accent-violet block truncate leading-tight">
                              {alum.apellido}, {alum.nombre}
                            </span>
                            {alum.dni && <span className="text-[10px] text-secondary block font-semibold leading-none">DNI: {alum.dni}</span>}
                          </div>
                        </button>
                      </td>

                      {/* Asistencia */}
                      <td className="p-2 text-center font-bold text-emerald-700">{alum.presentes}</td>
                      <td className="p-2 text-center font-bold text-amber-600">{alum.presenteMalConcepto}</td>
                      <td className="p-2 text-center font-bold text-rose-600">{alum.ausentes}</td>
                      <td className="p-2 text-center font-extrabold border-r border-outline-variant/30">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          alum.porcentajeAsistencia >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {alum.porcentajeAsistencia}%
                        </span>
                      </td>

                      {/* Concepto */}
                      <td className="p-2 text-center border-r border-outline-variant/30">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${alum.conceptoBadge}`}>
                          <span className="material-symbols-outlined text-[13px]">{alum.conceptoIcono}</span>
                          {alum.conceptoEstado}
                        </span>
                      </td>

                      {/* Calificaciones */}
                      {trimestrePestana < 4 ? (
                        <>
                          {columnasEvaluacionesTrimestre.length === 0 ? (
                            <td className="p-2 text-center text-gray-400 font-semibold border-r border-outline-variant/30">-</td>
                          ) : (
                            columnasEvaluacionesTrimestre.map((col, idx) => {
                              const key = `${col.tipo}||${col.trimestre}||${col.fecha}`;
                              const val = alum.notasPorColumna[key];
                              return (
                                <td key={`cell-nota-${idx}`} className="p-2 text-center font-extrabold">
                                  {val !== null ? (
                                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                                      val >= 6 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {val}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300 font-bold">-</span>
                                  )}
                                </td>
                              );
                            })
                          )}
                          {/* Promedio Trimestral */}
                          <td className="p-2 text-center font-extrabold">
                            {alum.promedioTrimestral !== null ? (
                              <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xs ${
                                alum.promedioTrimestral >= 6 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}>
                                {alum.promedioTrimestral}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-semibold text-xs">-</span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Promedios Consolidados Anuales */}
                          <td className="p-2 text-center font-bold text-on-surface">
                            {alum.promT1 !== null ? <span className={alum.promT1 >= 6 ? 'text-emerald-700' : 'text-rose-600'}>{alum.promT1}</span> : '-'}
                          </td>
                          <td className="p-2 text-center font-bold text-on-surface">
                            {alum.promT2 !== null ? <span className={alum.promT2 >= 6 ? 'text-emerald-700' : 'text-rose-600'}>{alum.promT2}</span> : '-'}
                          </td>
                          <td className="p-2 text-center font-bold text-on-surface">
                            {alum.promT3 !== null ? <span className={alum.promT3 >= 6 ? 'text-emerald-700' : 'text-rose-600'}>{alum.promT3}</span> : '-'}
                          </td>
                          <td className="p-2 text-center font-black text-xs">
                            {alum.promedioFinalAnual !== null ? (
                              <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-md ${
                                alum.promedioFinalAnual >= 6 ? 'bg-violet-900 text-white' : 'bg-rose-700 text-white'
                              }`}>
                                {alum.promedioFinalAnual}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-bold">-</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Ficha Alumno */}
      <PerfilAlumnoModal
        perfil={perfil}
        abierto={perfilAbierto}
        onCerrar={() => setPerfilAbierto(false)}
      />

      <Footer />
      <BottomNav />
    </div>
  );
}
