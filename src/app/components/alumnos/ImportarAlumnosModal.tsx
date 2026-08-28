'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Download, Check, X, AlertCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

interface AlumnoImportado {
  idTemp: string;
  apellido: string;
  nombre: string;
  dni?: string;
  contacto?: string;
  valido: boolean;
  seleccionado: boolean;
}

interface Props {
  cursoId: number;
  abierto: boolean;
  onCerrar: () => void;
  onImportacionExitosa: () => void;
}

export default function ImportarAlumnosModal({
  cursoId,
  abierto,
  onCerrar,
  onImportacionExitosa,
}: Props) {
  const [alumnos, setAlumnos] = useState<AlumnoImportado[]>([]);
  const [modoPegar, setModoPegar] = useState(false);
  const [textoPegado, setTextoPegado] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!abierto) return null;

  // Descargar plantilla Excel modelo de ejemplo
  const descargarPlantilla = () => {
    const wsData = [
      ['Apellido', 'Nombre', 'DNI', 'Contacto'],
      ['García', 'Mateo', '45123456', '1123456789'],
      ['Rodríguez', 'Sofía', '46789012', '1134567890'],
      ['Fernández', 'Lucas', '47111222', '1145678901'],
      ['López', 'Valentina', '48333444', '1156789012'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
    XLSX.writeFile(wb, 'Plantilla_Alumnos_OrganizadorDocente.xlsx');
  };

  // Procesar archivo Excel / CSV subido
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        parseRawData(rawData);
      } catch (err) {
        console.error('Error leyendo archivo Excel:', err);
        setErrorMsg('No se pudo leer el archivo. Asegúrate de que sea un archivo .xlsx, .xls o .csv válido.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Procesar texto pegado desde portapapeles
  const handleParseTextoPegado = () => {
    if (!textoPegado.trim()) return;
    const lineas = textoPegado.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rawData = lineas.map((linea) =>
      linea.includes('\t') ? linea.split('\t') : linea.includes(';') ? linea.split(';') : linea.split(',')
    );
    parseRawData(rawData);
  };

  // Parser inteligente de filas de datos
  const parseRawData = (rows: any[][]) => {
    if (!rows || rows.length === 0) {
      setErrorMsg('El archivo está vacío.');
      return;
    }

    const resultado: AlumnoImportado[] = [];

    // Detectar si la primera fila son encabezados
    let indiceInicio = 0;
    let colApellido = -1;
    let colNombre = -1;
    let colCompuesto = -1;
    let colDni = -1;
    let colContacto = -1;

    const primeraFila = rows[0].map((c) => String(c || '').toLowerCase().trim());

    primeraFila.forEach((col, idx) => {
      if (col.includes('apellido') && col.includes('nombre')) colCompuesto = idx;
      else if (col.includes('apellido')) colApellido = idx;
      else if (col.includes('nombre') || col.includes('estudiante') || col.includes('alumno')) colNombre = idx;
      else if (col.includes('dni') || col.includes('documento') || col.includes('cedula')) colDni = idx;
      else if (col.includes('contacto') || col.includes('telefono') || col.includes('celular') || col.includes('mail')) colContacto = idx;
    });

    if (colApellido !== -1 || colNombre !== -1 || colCompuesto !== -1) {
      indiceInicio = 1; // La primera fila era encabezado
    }

    for (let r = indiceInicio; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0 || row.every((c) => !c || String(c).trim() === '')) continue;

      let apellido = '';
      let nombre = '';
      let dni = '';
      let contacto = '';

      if (colCompuesto !== -1 && row[colCompuesto]) {
        const full = String(row[colCompuesto]).trim();
        if (full.includes(',')) {
          const parts = full.split(',');
          apellido = parts[0].trim();
          nombre = parts.slice(1).join(' ').trim();
        } else {
          const parts = full.split(/\s+/);
          apellido = parts[0] || '';
          nombre = parts.slice(1).join(' ') || '';
        }
      } else if (colApellido !== -1 && colNombre !== -1) {
        apellido = String(row[colApellido] || '').trim();
        nombre = String(row[colNombre] || '').trim();
      } else if (row.length === 1) {
        const full = String(row[0]).trim();
        if (full.includes(',')) {
          const parts = full.split(',');
          apellido = parts[0].trim();
          nombre = parts.slice(1).join(' ').trim();
        } else {
          const parts = full.split(/\s+/);
          apellido = parts[0] || '';
          nombre = parts.slice(1).join(' ') || '';
        }
      } else {
        // Asignación por posición estándar: Col 0: Apellido, Col 1: Nombre, Col 2: DNI, Col 3: Contacto
        apellido = String(row[0] || '').trim();
        nombre = String(row[1] || '').trim();
      }

      if (colDni !== -1 && row[colDni]) dni = String(row[colDni]).trim();
      else if (row[2] && String(row[2]).length >= 6) dni = String(row[2]).trim();

      if (colContacto !== -1 && row[colContacto]) contacto = String(row[colContacto]).trim();
      else if (row[3]) contacto = String(row[3]).trim();

      const valido = Boolean(apellido.length > 0 && nombre.length > 0);

      resultado.push({
        idTemp: `temp_${r}_${Math.random()}`,
        apellido,
        nombre,
        dni: dni || undefined,
        contacto: contacto || undefined,
        valido,
        seleccionado: valido,
      });
    }

    if (resultado.length === 0) {
      setErrorMsg('No se detectaron alumnos válidos en las filas leídas.');
    } else {
      setAlumnos(resultado);
      setModoPegar(false);
    }
  };

  // Guardar e inscribir a los alumnos seleccionados en lote
  const handleGuardarLote = async () => {
    const seleccionados = alumnos.filter((a) => a.seleccionado && a.valido);
    if (seleccionados.length === 0) {
      alert('Por favor selecciona al menos un alumno válido para importar.');
      return;
    }

    setProcesando(true);
    setProgreso({ actual: 0, total: seleccionados.length });
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    let exitosos = 0;

    for (let i = 0; i < seleccionados.length; i++) {
      const a = seleccionados[i];
      try {
        // 1. Crear Alumno
        const resAlumno = await fetch(`${API}/alumnos`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            nombre: a.nombre,
            apellido: a.apellido,
            dni: a.dni || undefined,
            contacto: a.contacto || undefined,
          }),
        });

        if (resAlumno.ok) {
          const nuevoAlumno = await resAlumno.json();
          // 2. Inscribir en el curso actual
          await fetch(`${API}/inscripciones`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              alumnoId: nuevoAlumno.id,
              cursoId,
            }),
          });
          exitosos++;
        }
      } catch (err) {
        console.error('Error importando alumno:', a, err);
      }
      setProgreso({ actual: i + 1, total: seleccionados.length });
    }

    setProcesando(false);
    alert(`🎉 ¡Se importaron e inscribieron ${exitosos} alumnos con éxito en el curso!`);
    onImportacionExitosa();
    onCerrar();
  };

  const toggleSeleccion = (idTemp: string) => {
    setAlumnos((prev) =>
      prev.map((a) => (a.idTemp === idTemp ? { ...a, seleccionado: !a.seleccionado } : a))
    );
  };

  const toggleSeleccionarTodos = () => {
    const todosSeleccionados = alumnos.every((a) => a.seleccionado);
    setAlumnos((prev) => prev.map((a) => ({ ...a, seleccionado: !todosSeleccionados })));
  };

  const handleEditarAlumno = (idTemp: string, campo: 'apellido' | 'nombre' | 'dni' | 'contacto', valor: string) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.idTemp !== idTemp) return a;
        const actualizado = { ...a, [campo]: valor };
        actualizado.valido = Boolean(actualizado.apellido.trim() && actualizado.nombre.trim());
        return actualizado;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-violet-100">
        {/* Header */}
        <div className="bg-violet-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-violet-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Importar Alumnos desde Excel / CSV</h3>
              <p className="text-xs text-violet-300">Carga nóminas completas de estudiantes en segundos</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            disabled={procesando}
            className="text-violet-300 hover:text-white p-2 rounded-full hover:bg-violet-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {alumnos.length === 0 ? (
            <div className="space-y-6">
              {/* Zona de Subida */}
              {!modoPegar ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-violet-300 hover:border-violet-600 bg-violet-50/50 hover:bg-violet-50 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center text-violet-700 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-violet-950 text-lg">
                      Arrastrá tu archivo Excel o hacé clic para buscar
                    </p>
                    <p className="text-xs text-violet-600 mt-1">
                      Formatos soportados: .xlsx, .xls, .csv (detecta columnas de Apellido, Nombre y DNI automáticamente)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-violet-950">
                    Pegá las filas copiadas directamente de tu planilla de Excel:
                  </label>
                  <textarea
                    rows={6}
                    value={textoPegado}
                    onChange={(e) => setTextoPegado(e.target.value)}
                    placeholder="García, Mateo&#10;Rodríguez, Sofía&#10;Fernández Lucas&#10;López Valentina"
                    className="w-full p-4 rounded-2xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm font-mono"
                  />
                  <button
                    onClick={handleParseTextoPegado}
                    className="bg-violet-950 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-900 transition-colors"
                  >
                    Analizar Alumnos
                  </button>
                </div>
              )}

              {/* Botones de acción secundaria */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModoPegar(!modoPegar)}
                  className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline"
                >
                  {modoPegar ? '📁 Cambiar a subir archivo Excel' : '📋 O pegar texto / columnas directamente'}
                </button>

                <button
                  type="button"
                  onClick={descargarPlantilla}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-800 bg-violet-100 hover:bg-violet-200 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar Plantilla de Ejemplo (.xlsx)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-violet-950">Vista Previa de Alumnos Detectados</h4>
                  <p className="text-xs text-gray-500">
                    Se encontraron {alumnos.length} estudiantes ({alumnos.filter((a) => a.seleccionado).length} seleccionados para importar)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSeleccionarTodos}
                    className="text-xs font-semibold text-violet-700 hover:text-violet-950 px-3 py-1.5 rounded-lg border border-violet-200"
                  >
                    Seleccionar Todos
                  </button>
                  <button
                    onClick={() => {
                      setAlumnos([]);
                      setTextoPegado('');
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    Cambiar archivo
                  </button>
                </div>
              </div>

              {/* Tabla interactiva */}
              <div className="border border-violet-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-violet-50 text-violet-950 uppercase font-bold sticky top-0 border-b border-violet-200">
                    <tr>
                      <th className="p-3 w-10 text-center">✓</th>
                      <th className="p-3">Apellido</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">DNI (Opcional)</th>
                      <th className="p-3">Contacto / Tel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {alumnos.map((a) => (
                      <tr
                        key={a.idTemp}
                        className={`hover:bg-violet-50/50 ${!a.valido ? 'bg-red-50/60' : a.seleccionado ? 'bg-white' : 'opacity-50'}`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={a.seleccionado}
                            onChange={() => toggleSeleccion(a.idTemp)}
                            className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={a.apellido}
                            onChange={(e) => handleEditarAlumno(a.idTemp, 'apellido', e.target.value)}
                            placeholder="Apellido..."
                            className="w-full p-1.5 rounded border border-gray-200 text-xs focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={a.nombre}
                            onChange={(e) => handleEditarAlumno(a.idTemp, 'nombre', e.target.value)}
                            placeholder="Nombre..."
                            className="w-full p-1.5 rounded border border-gray-200 text-xs focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={a.dni || ''}
                            onChange={(e) => handleEditarAlumno(a.idTemp, 'dni', e.target.value)}
                            placeholder="DNI..."
                            className="w-full p-1.5 rounded border border-gray-200 text-xs focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={a.contacto || ''}
                            onChange={(e) => handleEditarAlumno(a.idTemp, 'contacto', e.target.value)}
                            placeholder="Tel / Mail..."
                            className="w-full p-1.5 rounded border border-gray-200 text-xs focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onCerrar}
            disabled={procesando}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>

          {alumnos.length > 0 && (
            <button
              onClick={handleGuardarLote}
              disabled={procesando || alumnos.filter((a) => a.seleccionado && a.valido).length === 0}
              className="bg-violet-950 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-violet-900 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesando ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Importando ({progreso.actual} de {progreso.total})...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Guardar e Inscribir ({alumnos.filter((a) => a.seleccionado && a.valido).length}) Alumnos
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
