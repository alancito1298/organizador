'use client';

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/shared/Navbar";
import BottomNav from "@/app/components/shared/BottomNav";
import Footer from "@/app/components/shared/Footer";
import { usePerfilAlumno } from "@/app/hooks/usePerfilAlumno";
import PerfilAlumnoModal from "@/app/components/alumnos/PerfilAlumnoModal";
import ImportarAlumnosModal from "@/app/components/alumnos/ImportarAlumnosModal";
import PasoAsistenciaModal from "@/app/components/alumnos/PasoAsistenciaModal";
import PasoConceptoModal from "@/app/components/alumnos/PasoConceptoModal";
import { FileSpreadsheet, Download, FileText } from "lucide-react";
import { exportarExcelAsistencias } from "@/app/utils/exportarExcelAsitencias";
import { exportarExcelCalificaciones } from "@/app/utils/exportarExcelCalificaciones";
import { exportarInformeCursoPdf } from "@/app/utils/exportarInformePdf";
import { getToken } from "@/lib/token";
import type { Alumno, AlumnoConStats } from "@/app/types/alumnos";
export type { Alumno, AlumnoConStats };

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

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
      1: '1er Año',
      2: '2do Año',
      3: '3er Año',
      4: '4to Año',
      5: '5to Año',
      6: '6to Año',
      7: '7mo Año',
    };
    return nombres[num] || `${num}° Año`;
  }
  return `${str}° Año`;
};

type CriterioOrden = 'alfabetico-asc' | 'alfabetico-desc' | 'asistencia' | 'calificaciones';

