'use client';

import { useState } from "react";
import { Curso } from "./Cursos";
import { getToken } from "@/lib/token";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;

type HorarioExtra = {
  dia: string;
  hora: string;
};

type Props = {
  onCursoCreado: (curso: Curso) => void;
  onCerrar?: () => void;
};

export default function FormularioCurso({ onCursoCreado, onCerrar }: Props) {
  const [nuevoCurso, setNuevoCurso] = useState({
    escuela: "",
    anio: "",
    materia: "",
  });

  // Configuración de horarios
  const [asignarHorario, setAsignarHorario] = useState(true);
  const [diaPrincipal, setDiaPrincipal] = useState<string>('Lunes');
  const [horaPrincipal, setHoraPrincipal] = useState<string>('08:00 a 09:20');
  const [horariosExtra, setHorariosExtra] = useState<HorarioExtra[]>([]);
  const [guardando, setGuardando] = useState(false);

  const agregarDiaExtra = () => {
    setHorariosExtra((prev) => [...prev, { dia: 'Miercoles', hora: horaPrincipal }]);
  };

  const actualizarDiaExtra = (idx: number, dia: string) => {
    setHorariosExtra((prev) => prev.map((h, i) => (i === idx ? { ...h, dia } : h)));
  };

  const actualizarHoraExtra = (idx: number, hora: string) => {
    setHorariosExtra((prev) => prev.map((h, i) => (i === idx ? { ...h, hora } : h)));
  };

  const quitarDiaExtra = (idx: number) => {
    setHorariosExtra((prev) => prev.filter((_, i) => i !== idx));
  };

  const agregarCurso = async () => {
    if (!nuevoCurso.escuela.trim() || !nuevoCurso.anio.trim() || !nuevoCurso.materia.trim()) {
      alert("Por favor completa año, institución y materia.");
      return;
    }

    setGuardando(true);
    try {
      const token = getToken();
      if (!token) {
        alert("No hay sesión activa");
        setGuardando(false);
        return;
      }

      // 1️⃣ Crear Curso
      const res = await fetch(`${API}/cursos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          escuela: nuevoCurso.escuela.trim(),
          anio: nuevoCurso.anio.trim(),
          materia: nuevoCurso.materia.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo crear el curso");
      }

      // 2️⃣ Si está activo asignar horarios, compilar y guardar todos
      if (asignarHorario && data.id) {
        const listaHorarios: HorarioExtra[] = [];
        if (horaPrincipal.trim()) {
          listaHorarios.push({ dia: diaPrincipal, hora: horaPrincipal.trim() });
        }
        for (const extra of horariosExtra) {
          if (extra.hora.trim()) {
            listaHorarios.push({ dia: extra.dia, hora: extra.hora.trim() });
          }
        }

        if (listaHorarios.length > 0) {
          const descPayload = JSON.stringify({
            materia: nuevoCurso.materia.trim(),
            curso: nuevoCurso.anio.trim(),
            escuela: nuevoCurso.escuela.trim(),
            cursoId: data.id,
          });

          const promesas = listaHorarios.map((h) =>
            fetch(`${API}/horarios`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                dia: h.dia,
                hora: h.hora,
                descripcion: descPayload,
              }),
            })
          );

          await Promise.allSettled(promesas);
        }
      }

      onCursoCreado(data);
    } catch (error: any) {
      console.error("Error al crear curso:", error);
      alert(`❌ ${error.message || "No se pudo crear el curso"}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar?.();
      }}
    >
      <div className="bg-surface-bg neu-raised rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-white/60 shadow-2xl font-mulish flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-accent-violet">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <h3 className="font-headline-md text-lg sm:text-xl font-extrabold text-accent-violet uppercase tracking-tight">
                Nuevo Curso
              </h3>
              <p className="text-xs text-secondary font-semibold">Configurá los datos y horarios del aula</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="w-9 h-9 neu-raised rounded-xl flex items-center justify-center text-secondary hover:text-accent-violet active:scale-95 transition-transform"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Formulario */}
        <div className="flex flex-col space-y-3.5">
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
              Año o División *
            </label>
            <input
              type="text"
              placeholder="Ej. 1° Año, 2° 1ra"
              value={nuevoCurso.anio}
              onChange={(e) =>
                setNuevoCurso({ ...nuevoCurso, anio: e.target.value })
              }
              className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none placeholder:text-secondary/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
              Institución / Escuela *
            </label>
            <input
              type="text"
              placeholder="Ej. E.E.S. N° 5, Normal 1"
              value={nuevoCurso.escuela}
              onChange={(e) =>
                setNuevoCurso({ ...nuevoCurso, escuela: e.target.value })
              }
              className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-on-surface focus:outline-none placeholder:text-secondary/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet block mb-1">
              Materia *
            </label>
            <input
              type="text"
              placeholder="Ej. Matemática, Historia, Lengua"
              value={nuevoCurso.materia}
              onChange={(e) =>
                setNuevoCurso({ ...nuevoCurso, materia: e.target.value })
              }
              className="w-full bg-surface-bg neu-inset rounded-xl px-3.5 py-2.5 text-sm font-bold text-accent-violet focus:outline-none placeholder:text-secondary/50"
            />
          </div>

          {/* ── Sección Horarios de Cursada ── */}
          <div className="pt-2 border-t border-outline-variant/30">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h4 className="text-xs font-extrabold text-accent-violet flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  Horarios en la Grilla Semanal
                </h4>
                <p className="text-[11px] text-secondary font-medium">Se vincularán automáticamente al horario.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={asignarHorario}
                  onChange={(e) => setAsignarHorario(e.target.checked)}
                  className="w-4 h-4 accent-accent-violet rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-accent-violet">Activo</span>
              </label>
            </div>

            {asignarHorario && (
              <div className="neu-inset rounded-2xl p-3.5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Día:</label>
                    <select
                      value={diaPrincipal}
                      onChange={(e) => setDiaPrincipal(e.target.value)}
                      className="w-full bg-surface-bg neu-raised rounded-xl px-3 py-2 text-xs font-bold text-on-surface focus:outline-none"
                    >
                      {DIAS_SEMANA.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Franja horaria:</label>
                    <input
                      type="text"
                      value={horaPrincipal}
                      onChange={(e) => setHoraPrincipal(e.target.value)}
                      placeholder="Ej. 08:00 a 09:20"
                      className="w-full bg-surface-bg neu-raised rounded-xl px-3 py-2 text-xs font-bold text-accent-violet focus:outline-none"
                    />
                  </div>
                </div>

                {/* Días extra añadidos */}
                {horariosExtra.map((extra, idx) => (
                  <div key={`extra-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-outline-variant/30 relative pr-7">
                    <div>
                      <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Día adicional:</label>
                      <select
                        value={extra.dia}
                        onChange={(e) => actualizarDiaExtra(idx, e.target.value)}
                        className="w-full bg-surface-bg neu-raised rounded-xl px-3 py-2 text-xs font-bold text-on-surface focus:outline-none"
                      >
                        {DIAS_SEMANA.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Franja horaria:</label>
                      <input
                        type="text"
                        value={extra.hora}
                        onChange={(e) => actualizarHoraExtra(idx, e.target.value)}
                        placeholder="Ej. 10:00 a 11:20"
                        className="w-full bg-surface-bg neu-raised rounded-xl px-3 py-2 text-xs font-bold text-accent-violet focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => quitarDiaExtra(idx)}
                      className="absolute right-0 top-6 text-red-500 hover:text-red-700 p-1"
                      title="Quitar día adicional"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarDiaExtra}
                  className="text-accent-violet hover:text-accent-violet/80 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  + Agregar otro día de cursada
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3 pt-2">
          {onCerrar && (
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 py-3 rounded-xl neu-raised text-secondary font-bold text-xs uppercase tracking-wider active:scale-95 transition-all text-center"
            >
              Cancelar
            </button>
          )}

          <button
            type="button"
            onClick={agregarCurso}
            disabled={guardando}
            className="flex-1 py-3 rounded-xl neu-raised text-accent-violet hover:brightness-95 font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {guardando ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                <span className="text-accent-violet">Guardando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base text-accent-violet">save</span>
                <span className="text-accent-violet">Guardar Curso</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}