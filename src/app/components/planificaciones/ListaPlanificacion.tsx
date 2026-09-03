'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/token';
import Cargando from '../shared/Cargando';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type Curso = {
  id: number;
  materia: string;
  anio: string;
  escuela: string;
};

type Planificacion = {
  id: number;
  tema: string;
  link: string;
  fecha: string | null;
  curso: Curso;
};

const anioActual = new Date().getFullYear();
const ANIOS_ESCOLARES_OPCIONES = [
  String(anioActual + 1),
  String(anioActual),
  String(anioActual - 1),
  String(anioActual - 2),
  String(anioActual - 3),
];

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

const formatearTamano = (bytes: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const obtenerTipoArchivo = (url: string) => {
  const cleanUrl = url.toLowerCase();
  if (cleanUrl.endsWith('.pdf') || cleanUrl.includes('.pdf') || cleanUrl.includes('mime=application/pdf')) {
    return { tipo: 'pdf', label: 'Archivo PDF', icon: 'picture_as_pdf', color: 'text-red-600 bg-red-50 border-red-200' };
  }
  if (cleanUrl.endsWith('.docx') || cleanUrl.includes('.docx') || cleanUrl.endsWith('.doc') || cleanUrl.includes('.doc')) {
    return { tipo: 'docx', label: 'Word (DOCX)', icon: 'description', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  }
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    return { tipo: 'drive', label: 'Google Drive', icon: 'cloud', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  }
  return { tipo: 'enlace', label: 'Enlace Web', icon: 'link', color: 'text-accent-violet bg-violet-50 border-violet-200' };
};

export default function ListaPlanificaciones() {
  const [lista, setLista]                         = useState<Planificacion[]>([]);
  const [cursos, setCursos]                       = useState<Curso[]>([]);
  const [cargando, setCargando]                   = useState(true);
  const [guardando, setGuardando]                 = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados de Filtros (Año Escolar calendario 2025, 2026... y Materia)
  const [filtroAnio, setFiltroAnio]               = useState<string>('todos');
  const [filtroMateria, setFiltroMateria]         = useState<string>('todos');
  const [busqueda, setBusqueda]                   = useState('');

  // Estados del Formulario
  const [modoOrigen, setModoOrigen]               = useState<'archivo' | 'enlace'>('archivo');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [arrastrando, setArrastrando]             = useState(false);
  const [nueva, setNueva]                         = useState({
    tema: '',
    link: '',
    fecha: `${anioActual}-03-01`,
    cursoId: '',
    anioEscolar: String(anioActual),
    materia: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      await Promise.all([fetchPlanificaciones(), fetchCursos()]);
      setCargando(false);
    };
    cargarDatos();
  }, []);

  const fetchPlanificaciones = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/planificaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setLista(data);
    } catch (err) {
      console.error('Error al cargar planificaciones:', err);
    }
  };

  const fetchCursos = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/cursos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setCursos(data);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
    }
  };

  // Opciones dinámicas para filtros
  const aniosEscolaresDisponibles = Array.from(
    new Set([
      String(anioActual),
      String(anioActual - 1),
      String(anioActual - 2),
      ...lista.map((p) => (p.fecha ? String(new Date(p.fecha).getFullYear()) : '')).filter(Boolean),
    ])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const materiasDisponibles = Array.from(
    new Set([
      ...cursos.map((c) => c.materia.trim()).filter(Boolean),
      ...lista.map((p) => p.curso.materia.trim()).filter(Boolean),
    ])
  ).sort((a, b) => a.localeCompare(b));

  const abrirModal = (cursoIdPorDefecto?: number) => {
    const cursoDef = cursoIdPorDefecto 
      ? cursos.find(c => c.id === cursoIdPorDefecto) 
      : (cursos.length > 0 ? cursos[0] : null);
    
    const hoyStr = new Date().toISOString().split('T')[0];
    setNueva({
      tema: '',
      link: '',
      fecha: hoyStr,
      cursoId: cursoDef ? String(cursoDef.id) : '',
      anioEscolar: String(anioActual),
      materia: cursoDef ? cursoDef.materia : '',
    });
    setArchivoSeleccionado(null);
    setModoOrigen('archivo');
    setMostrarFormulario(true);
  };

  const handleSeleccionarCurso = (cursoIdStr: string) => {
    const c = cursos.find((item) => String(item.id) === cursoIdStr);
    setNueva((prev) => ({
      ...prev,
      cursoId: cursoIdStr,
      materia: c ? c.materia : prev.materia,
    }));
  };

  const handleCambiarAnioEscolar = (nuevoAnio: string) => {
    setNueva((prev) => {
      let nuevaFecha = prev.fecha;
      if (nuevaFecha && nuevaFecha.includes('-')) {
        const parts = nuevaFecha.split('-');
        nuevaFecha = `${nuevoAnio}-${parts[1] || '03'}-${parts[2] || '01'}`;
      } else {
        nuevaFecha = `${nuevoAnio}-03-01`;
      }
      return {
        ...prev,
        anioEscolar: nuevoAnio,
        fecha: nuevaFecha,
      };
    });
  };

  const handleCambiarMateria = (nuevaMateria: string) => {
    // Buscar si existe un curso con esta materia
    const match = cursos.find(
      (c) => c.materia.toLowerCase().trim() === nuevaMateria.toLowerCase().trim()
    );
    setNueva((prev) => ({
      ...prev,
      materia: nuevaMateria,
      cursoId: match ? String(match.id) : prev.cursoId,
    }));
  };

  const handleSeleccionarArchivo = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'odt', 'txt'].includes(extension || '')) {
      alert('Formato de archivo no admitido. Por favor seleccioná un archivo PDF o DOCX / Word.');
      return;
    }
    setArchivoSeleccionado(file);
    if (!nueva.tema.trim()) {
      const nombreSinExt = file.name.replace(/\.[^/.]+$/, '').replace(/[_]/g, ' ');
      setNueva((prev) => ({ ...prev, tema: nombreSinExt }));
    }
  };

  const guardar = async () => {
    if (!nueva.tema.trim()) {
      alert('Por favor completá el tema o título de la planificación.');
      return;
    }

    if (!nueva.cursoId) {
      alert('Por favor seleccioná el curso al que pertenece la planificación.');
      return;
    }

    if (modoOrigen === 'archivo' && !archivoSeleccionado && !nueva.link.trim()) {
      alert('Por favor seleccioná un archivo PDF o DOCX para subir.');
      return;
    }

    if (modoOrigen === 'enlace' && !nueva.link.trim()) {
      alert('Por favor ingresá el enlace web a la planificación.');
      return;
    }

    setGuardando(true);
    const token = getToken();
    try {
      let urlFinal = nueva.link.trim();

      // Subir archivo al servidor si se seleccionó uno
      if (modoOrigen === 'archivo' && archivoSeleccionado) {
        const formData = new FormData();
        formData.append('file', archivoSeleccionado);

        const resUpload = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const dataUpload = await resUpload.json();
        if (!resUpload.ok || !dataUpload.url) {
          throw new Error(dataUpload.error || 'Error al subir el archivo al servidor.');
        }

        urlFinal = dataUpload.url;
      }

      // Guardar planificación en el backend
      const res = await fetch(`${API}/planificaciones/${nueva.cursoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tema:  nueva.tema.trim(),
          link:  urlFinal,
          fecha: nueva.fecha || `${nueva.anioEscolar}-03-01`,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Error al registrar la planificación.');
      }

      setNueva({
        tema: '',
        link: '',
        fecha: `${anioActual}-03-01`,
        cursoId: '',
        anioEscolar: String(anioActual),
        materia: '',
      });
      setArchivoSeleccionado(null);
      setMostrarFormulario(false);
      await fetchPlanificaciones();
    } catch (err: any) {
      console.error(err);
      alert(`❌ ${err.message || 'Error al guardar la planificación. Intentá nuevamente.'}`);
    } finally {
      setGuardando(false);
    }
  };

  // Filtrado de la lista por Año Escolar (2025, 2026...) y Materia
  const listaFiltrada = lista.filter((plan) => {
    const planAnioCalendario = plan.fecha ? String(new Date(plan.fecha).getFullYear()) : '';
    const coincideAnio =
      filtroAnio === 'todos' || planAnioCalendario === filtroAnio;

    const coincideMateria =
      filtroMateria === 'todos' ||
      plan.curso.materia.toLowerCase().trim() === filtroMateria.toLowerCase().trim();

    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      !q ||
      plan.tema.toLowerCase().includes(q) ||
      plan.curso.materia.toLowerCase().includes(q) ||
      plan.curso.escuela.toLowerCase().includes(q) ||
      plan.curso.anio.toLowerCase().includes(q) ||
      planAnioCalendario.includes(q);

    return coincideAnio && coincideMateria && coincideBusqueda;
  });

  // Agrupar por curso
  const porCurso = listaFiltrada.reduce<Record<number, { curso: Curso; planes: Planificacion[] }>>(
    (acc, plan) => {
      const id = plan.curso.id;
      if (!acc[id]) acc[id] = { curso: plan.curso, planes: [] };
      acc[id].planes.push(plan);
      return acc;
    },
    {}
  );

  // Cursos sugeridos según materia seleccionada en el modal
  const cursosFiltradosModal = cursos.filter((c) => {
    if (nueva.materia && !c.materia.toLowerCase().includes(nueva.materia.toLowerCase().trim())) return false;
    return true;
  });
  const cursosOpciones = cursosFiltradosModal.length > 0 ? cursosFiltradosModal : cursos;

  return (
    <div className="w-full min-h-screen bg-surface-bg text-on-surface antialiased pt-28 md:pt-36 pb-28 px-4 md:px-margin-page max-w-6xl mx-auto flex flex-col gap-6">

      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-accent-violet">
            <span className="material-symbols-outlined text-2xl">edit_document</span>
            <span className="text-xs font-extrabold uppercase tracking-widest">Gestión Pedagógica</span>
          </div>
          <h1 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-on-surface font-extrabold tracking-tight uppercase">
            Planificaciones y Secuencias
          </h1>
          <p className="text-xs sm:text-sm text-secondary font-medium max-w-2xl">
            Repositorio de secuencias didácticas, archivos PDF, documentos Word (DOCX) y enlaces organizados por ciclo lectivo y materia.
          </p>
        </div>

        <button
          onClick={() => abrirModal()}
          className="neu-raised text-accent-violet px-5 py-2.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Nueva Planificación</span>
        </button>
      </div>

      {/* Barra de Filtros (Año Escolar 2025/2026..., Materia y Búsqueda) */}
      <div className="bg-surface-bg neu-raised rounded-3xl p-5 flex flex-col gap-3.5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3.5 items-center justify-between">
          
          {/* Buscador */}
          <div className="relative w-full lg:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar tema o archivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-surface-bg neu-inset rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-on-surface focus:outline-none placeholder:text-secondary/60"
            />
          </div>

          {/* Filtros específicos por Año Escolar (2025, 2026...) y por Materia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            {/* Filtro por Año Escolar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-secondary uppercase shrink-0">Año escolar:</span>
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
                className="w-full sm:w-44 bg-surface-bg neu-inset rounded-xl px-3 py-2 text-xs font-extrabold text-accent-violet focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos los años</option>
                {aniosEscolaresDisponibles.map((a) => (
                  <option key={`flt-anio-esc-${a}`} value={a}>
                    Ciclo {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Materia */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-secondary uppercase shrink-0">Materia:</span>
              <select
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
                className="w-full sm:w-48 bg-surface-bg neu-inset rounded-xl px-3 py-2 text-xs font-extrabold text-accent-violet focus:outline-none cursor-pointer"
              >
                <option value="todos">Todas las materias</option>
                {materiasDisponibles.map((m) => (
                  <option key={`flt-mat-${m}`} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen de Filtros Activos */}
        {(filtroAnio !== 'todos' || filtroMateria !== 'todos' || busqueda) && (
          <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-outline-variant/30 text-xs">
            <span className="text-secondary font-bold">Filtros activos:</span>
            {filtroAnio !== 'todos' && (
              <span className="px-2.5 py-0.5 rounded-lg neu-inset font-extrabold text-accent-violet flex items-center gap-1.5">
                <span>Ciclo escolar: {filtroAnio}</span>
                <button
                  onClick={() => setFiltroAnio('todos')}
                  className="text-secondary hover:text-red-600 font-extrabold leading-none"
                  title="Quitar filtro de año"
                >
                  ✕
                </button>
              </span>
            )}
            {filtroMateria !== 'todos' && (
              <span className="px-2.5 py-0.5 rounded-lg neu-inset font-extrabold text-accent-violet flex items-center gap-1.5">
                <span>Materia: {filtroMateria}</span>
                <button
                  onClick={() => setFiltroMateria('todos')}
                  className="text-secondary hover:text-red-600 font-extrabold leading-none"
                  title="Quitar filtro de materia"
                >
                  ✕
                </button>
              </span>
            )}
            {busqueda && (
              <span className="px-2.5 py-0.5 rounded-lg neu-inset font-extrabold text-accent-violet flex items-center gap-1.5">
                <span>Texto: &quot;{busqueda}&quot;</span>
                <button
                  onClick={() => setBusqueda('')}
                  className="text-secondary hover:text-red-600 font-extrabold leading-none"
                  title="Borrar búsqueda"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={() => { setFiltroAnio('todos'); setFiltroMateria('todos'); setBusqueda(''); }}
              className="text-secondary hover:text-accent-violet font-bold underline ml-auto text-[11px]"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      {cargando ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Cargando />
          <p className="text-xs text-secondary font-bold mt-3">Cargando repositorio de planificaciones...</p>
        </div>
      ) : Object.keys(porCurso).length === 0 ? (
        <div className="bg-surface-bg neu-inset rounded-3xl p-10 text-center flex flex-col items-center gap-3 my-4">
          <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center text-accent-violet">
            <span className="material-symbols-outlined text-3xl">upload_file</span>
          </div>
          <h3 className="font-headline-md text-base sm:text-lg font-extrabold text-on-surface uppercase">
            No hay planificaciones para los filtros seleccionados
          </h3>
          <p className="text-xs text-secondary font-medium max-w-md">
            {busqueda || filtroAnio !== 'todos' || filtroMateria !== 'todos'
              ? 'Probá cambiando o restableciendo los filtros de año escolar, materia o búsqueda.'
              : 'Podés subir archivos PDF, documentos Word (DOCX) o pegar enlaces a carpetas de Google Drive.'}
          </p>
          <button
            onClick={() => abrirModal()}
            className="mt-2 px-5 py-2.5 rounded-xl neu-raised text-accent-violet font-extrabold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
          >
            + Subir Primer Archivo o Planificación
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.values(porCurso).map(({ curso, planes }) => (
            <section
              key={`curso-plan-${curso.id}`}
              className="bg-surface-bg neu-raised rounded-3xl p-5 sm:p-6 flex flex-col gap-4 border border-white/50 shadow-sm"
            >
              {/* Encabezado del Curso */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-accent-violet shrink-0">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg neu-inset font-extrabold text-[11px] text-accent-violet uppercase">
                        {formatearGradoCurso(curso.anio)}
                      </span>
                      <h2 className="font-headline-md text-base sm:text-lg font-extrabold text-on-surface uppercase tracking-tight">
                        {curso.materia}
                      </h2>
                    </div>
                    <p className="text-xs text-secondary font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">domain</span>
                      <span>{curso.escuela}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-3 py-1 rounded-xl neu-inset text-[11px] font-bold text-secondary">
                    {planes.length} {planes.length === 1 ? 'archivo' : 'archivos'}
                  </span>
                  <button
                    onClick={() => abrirModal(curso.id)}
                    className="neu-raised text-accent-violet px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
                    title="Subir archivo o enlace a este curso"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>Subir</span>
                  </button>
                  <Link
                    href={`/sub-menu-curso/${curso.id}/alumnos`}
                    className="neu-raised text-secondary hover:text-accent-violet px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-transform"
                    title="Ir al aula del curso"
                  >
                    <span className="material-symbols-outlined text-sm">login</span>
                  </Link>
                </div>
              </div>

              {/* Cuadrícula de Planificaciones y Archivos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {planes.map((plan) => {
                  const meta = obtenerTipoArchivo(plan.link);
                  const anioPlan = plan.fecha ? new Date(plan.fecha).getFullYear() : null;

                  return (
                    <div
                      key={`plan-item-${plan.id}`}
                      className="bg-surface-bg neu-raised rounded-2xl p-4 flex flex-col justify-between border-l-[4px] border-l-accent-violet shadow-sm hover:scale-[1.01] transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase flex items-center gap-1 ${meta.color}`}>
                            <span className="material-symbols-outlined text-xs">{meta.icon}</span>
                            <span>{meta.label}</span>
                          </span>

                          {plan.fecha && (
                            <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">event</span>
                              {new Date(plan.fecha).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-sm sm:text-base text-on-surface uppercase tracking-tight line-clamp-2 leading-snug">
                          {plan.tema}
                        </h4>

                        {/* Badges de Año Escolar (2025/2026...) y Materia en la tarjeta */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {anioPlan && (
                            <span className="px-2 py-0.5 rounded-md neu-inset text-[10px] font-extrabold text-accent-violet flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">calendar_today</span>
                              <span>Ciclo {anioPlan}</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md neu-inset text-[10px] font-bold text-secondary uppercase truncate max-w-[150px]">
                            {plan.curso.materia}
                          </span>
                          <span className="px-2 py-0.5 rounded-md neu-inset text-[10px] font-semibold text-secondary uppercase">
                            {formatearGradoCurso(plan.curso.anio)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                        <a
                          href={plan.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl neu-raised text-accent-violet hover:brightness-95 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-base">
                            {meta.tipo === 'docx' ? 'download' : (meta.tipo === 'pdf' ? 'visibility' : 'open_in_new')}
                          </span>
                          <span>
                            {meta.tipo === 'docx' ? 'Descargar Word' : (meta.tipo === 'pdf' ? 'Abrir PDF' : 'Abrir Enlace')}
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── MODAL FLOTANTE DE NUEVA PLANIFICACIÓN / ARCHIVO ── */}
      {mostrarFormulario && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !guardando) setMostrarFormulario(false);
          }}
        >
          <div className="bg-surface-bg neu-raised rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-white/60 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">

            {/* Cabecera del modal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-accent-violet">
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg sm:text-xl font-extrabold text-accent-violet uppercase tracking-tight">
                    Nueva Planificación
                  </h3>
                  <p className="text-xs text-secondary font-semibold">Configurá año escolar, materia y subí el documento</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                disabled={guardando}
                className="w-9 h-9 neu-raised rounded-xl flex items-center justify-center text-secondary hover:text-accent-violet active:scale-95 transition-transform disabled:opacity-40"
                title="Cerrar ventana"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Selector de Modo: Archivo vs Enlace Web */}
            <div className="grid grid-cols-2 p-1 rounded-2xl neu-inset gap-1">
              <button
                type="button"
                onClick={() => setModoOrigen('archivo')}
                className={`py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  modoOrigen === 'archivo'
                    ? 'neu-raised text-accent-violet shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>Subir Archivo</span>
              </button>
              <button
                type="button"
                onClick={() => setModoOrigen('enlace')}
                className={`py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  modoOrigen === 'enlace'
                    ? 'neu-raised text-accent-violet shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">link</span>
                <span>Enlace Web</span>
              </button>
            </div>

            {/* Campos del Formulario */}
            <div className="flex flex-col space-y-4">

              {/* Fila Año Escolar (2025, 2026...) y Materia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Campo Año Escolar / Ciclo */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                    Año Escolar / Ciclo *
                  </label>
                  <select
                    value={nueva.anioEscolar}
                    onChange={(e) => handleCambiarAnioEscolar(e.target.value)}
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                  >
                    {ANIOS_ESCOLARES_OPCIONES.map((a) => (
                      <option key={`sel-modal-ciclo-${a}`} value={a}>
                        Ciclo {a} {a === String(anioActual) ? '(Actual)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo Materia */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                    Materia *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Química, Matemática..."
                    value={nueva.materia}
                    onChange={(e) => handleCambiarMateria(e.target.value)}
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-accent-violet focus:outline-none placeholder:text-secondary/50"
                  />
                </div>
              </div>

              {/* Selector de Aula / Curso Vinculado */}
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                  Curso / Escuela Asignada *
                </label>
                <select
                  value={nueva.cursoId}
                  onChange={(e) => handleSeleccionarCurso(e.target.value)}
                  className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="">Seleccioná la escuela o curso</option>
                  {cursosOpciones.map((c) => (
                    <option key={c.id} value={c.id}>
                      {formatearGradoCurso(c.anio)} — {c.materia} ({c.escuela})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modo: Subir Archivo PDF / DOCX */}
              {modoOrigen === 'archivo' ? (
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                    Archivo PDF o Word (DOCX) *
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.odt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSeleccionarArchivo(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {archivoSeleccionado ? (
                    <div className="neu-raised rounded-2xl p-4 flex items-center justify-between border border-accent-violet/30 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          archivoSeleccionado.name.toLowerCase().endsWith('.pdf') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="material-symbols-outlined text-2xl">
                            {archivoSeleccionado.name.toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-extrabold text-on-surface truncate">
                            {archivoSeleccionado.name}
                          </p>
                          <p className="text-[10px] text-secondary font-bold">
                            {formatearTamano(archivoSeleccionado.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setArchivoSeleccionado(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-secondary hover:text-red-600 active:scale-95 transition-all shrink-0"
                        title="Quitar archivo"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                      onDragLeave={() => setArrastrando(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setArrastrando(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleSeleccionarArchivo(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        arrastrando
                          ? 'border-accent-violet bg-accent-violet/10 scale-[1.01]'
                          : 'border-accent-violet/40 hover:border-accent-violet bg-surface-bg neu-inset'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl neu-raised flex items-center justify-center text-accent-violet">
                        <span className="material-symbols-outlined text-2xl">upload_file</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-extrabold text-on-surface">
                          Arrastrá tu documento aquí o <span className="text-accent-violet underline">buscalo en tu dispositivo</span>
                        </p>
                        <p className="text-[10px] text-secondary mt-1 font-semibold">
                          Formatos aceptados: PDF, Word (.docx, .doc). Máx. 25 MB.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Modo: Enlace Web / Drive */
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                    Enlace al Documento o Carpeta (Drive, Docs, etc.) *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base pointer-events-none">
                      link
                    </span>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... o enlace online"
                      value={nueva.link}
                      onChange={(e) => setNueva({ ...nueva, link: e.target.value })}
                      className="w-full bg-surface-bg neu-inset rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-accent-violet focus:outline-none placeholder:text-secondary/50"
                    />
                  </div>
                  <p className="text-[10px] text-secondary mt-1 font-medium">
                    Pegá un enlace compartido de Google Drive, OneDrive, Notion o PDF en la nube.
                  </p>
                </div>
              )}

              {/* Tema / Título */}
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                  Tema o Secuencia *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Secuencia 1: Introducción a los Estados de la Materia"
                  value={nueva.tema}
                  onChange={(e) => setNueva({ ...nueva, tema: e.target.value })}
                  className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none placeholder:text-secondary/50"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
                  Fecha Específica (Opcional)
                </label>
                <input
                  type="date"
                  value={nueva.fecha}
                  onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
                  className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  disabled={guardando}
                  className="w-1/3 py-2.5 rounded-xl neu-raised text-secondary font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardar}
                  disabled={guardando}
                  className="w-2/3 py-2.5 rounded-xl neu-raised text-accent-violet hover:brightness-95 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                  {guardando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></span>
                      <span>Guardando documento...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm font-extrabold">save</span>
                      <span>Guardar Planificación</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}