export default function AlumnosClient() {
  const params = useParams();
  const cursoId = Number(params.id);

  const [alumnos, setAlumnos] = useState<AlumnoConStats[]>([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true);
  const [cursoInfo, setCursoInfo] = useState<{ materia: string; escuela: string; anio: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [criterioOrden, setCriterioOrden] = useState<CriterioOrden>('alfabetico-asc');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Modales
  const [modalAgregar, setModalAgregar] = useState(false);
  const [formNuevo, setFormNuevo] = useState({ nombre: "", apellido: "", contacto: "", dni: "" });
  const [guardandoNuevo, setGuardandoNuevo] = useState(false);

  const [editandoAlumno, setEditandoAlumno] = useState<Alumno | null>(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", apellido: "", contacto: "", dni: "" });
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [importarAbierto, setImportarAbierto] = useState(false);
  const [asistenciaModalAbierto, setAsistenciaModalAbierto] = useState(false);
  const [conceptoModalAbierto, setConceptoModalAbierto] = useState(false);

  // Estados de Descarga
  const [descargandoAsistencias, setDescargandoAsistencias] = useState(false);
  const [descargandoCalificaciones, setDescargandoCalificaciones] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [menuDescargasAbierto, setMenuDescargasAbierto] = useState(false);

  // Trimestre Activo
  const [trimestreActivo, setTrimestreActivo] = useState<number>(1);
  const [modalCerrarTrimestre, setModalCerrarTrimestre] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trimestreActivo');
    if (saved && [1, 2, 3].includes(Number(saved))) {
      setTrimestreActivo(Number(saved));
    } else {
      setTrimestreActivo(1);
      localStorage.setItem('trimestreActivo', '1');
    }
  }, []);

  const cambiarTrimestre = (t: number) => {
    setTrimestreActivo(t);
    localStorage.setItem('trimestreActivo', String(t));
  };

  const avanzarSiguienteTrimestre = () => {
    if (trimestreActivo < 3) {
      cambiarTrimestre(trimestreActivo + 1);
    } else {
      cambiarTrimestre(1);
    }
    setModalCerrarTrimestre(false);
  };

  const { perfil, cargarPerfil } = usePerfilAlumno();

  useEffect(() => {
    if (!cursoId) return;
    fetchCurso();
    fetchAlumnos();
  }, [cursoId]);

  const fetchCurso = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API}/cursos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const cursos = await res.json();
        const cursoActual = cursos.find((c: any) => c.id === cursoId);
        if (cursoActual) {
          setCursoInfo({
            materia: cursoActual.materia,
            escuela: cursoActual.escuela,
            anio: cursoActual.anio,
          });
        }
      }
    } catch (e) {
      console.error("Error fetching curso:", e);
    }
  };

  const fetchAlumnos = async () => {
    setCargandoAlumnos(true);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [resInscripciones, resAsistencias, resCalificaciones] = await Promise.all([
        fetch(`${API}/inscripciones/curso/${cursoId}`, { headers }),
        fetch(`${API}/asistencias/curso/${cursoId}`, { headers }),
        fetch(`${API}/calificaciones/curso/${cursoId}`, { headers }),
      ]);

      const dataInscripciones = resInscripciones.ok ? await resInscripciones.json() : [];
      const dataAsistencias = resAsistencias.ok ? await resAsistencias.json() : [];
      const dataCalificaciones = resCalificaciones.ok ? await resCalificaciones.json() : [];

      if (Array.isArray(dataInscripciones)) {
        const alumnosConStats: AlumnoConStats[] = dataInscripciones
          .map((i: any): AlumnoConStats | null => {
            const alum = i.alumno;
            if (!alum) return null;

            // Calcular asistencias
            const asistenciasAlumno = Array.isArray(dataAsistencias)
              ? dataAsistencias.filter((a: any) => a.alumnoCursoId === i.id)
              : [];
            const totalClases = asistenciasAlumno.length;
            const presentes = asistenciasAlumno.filter(
              (a: any) =>
                a.estado === 'presente_buen_concepto' ||
                a.estado === 'presente_mal_concepto' ||
                a.estado === 'presente'
            ).length;
            const asistenciaCalc = totalClases > 0 ? Math.round((presentes / totalClases) * 100) : 0;

            // Calcular calificaciones
            const notasAlumno = Array.isArray(dataCalificaciones)
              ? dataCalificaciones.filter((c: any) => c.alumnoCursoId === i.id && !isNaN(Number(c.nota)) && Number(c.nota) > 0)
              : [];
            const notasT1 = notasAlumno.filter((c: any) => String(c.trimestre) === '1');

            const sumGeneral = notasAlumno.reduce((acc: number, n: any) => acc + Number(n.nota), 0);
            const sumT1 = notasT1.reduce((acc: number, n: any) => acc + Number(n.nota), 0);

            const promGeneral = notasAlumno.length > 0 ? Math.round((sumGeneral / notasAlumno.length) * 10) / 10 : 0;
            const promT1 = notasT1.length > 0 ? Math.round((sumT1 / notasT1.length) * 10) / 10 : 0;

            return {
              id: alum.id,
              alumnoCursoId: i.id,
              nombre: alum.nombre,
              apellido: alum.apellido,
              contacto: alum.contacto || undefined,
              dni: alum.dni || undefined,
              asistenciaPorcentaje: asistenciaCalc,
              primerTrimestre: promT1,
              promedioGeneral: promGeneral,
            };
          })
          .filter((a): a is AlumnoConStats => Boolean(a));

        setAlumnos(alumnosConStats);
      }
    } catch (e) {
      console.error("Error fetching alumnos:", e);
    } finally {
      setCargandoAlumnos(false);
    }
  };

  // Cálculo del Hero (Top 2 Asistencias y Top 2 Calificaciones)
  const heroAlumnos = useMemo(() => {
    if (alumnos.length === 0) {
      return { topAsistencias: [], topCalificaciones: [] };
    }

    // Ordenados por asistencia desc
    const sortedByAsistencia = [...alumnos].sort((a, b) => b.asistenciaPorcentaje - a.asistenciaPorcentaje);
    const topAsistencias = sortedByAsistencia.slice(0, 2);

    // Ordenados por calificación general desc
    const sortedByNotas = [...alumnos].sort((a, b) => (b.promedioGeneral || b.primerTrimestre) - (a.promedioGeneral || a.primerTrimestre));
    const topCalificaciones = sortedByNotas.slice(0, 2);

    return { topAsistencias, topCalificaciones };
  }, [alumnos]);

  // Lista filtrada y ordenada para la búsqueda y listado general
  const alumnosFiltradosYOrdenados = useMemo(() => {
    let result = [...alumnos];

    // Búsqueda por nombre o apellido
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.nombre.toLowerCase().includes(q) ||
          a.apellido.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    switch (criterioOrden) {
      case 'alfabetico-asc':
        result.sort((a, b) => {
          const comp = a.apellido.localeCompare(b.apellido);
          return comp !== 0 ? comp : a.nombre.localeCompare(b.nombre);
        });
        break;
      case 'alfabetico-desc':
        result.sort((a, b) => {
          const comp = b.apellido.localeCompare(a.apellido);
          return comp !== 0 ? comp : b.nombre.localeCompare(a.nombre);
        });
        break;
      case 'asistencia':
        result.sort((a, b) => b.asistenciaPorcentaje - a.asistenciaPorcentaje);
        break;
      case 'calificaciones':
        result.sort((a, b) => (b.promedioGeneral || b.primerTrimestre) - (a.promedioGeneral || a.primerTrimestre));
        break;
    }

    return result;
  }, [alumnos, searchQuery, criterioOrden]);

  const abrirPerfil = async (alumnoCursoId: number) => {
    if (alumnoCursoId < 0) return;
    await cargarPerfil(alumnoCursoId);
    setPerfilAbierto(true);
  };

  const handleCrearAlumno = async () => {
    if (!formNuevo.nombre.trim() || !formNuevo.apellido.trim()) {
      alert("Nombre y apellido son obligatorios");
      return;
    }

    setGuardandoNuevo(true);
    const token = getToken();
    try {
      const resAlumno = await fetch(`${API}/alumnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formNuevo.nombre.trim(),
          apellido: formNuevo.apellido.trim(),
          dni: formNuevo.dni.trim() || undefined,
          contacto: formNuevo.contacto.trim() || undefined,
        }),
      });

      if (!resAlumno.ok) throw new Error("Error creando alumno");
      const alumnoCreado = await resAlumno.json();

      const resInscripcion = await fetch(`${API}/inscripciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alumnoId: Number(alumnoCreado.id),
          cursoId: Number(cursoId),
        }),
      });

      if (!resInscripcion.ok) throw new Error("Error en la inscripción");

      setFormNuevo({ nombre: "", apellido: "", contacto: "", dni: "" });
      setModalAgregar(false);
      await fetchAlumnos();
    } catch (err) {
      alert("❌ Ocurrió un error al crear el alumno");
    } finally {
      setGuardandoNuevo(false);
    }
  };

  const handleEditar = (alumno: Alumno) => {
    setEditandoAlumno(alumno);
    setFormEdit({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      contacto: alumno.contacto ?? "",
      dni: alumno.dni ?? "",
    });
  };

  const confirmarEditar = async () => {
    if (!editandoAlumno) return;
    setGuardandoEdit(true);
    const token = getToken();
    try {
      const res = await fetch(`${API}/alumnos/${editandoAlumno.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formEdit),
      });
      if (!res.ok) throw new Error();
      const actualizado = await res.json();
      setAlumnos((prev) =>
        prev.map((a) => (a.id === editandoAlumno.id ? { ...a, ...actualizado } : a))
      );
      setEditandoAlumno(null);
    } catch {
      alert("Error al editar el alumno");
    } finally {
      setGuardandoEdit(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!eliminandoId) return;
    const token = getToken();
    try {
      const res = await fetch(`${API}/alumnos/${eliminandoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAlumnos((prev) => prev.filter((a) => a.id !== eliminandoId));
    } catch {
      alert("Error al eliminar el alumno");
    } finally {
      setEliminandoId(null);
    }
  };

  const materiaNombre = cursoInfo?.materia ? cursoInfo.materia.toUpperCase() : 'MATERIA';
  const escuelaNombre = cursoInfo?.escuela ? cursoInfo.escuela : 'E.E.S. N°12 "Juan B. Justo"';

  // ── Funciones de Descarga ──
  const handleDescargarAsistenciasExcel = async () => {
    try {
      setDescargandoAsistencias(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const resInsc = await fetch(`${API}/inscripciones/curso/${cursoId}`, { headers });
      const inscripcionesData = await resInsc.json();
      if (Array.isArray(inscripcionesData)) {
        inscripcionesData.sort((a: any, b: any) => a.alumno.apellido.localeCompare(b.alumno.apellido));
      }

      await exportarExcelAsistencias({
        curso: cursoInfo || undefined,
        rawId: String(cursoId),
        inscripciones: inscripcionesData || [],
      });
    } catch (err) {
      console.error("Error al exportar asistencias:", err);
      alert("❌ Error al exportar asistencias");
    } finally {
      setDescargandoAsistencias(false);
    }
  };

  const handleDescargarCalificacionesExcel = async () => {
    try {
      setDescargandoCalificaciones(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const resInsc = await fetch(`${API}/inscripciones/curso/${cursoId}`, { headers });
      const inscripcionesData = await resInsc.json();
      if (Array.isArray(inscripcionesData)) {
        inscripcionesData.sort((a: any, b: any) => a.alumno.apellido.localeCompare(b.alumno.apellido));
      }

      const resNotas = await fetch(`${API}/calificaciones/curso/${cursoId}`, { headers });
      const notasData = await resNotas.json();

      const colsMap = new Map<string, { tipo: string; trimestre: string; fecha: string }>();
      for (const nota of (notasData || [])) {
        const col = {
          tipo: nota.tipo,
          trimestre: String(nota.trimestre),
          fecha: nota.fecha.split("T")[0],
        };
        const key = `${col.tipo}||${col.trimestre}||${col.fecha}`;
        if (!colsMap.has(key)) colsMap.set(key, col);
      }
      const cols = Array.from(colsMap.values());

      const matrizDatos: string[][] = (inscripcionesData || []).map((insc: any) =>
        cols.map((col) => {
          const encontrada = (notasData || []).find(
            (n: any) =>
              n.alumnoCursoId === insc.id &&
              n.tipo === col.tipo &&
              String(n.trimestre) === col.trimestre &&
              n.fecha.split("T")[0] === col.fecha
          );
          return encontrada ? String(encontrada.valor) : "";
        })
      );

      await exportarExcelCalificaciones({
        columnas: cols,
        datos: matrizDatos,
        inscripciones: inscripcionesData || [],
        curso: cursoInfo ? cursoInfo : undefined,
      });
    } catch (err) {
      console.error("Error al exportar calificaciones:", err);
      alert("❌ Error al exportar calificaciones");
    } finally {
      setDescargandoCalificaciones(false);
    }
  };

  const handleDescargarPdf = async () => {
    try {
      setDescargandoPdf(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [resInsc, resAsis, resNotas] = await Promise.all([
        fetch(`${API}/inscripciones/curso/${cursoId}`, { headers }),
        fetch(`${API}/asistencias/curso/${cursoId}`, { headers }),
        fetch(`${API}/calificaciones/curso/${cursoId}`, { headers }),
      ]);

      const inscData = resInsc.ok ? await resInsc.json() : [];
      const asisData = resAsis.ok ? await resAsis.json() : [];
      const notasData = resNotas.ok ? await resNotas.json() : [];

      exportarInformeCursoPdf({
        escuela: cursoInfo?.escuela || '',
        anio: cursoInfo?.anio || '',
        materia: cursoInfo?.materia || '',
        alumnos: (inscData || []).map((i: any) => ({
          id: i.alumno.id,
          alumnoCursoId: i.id,
          nombre: i.alumno.nombre,
          apellido: i.alumno.apellido,
        })),
        calificaciones: (notasData || []).map((n: any) => ({
          alumnoCursoId: n.alumnoCursoId,
          valor: parseFloat(n.valor),
          tipo: n.tipo,
          trimestre: Number(n.trimestre) || 1,
          fecha: n.fecha,
        })),
        asistencias: asisData || [],
      });
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("❌ Error al generar el informe PDF");
    } finally {
      setDescargandoPdf(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-margin-page pt-28 md:pt-36 pb-32">
        {/* ── Encabezado de la página ── */}
        <section className="mb-8 flex flex-col gap-1.5">
          <h1 className="font-display-lg text-4xl md:text-5xl text-accent-violet uppercase tracking-tight font-extrabold">
            ALUMNOS
          </h1>
          <p className="font-body-lg text-secondary flex items-center gap-2 flex-wrap">
            {cursoInfo?.anio && (
              <span className="px-3 py-1 rounded-full neumorphic-inset text-xs font-extrabold text-accent-violet">
                {formatearGradoCurso(cursoInfo.anio)}
              </span>
            )}
            <span className="font-bold text-on-surface">{materiaNombre}</span>
            <span className="text-secondary">— {escuelaNombre}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
            <span>Año escolar: 2026 - 2027</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full neumorphic-inset text-[10px] font-bold text-accent-violet">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></span>
              En curso
            </div>
          </div>

          {/* ── Indicador de Trimestre Activo + Cerrar Trimestre ── */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-secondary mt-1">
            <span className="font-semibold text-secondary">Estás viendo:</span>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full neumorphic-inset text-xs font-bold text-accent-violet">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {trimestreActivo}° Trimestre
            </div>

            {/* Selector Rápido */}
            <div className="flex items-center gap-1 bg-surface-bg neumorphic-inset rounded-full p-0.5">
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  onClick={() => cambiarTrimestre(t)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    trimestreActivo === t
                      ? 'bg-accent-violet text-white shadow-sm'
                      : 'text-secondary hover:text-accent-violet'
                  }`}
                >
                  {t}° Trim
                </button>
              ))}
            </div>

            <button
              onClick={() => setModalCerrarTrimestre(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-bg neumorphic-raised text-[11px] font-bold text-amber-800 hover:text-amber-900 active:scale-95 transition-all shadow-sm ml-1"
              title="Cerrar trimestre actual y pasar al siguiente"
            >
              <span className="material-symbols-outlined text-sm text-amber-600">lock_reset</span>
              {trimestreActivo < 3 ? `Cerrar ${trimestreActivo}° Trimestre y pasar al ${trimestreActivo + 1}°` : 'Cerrar 3° Trimestre'}
            </button>
          </div>
        </section>

        {/* ── Botones de Acción (Importar, Crear y Descargas) ── */}
        <section className="flex flex-col gap-3 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setImportarAbierto(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-surface-bg neumorphic-raised text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Importar Excel
              </button>

              <button
                onClick={() => setModalAgregar(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                Nuevo Alumno
              </button>
            </div>

            {/* Botón Unificado de Descargas con Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuDescargasAbierto(!menuDescargasAbierto)}
                className="px-4 py-2.5 rounded-2xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Opciones de descarga y exportación"
              >
                <Download className="w-4 h-4 text-accent-violet" />
                <span>Descargas</span>
                <span className={`material-symbols-outlined text-base transition-transform duration-200 ${menuDescargasAbierto ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Menú Desplegable de Opciones */}
              {menuDescargasAbierto && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuDescargasAbierto(false)}
                  />
                  <div className="absolute right-0 sm:right-0 max-sm:left-1/2 max-sm:-translate-x-1/2 mt-2 w-72 max-w-[calc(100vw-32px)] bg-surface-bg neumorphic-raised rounded-2xl p-2.5 z-30 flex flex-col gap-1.5 border border-white/60 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <span className="font-label-caps text-secondary text-[10px] uppercase font-bold px-3 pt-1.5 pb-1">
                      Elegir formato de descarga
                    </span>

                    {/* Opción 1: Asistencias Excel */}
                    <button
                      onClick={() => {
                        setMenuDescargasAbierto(false);
                        handleDescargarAsistenciasExcel();
                      }}
                      disabled={descargandoAsistencias}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-left transition-colors group disabled:opacity-50"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/70 neumorphic-inset flex items-center justify-center shrink-0 text-emerald-700 group-hover:scale-105 transition-transform">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-emerald-950 truncate">
                          {descargandoAsistencias ? "Generando..." : "Excel de Asistencias"}
                        </p>
                        <p className="text-[10px] text-secondary truncate">Registro y conceptos de clases</p>
                      </div>
                    </button>

                    {/* Opción 2: Calificaciones Excel */}
                    <button
                      onClick={() => {
                        setMenuDescargasAbierto(false);
                        handleDescargarCalificacionesExcel();
                      }}
                      disabled={descargandoCalificaciones}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 text-left transition-colors group disabled:opacity-50"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-100/70 neumorphic-inset flex items-center justify-center shrink-0 text-indigo-700 group-hover:scale-105 transition-transform">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-indigo-950 truncate">
                          {descargandoCalificaciones ? "Generando..." : "Excel de Calificaciones"}
                        </p>
                        <p className="text-[10px] text-secondary truncate">Planilla completa con promedios</p>
                      </div>
                    </button>

                    {/* Opción 3: Informe PDF */}
                    <button
                      onClick={() => {
                        setMenuDescargasAbierto(false);
                        handleDescargarPdf();
                      }}
                      disabled={descargandoPdf}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-left transition-colors group disabled:opacity-50"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100/70 neumorphic-inset flex items-center justify-center shrink-0 text-rose-700 group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-rose-950 truncate">
                          {descargandoPdf ? "Generando..." : "Informe Pedagógico (PDF)"}
                        </p>
                        <p className="text-[10px] text-secondary truncate">Boletín listo para imprimir</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end px-1">
            <span className="font-label-caps text-secondary text-xs font-bold uppercase">
              Total: {alumnos.length} {alumnos.length === 1 ? 'Alumno' : 'Alumnos'}
            </span>
          </div>
        </section>

        {/* ── HERO SECTION: 4 Tarjetas de Destacados (Se oculta al buscar) ── */}
        {!searchQuery.trim() && (
          <section className="mb-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-label-caps text-secondary uppercase tracking-wider font-bold">
                  ⭐ Destacados del Curso
                </h2>
                <span className="text-xs text-secondary font-medium">Top Asistencias & Mejores Calificaciones</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setConceptoModalAbierto(true)}
                  className="px-3.5 py-2.5 rounded-2xl bg-surface-bg neumorphic-raised text-amber-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="Cargar y evaluar concepto diario con caritas"
                >
                  <span className="text-base">😊</span>
                  Cargar Concepto
                </button>
                <button
                  onClick={() => setAsistenciaModalAbierto(true)}
                  className="px-4 py-2.5 rounded-2xl bg-accent-violet text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-accent-violet/90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                  Pasar Asistencia
                </button>
              </div>
            </div>

            {cargandoAlumnos ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`hero-load-${i}`}
                    className="bg-surface-bg neumorphic-raised rounded-2xl p-6 flex flex-col justify-between gap-6 animate-pulse"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 bg-outline-variant/30 rounded w-28"></div>
                        <div className="h-4 bg-outline-variant/30 rounded w-36"></div>
                      </div>
                      <div className="w-9 h-9 rounded-xl neumorphic-inset flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 px-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-2.5 bg-outline-variant/20 rounded w-16"></div>
                        <div className="h-6 bg-outline-variant/30 rounded w-10"></div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-2.5 bg-outline-variant/20 rounded w-16"></div>
                        <div className="h-6 bg-outline-variant/30 rounded w-10"></div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-2.5 bg-outline-variant/20 rounded w-16"></div>
                        <div className="h-6 bg-outline-variant/30 rounded w-10"></div>
                      </div>
                    </div>

                    <div className="h-10 bg-outline-variant/20 rounded-full w-full"></div>
                  </div>
                ))}
              </div>
            ) : alumnos.length === 0 ? (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">person_search</span>
                <p className="text-xs text-secondary italic">
                  Aún no hay alumnos inscriptos para calcular destacados de asistencia y notas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fila 1: Top 2 Asistencias */}
                {heroAlumnos.topAsistencias.map((alumno, idx) => (
                  <div
                    key={`hero-asist-${alumno.id}-${idx}`}
                    className="bg-surface-bg neumorphic-raised rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-on-surface uppercase leading-tight">
                          {alumno.nombre}<br />{alumno.apellido}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full neumorphic-inset text-[11px] font-bold text-emerald-600">
                          <span className="material-symbols-outlined text-sm">event_available</span> Top Asistencia
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Calificación<br />1er Trimestre
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.primerTrimestre > 0 ? alumno.primerTrimestre : '-'}<span className="text-sm font-normal text-secondary">/10</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Promedio de<br />asistencia
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.asistenciaPorcentaje}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Calificación<br />Total
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.promedioGeneral > 0 ? alumno.promedioGeneral : '-'}<span className="text-sm font-normal text-secondary">/10</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => abrirPerfil(alumno.alumnoCursoId)}
                      className="w-full py-3 rounded-full bg-surface-bg neumorphic-raised text-accent-violet font-label-caps uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all font-bold text-xs"
                    >
                      VER ALUMNO
                    </button>
                  </div>
                ))}

                {/* Fila 2: Top 2 Calificaciones */}
                {heroAlumnos.topCalificaciones.map((alumno, idx) => (
                  <div
                    key={`hero-notas-${alumno.id}-${idx}`}
                    className="bg-surface-bg neumorphic-raised rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-on-surface uppercase leading-tight">
                          {alumno.nombre}<br />{alumno.apellido}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full neumorphic-inset text-[11px] font-bold text-accent-violet">
                          <span className="material-symbols-outlined text-sm">workspace_premium</span> Top Notas
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Calificación<br />1er Trimestre
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.primerTrimestre > 0 ? alumno.primerTrimestre : '-'}<span className="text-sm font-normal text-secondary">/10</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Promedio de<br />asistencia
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.asistenciaPorcentaje}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-body-sm text-secondary text-[10px] uppercase font-bold">
                            Calificación<br />Total
                          </span>
                          <span className="font-headline-md text-accent-violet font-bold mt-1">
                            {alumno.promedioGeneral > 0 ? alumno.promedioGeneral : '-'}<span className="text-sm font-normal text-secondary">/10</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => abrirPerfil(alumno.alumnoCursoId)}
                      className="w-full py-3 rounded-full bg-surface-bg neumorphic-raised text-accent-violet font-label-caps uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all font-bold text-xs"
                    >
                      VER ALUMNO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Barra de Búsqueda y Ordenamiento (Debajo del Hero) ── */}
        <section className="mb-8 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o apellido..."
                type="text"
                className="w-full py-3.5 pl-12 pr-10 rounded-full neumorphic-inset border-none focus:outline-none focus:ring-2 focus:ring-accent-violet/50 text-text-main placeholder:text-secondary font-mulish bg-transparent text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-text-main"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Opciones de Ordenamiento Rápidas */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-label-caps text-secondary text-xs uppercase font-bold mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">sort</span> Ordenar:
            </span>
            <button
              onClick={() => setCriterioOrden('alfabetico-asc')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                criterioOrden === 'alfabetico-asc'
                  ? 'bg-accent-violet text-white shadow-md ring-2 ring-accent-violet/30 font-extrabold'
                  : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
              }`}
            >
              A → Z
            </button>
            <button
              onClick={() => setCriterioOrden('alfabetico-desc')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                criterioOrden === 'alfabetico-desc'
                  ? 'bg-accent-violet text-white shadow-md ring-2 ring-accent-violet/30 font-extrabold'
                  : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
              }`}
            >
              Z → A
            </button>
            <button
              onClick={() => setCriterioOrden('asistencia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                criterioOrden === 'asistencia'
                  ? 'bg-accent-violet text-white shadow-md ring-2 ring-accent-violet/30 font-extrabold'
                  : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
              }`}
            >
              <span className="material-symbols-outlined text-xs">event_available</span> Mayor Asistencia %
            </button>
            <button
              onClick={() => setCriterioOrden('calificaciones')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                criterioOrden === 'calificaciones'
                  ? 'bg-accent-violet text-white shadow-md ring-2 ring-accent-violet/30 font-extrabold'
                  : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
              }`}
            >
              <span className="material-symbols-outlined text-xs">workspace_premium</span> Mejores Notas
            </button>
          </div>
        </section>

        {/* ── LISTADO COMPLETO DE ALUMNOS (Estilos Neumórficos) ── */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-label-caps text-secondary uppercase tracking-wider font-bold">
              {searchQuery.trim() ? `Resultados para "${searchQuery}" (${alumnosFiltradosYOrdenados.length})` : `Lista de Estudiantes (${alumnosFiltradosYOrdenados.length})`}
            </h2>
          </div>

          {cargandoAlumnos && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-bg neumorphic-raised rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-outline-variant/30 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-outline-variant/30 rounded w-1/3" />
                    <div className="h-3 bg-outline-variant/20 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!cargandoAlumnos && alumnosFiltradosYOrdenados.length === 0 && (
            <div className="bg-surface-bg neumorphic-inset rounded-3xl p-10 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-secondary">group_off</span>
              <p className="font-bold text-base text-text-main">
                {searchQuery.trim() ? `No se encontraron alumnos con "${searchQuery}"` : "No hay alumnos cargados en este curso aún"}
              </p>
              <p className="text-xs text-secondary max-w-sm">
                Podés importar tu nómina de estudiantes desde un archivo Excel/CSV o agregar alumnos individualmente.
              </p>
              <button
                onClick={() => setModalAgregar(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                + Agregar Alumno
              </button>
            </div>
          )}

          {!cargandoAlumnos && alumnosFiltradosYOrdenados.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alumnosFiltradosYOrdenados.map((alumno) => (
                <div
                  key={alumno.id}
                  className="bg-surface-bg neumorphic-raised rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-4 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => abrirPerfil(alumno.alumnoCursoId)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 group"
                    >
                      <div className="w-12 h-12 rounded-xl neumorphic-inset flex items-center justify-center text-accent-violet font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                        {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-on-surface text-base group-hover:text-accent-violet transition-colors truncate">
                          {alumno.apellido}, {alumno.nombre}
                        </h4>
                        {alumno.contacto ? (
                          <p className="text-xs text-secondary flex items-center gap-1 mt-0.5 truncate">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            {alumno.contacto}
                          </p>
                        ) : (
                          <span className="text-[11px] text-secondary/70 italic">Sin contacto</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditar(alumno)}
                        className="w-9 h-9 rounded-xl neumorphic-raised flex items-center justify-center text-secondary hover:text-accent-violet active:scale-95 transition-all"
                        title="Editar alumno"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => setEliminandoId(alumno.id)}
                        className="w-9 h-9 rounded-xl neumorphic-raised flex items-center justify-center text-red-500 hover:text-red-700 active:scale-95 transition-all"
                        title="Eliminar alumno"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas rápidas y botón perfil */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 gap-2">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-secondary">
                        Asistencia: <b className="text-accent-violet">{alumno.asistenciaPorcentaje}%</b>
                      </span>
                      <span className="font-semibold text-secondary">
                        Promedio: <b className="text-accent-violet">{alumno.promedioGeneral > 0 ? `${alumno.promedioGeneral}/10` : '-'}</b>
                      </span>
                    </div>

                    <button
                      onClick={() => abrirPerfil(alumno.alumnoCursoId)}
                      className="px-3 py-1.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-[11px] uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all flex items-center gap-1"
                    >
                      Perfil <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Modal de Confirmación para Cerrar Trimestre ── */}
      {modalCerrarTrimestre && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalCerrarTrimestre(false);
          }}
        >
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-5 border border-white/60 shadow-2xl font-mulish">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 neumorphic-inset flex items-center justify-center text-amber-700 text-2xl shrink-0">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-on-surface uppercase font-bold">
                  {trimestreActivo < 3 ? `Cerrar ${trimestreActivo}° Trimestre` : 'Cerrar 3° Trimestre'}
                </h3>
                <p className="text-xs text-secondary">
                  {trimestreActivo < 3
                    ? `Avanzarás al ${trimestreActivo + 1}° Trimestre para iniciar la nueva etapa de clases.`
                    : 'Has concluido el ciclo lectivo. Puedes reiniciar al 1° Trimestre.'}
                </p>
              </div>
            </div>

            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 text-xs text-secondary flex flex-col gap-2">
              <p className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                Tus registros anteriores se conservan para exportar a Excel / PDF.
              </p>
              <p className="text-secondary">
                La vista activa pasará al nuevo trimestre para registrar asistencias y notas desde cero.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setModalCerrarTrimestre(false)}
                className="flex-1 py-3 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={avanzarSiguienteTrimestre}
                className="flex-1 py-3 rounded-xl bg-accent-violet text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-accent-violet/90 active:scale-95 transition-all"
              >
                {trimestreActivo < 3 ? `Pasar al ${trimestreActivo + 1}° Trimestre →` : 'Reiniciar al 1° Trimestre'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BottomNav />

      {/* ── Modal Nuevo Alumno ── */}
      {modalAgregar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 border border-white/60 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-accent-violet">👤 Nuevo Alumno</h3>
              <button
                onClick={() => setModalAgregar(false)}
                className="w-8 h-8 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-text-main"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Nombre:</label>
                <input
                  type="text"
                  placeholder="Ej: Juan"
                  value={formNuevo.nombre}
                  onChange={(e) => setFormNuevo({ ...formNuevo, nombre: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>

              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Apellido:</label>
                <input
                  type="text"
                  placeholder="Ej: Pérez"
                  value={formNuevo.apellido}
                  onChange={(e) => setFormNuevo({ ...formNuevo, apellido: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>

              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Teléfono / Contacto (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ej: 11-2345-6789"
                  value={formNuevo.contacto}
                  onChange={(e) => setFormNuevo({ ...formNuevo, contacto: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setModalAgregar(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearAlumno}
                disabled={guardandoNuevo || !formNuevo.nombre.trim() || !formNuevo.apellido.trim()}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {guardandoNuevo ? "Guardando..." : "Crear Alumno"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Editar Alumno ── */}
      {editandoAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 border border-white/60 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-accent-violet">✏️ Editar Alumno</h3>
              <button
                onClick={() => setEditandoAlumno(null)}
                className="w-8 h-8 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-text-main"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Nombre:</label>
                <input
                  type="text"
                  value={formEdit.nombre}
                  onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>

              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Apellido:</label>
                <input
                  type="text"
                  value={formEdit.apellido}
                  onChange={(e) => setFormEdit({ ...formEdit, apellido: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>

              <div>
                <label className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">Teléfono / Contacto:</label>
                <input
                  type="text"
                  value={formEdit.contacto}
                  onChange={(e) => setFormEdit({ ...formEdit, contacto: e.target.value })}
                  className="w-full bg-surface-bg neumorphic-inset rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-violet/40"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setEditandoAlumno(null)}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEditar}
                disabled={guardandoEdit}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {guardandoEdit ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar Eliminación ── */}
      {eliminandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-sm text-center flex flex-col items-center gap-4 border border-white/60 shadow-2xl">
            <div className="w-14 h-14 rounded-full neumorphic-inset flex items-center justify-center text-red-500 text-2xl">
              <span className="material-symbols-outlined text-3xl">delete</span>
            </div>
            <div>
              <h3 className="font-headline-md text-xl text-on-surface">¿Eliminar alumno?</h3>
              <p className="text-xs text-secondary mt-1">Esta acción desvinculará al alumno y sus registros de este curso.</p>
            </div>
            <div className="flex gap-3 w-full justify-center mt-2">
              <button
                onClick={() => setEliminandoId(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Perfil de Alumno ── */}
      <PerfilAlumnoModal
        abierto={perfilAbierto}
        perfil={perfil}
        onCerrar={() => setPerfilAbierto(false)}
      />

      {/* ── Modal Importar Alumnos desde Excel / CSV ── */}
      <ImportarAlumnosModal
        abierto={importarAbierto}
        cursoId={cursoId}
        onCerrar={() => setImportarAbierto(false)}
        onImportados={fetchAlumnos}
      />

      {/* ── Modal Pasar Asistencia Rápida (Bucle de Alumnos) ── */}
      <PasoAsistenciaModal
        abierto={asistenciaModalAbierto}
        alumnos={alumnos}
        cursoInfo={cursoInfo}
        onCerrar={() => setAsistenciaModalAbierto(false)}
        onFinalizado={fetchAlumnos}
      />

      {/* ── Modal Evaluar Concepto de Clase (Caritas) ── */}
      <PasoConceptoModal
        abierto={conceptoModalAbierto}
        alumnos={alumnos}
        cursoInfo={cursoInfo}
        onCerrar={() => setConceptoModalAbierto(false)}
        onFinalizado={fetchAlumnos}
      />
    </div>
  );
}
