'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Download, Check, X, AlertCircle, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

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
  onImportacionExitosa?: () => void;
  onImportados?: () => void;
  modoInicial?: 'excel' | 'foto' | 'pegar';
}

/**
 * Redimensiona y comprime la imagen del cliente usando Canvas
 * Convierte fotos pesadas de teléfonos (5MB - 15MB) a un JPEG liviano (~250KB)
 * evitando problemas de límites de payload (413) y timeouts en Vercel/móviles.
 */
function comprimirImagenParaIA(file: File, maxDimension = 1600, calidad = 0.82): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no soportado por el navegador.'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', calidad);
          resolve({ base64: compressed, mimeType: 'image/jpeg' });
        } catch {
          resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImportarAlumnosModal({
  cursoId,
  abierto,
  onCerrar,
  onImportacionExitosa,
  onImportados,
  modoInicial = 'excel',
}: Props) {
  const [alumnos, setAlumnos] = useState<AlumnoImportado[]>([]);
  const [modoEntrada, setModoEntrada] = useState<'excel' | 'foto' | 'pegar'>(modoInicial);
  const [textoPegado, setTextoPegado] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [analizandoFoto, setAnalizandoFoto] = useState(false);
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!abierto) return null;

  // Descargar plantilla Excel modelo de ejemplo (2 columnas: Nombre y Apellido)
  const descargarPlantilla = () => {
    const wsData = [
      ['Nombre', 'Apellido'],
      ['Mateo', 'García'],
      ['Sofía', 'Rodríguez'],
      ['Lucas', 'Fernández'],
      ['Valentina', 'López'],
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

  // Procesar imagen / foto de nómina con Inteligencia Artificial
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalizandoFoto(true);
    try {
      // 1. Comprimir imagen en el cliente para reducir tamaño y garantizar formato JPEG compatible
      const { base64, mimeType } = await comprimirImagenParaIA(file, 1600, 0.82);

      // 2. Enviar a la API
      const res = await fetch('/api/alumnos/extraer-foto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      // 3. Parsear respuesta de manera segura contra respuestas HTML / errores no-JSON
      const textResponse = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(textResponse);
      } catch {
        throw new Error(
          res.status === 413
            ? 'La imagen es demasiado pesada. Por favor toma la foto un poco más de cerca o comprímela.'
            : `El servidor devolvió un error inesperado (${res.status}).`
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'No se pudo leer la lista de la foto. Intenta con una imagen más nítida y bien iluminada.');
      }

      const lista: AlumnoImportado[] = (data.alumnos || []).map((a: any, idx: number) => {
        const nombre = (a.nombre || '').trim();
        const apellido = (a.apellido || '').trim();
        const dni = (a.dni || '').trim();
        const valido = Boolean(nombre.length > 0 && apellido.length > 0);

        return {
          idTemp: `foto_${idx}_${Math.random().toString(36).substring(2, 9)}`,
          nombre,
          apellido,
          dni: dni || undefined,
          contacto: undefined,
          valido,
          seleccionado: valido,
        };
      });

      if (lista.length === 0) {
        setErrorMsg('No se detectaron nombres legibles en la fotografía. Intenta enfocar los nombres con mayor claridad.');
      } else {
        setAlumnos(lista);
      }
    } catch (err: any) {
      console.error('Error al procesar foto:', err);
      setErrorMsg(err?.message || 'Error al procesar la foto con Inteligencia Artificial.');
    } finally {
      setAnalizandoFoto(false);
      // Limpiar el input para permitir seleccionar la misma imagen si se desea
      e.target.value = '';
    }
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
      else if (col.includes('nombre') || col.includes('estudiante') || col.includes('alumno')) colNombre = idx;
      else if (col.includes('apellido')) colApellido = idx;
      else if (col.includes('dni') || col.includes('documento') || col.includes('cedula')) colDni = idx;
      else if (col.includes('contacto') || col.includes('telefono') || col.includes('celular') || col.includes('mail')) colContacto = idx;
    });

    if (colApellido !== -1 || colNombre !== -1 || colCompuesto !== -1) {
      indiceInicio = 1;
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
          nombre = parts[0] || '';
          apellido = parts.slice(1).join(' ') || '';
        }
      } else if (colApellido !== -1 && colNombre !== -1) {
        nombre = String(row[colNombre] || '').trim();
        apellido = String(row[colApellido] || '').trim();
      } else if (row.length === 1) {
        const full = String(row[0]).trim();
        if (full.includes(',')) {
          const parts = full.split(',');
          apellido = parts[0].trim();
          nombre = parts.slice(1).join(' ').trim();
        } else {
          const parts = full.split(/\s+/);
          nombre = parts[0] || '';
          apellido = parts.slice(1).join(' ') || '';
        }
      } else {
        // Asignación estándar de 2 columnas: Columna 1 = Nombre, Columna 2 = Apellido
        nombre = String(row[0] || '').trim();
        apellido = String(row[1] || '').trim();
      }

      if (colDni !== -1 && row[colDni]) dni = String(row[colDni]).trim();
      else if (row[2] && String(row[2]).length >= 6) dni = String(row[2]).trim();

      if (colContacto !== -1 && row[colContacto]) contacto = String(row[colContacto]).trim();
      else if (row[3]) contacto = String(row[3]).trim();

      const valido = Boolean(apellido.length > 0 && nombre.length > 0);

      resultado.push({
        idTemp: `temp_${r}_${Math.random().toString(36).substring(2, 9)}`,
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
    if (onImportacionExitosa) onImportacionExitosa();
    if (onImportados) onImportados();
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

  const handleDescartar = () => {
    setAlumnos([]);
    setTextoPegado('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-violet-100">
        {/* Header */}
        <div className="bg-violet-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-800 flex items-center justify-center">
              {modoEntrada === 'foto' ? (
                <Camera className="w-5 h-5 text-violet-200" />
              ) : (
                <FileSpreadsheet className="w-5 h-5 text-violet-200" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {alumnos.length > 0
                  ? 'Vista Previa de Alumnos'
                  : modoEntrada === 'foto'
                  ? 'Cargar Alumnos mediante Foto'
                  : 'Importar Alumnos desde Excel / CSV'}
              </h3>
              <p className="text-xs text-violet-300">
                {alumnos.length > 0
                  ? 'Paso 2: Verifica que los datos estén bien asignados antes de guardar'
                  : modoEntrada === 'foto'
                  ? 'Saca una foto o sube una imagen de la nómina escolar'
                  : 'Carga nóminas (Columna 1: Nombre, Columna 2: Apellido)'}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            disabled={procesando || analizandoFoto}
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
            <div className="space-y-5">
              {/* Selector de Modo de Entrada (Excel / Foto / Pegar) */}
              <div className="flex items-center bg-violet-50 p-1.5 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setModoEntrada('excel')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    modoEntrada === 'excel'
                      ? 'bg-violet-950 text-white shadow-sm'
                      : 'text-violet-700 hover:bg-white/60'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Archivo Excel
                </button>
                <button
                  type="button"
                  onClick={() => setModoEntrada('foto')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    modoEntrada === 'foto'
                      ? 'bg-violet-950 text-white shadow-sm'
                      : 'text-violet-700 hover:bg-white/60'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Foto / Escanear (IA)
                </button>
                <button
                  type="button"
                  onClick={() => setModoEntrada('pegar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    modoEntrada === 'pegar'
                      ? 'bg-violet-950 text-white shadow-sm'
                      : 'text-violet-700 hover:bg-white/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Copiar y Pegar
                </button>
              </div>

              {/* Modo 1: Subir Archivo Excel */}
              {modoEntrada === 'excel' && (
                <div className="space-y-4">
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
                        Formatos: .xlsx, .xls, .csv (2 columnas estándar: 1ª Nombre, 2ª Apellido. Sin necesidad de formato tabla)
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={descargarPlantilla}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-violet-800 bg-violet-100 hover:bg-violet-200 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Plantilla de Ejemplo (2 Columnas) (.xlsx)
                    </button>
                  </div>
                </div>
              )}

              {/* Modo 2: Cargar mediante Foto con IA */}
              {modoEntrada === 'foto' && (
                <div className="space-y-4">
                  {/* Inputs nativos controlados por <label> para evitar DOMException en Safari/iOS */}
                  <input
                    id="foto-camara-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={handleFotoUpload}
                  />
                  <input
                    id="foto-galeria-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFotoUpload}
                  />

                  {analizandoFoto ? (
                    <div className="border-2 border-violet-300 bg-violet-50/70 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-pulse">
                      <div className="w-16 h-16 rounded-2xl bg-violet-200 flex items-center justify-center text-accent-violet animate-bounce">
                        <Sparkles className="w-8 h-8 text-violet-700" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-violet-950">Analizando foto con Inteligencia Artificial...</h4>
                        <p className="text-xs text-violet-700 mt-1">
                          Optimizando imagen, leyendo la lista y reconociendo nombres y apellidos automáticamente.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Opción A: Sacar foto con la cámara del dispositivo */}
                      <label
                        htmlFor="foto-camara-input"
                        className="border-2 border-dashed border-violet-300 hover:border-violet-600 bg-violet-50/50 hover:bg-violet-50 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center text-violet-700 transition-colors">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-bold text-violet-950 text-base">Tomar Foto con la Cámara</p>
                          <p className="text-xs text-violet-600 mt-0.5">
                            Apunta y saca una foto clara de la nómina o papel
                          </p>
                        </div>
                      </label>

                      {/* Opción B: Subir imagen existente de la galería */}
                      <label
                        htmlFor="foto-galeria-input"
                        className="border-2 border-dashed border-violet-300 hover:border-violet-600 bg-violet-50/50 hover:bg-violet-50 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center text-violet-700 transition-colors">
                          <ImageIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-bold text-violet-950 text-base">Elegir de la Galería / Archivos</p>
                          <p className="text-xs text-violet-600 mt-0.5">
                            Sube una imagen o captura guardada en tu dispositivo
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="bg-violet-50/60 p-4 rounded-2xl border border-violet-100 text-xs text-violet-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-violet-950">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      Consejos para una foto óptima:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-violet-700">
                      <li>Asegúrate de que haya buena iluminación y sin sombras sobre los nombres.</li>
                      <li>Funciona tanto con listas impresas como escritas a mano en letra clara.</li>
                      <li>Antes de guardar, podrás revisar cada alumno en la vista previa y corregir lo que necesites.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Modo 3: Copiar y Pegar Texto */}
              {modoEntrada === 'pegar' && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-violet-950">
                    Pegá las filas copiadas de tu planilla o texto (Columna 1: Nombre, Columna 2: Apellido):
                  </label>
                  <textarea
                    rows={6}
                    value={textoPegado}
                    onChange={(e) => setTextoPegado(e.target.value)}
                    placeholder="Mateo&#9;García&#10;Sofía&#9;Rodríguez&#10;Lucas&#9;Fernández&#10;Valentina&#9;López"
                    className="w-full p-4 rounded-2xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm font-mono"
                  />
                  <button
                    onClick={handleParseTextoPegado}
                    className="bg-violet-950 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-900 transition-colors"
                  >
                    Ver Vista Previa
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Banner informativo de vista previa */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-amber-950 mb-0.5">👁️ Vista Previa de Verificación</span>
                  <span>
                    Revisa que las columnas de <strong>Nombre</strong> y <strong>Apellido</strong> se hayan extraído correctamente. Puedes corregir cualquier dato directamente en la tabla. Si los datos están bien, presiona <strong>Aceptar e Importar</strong>. Si prefieres reintentar, haz clic en <strong>Descartar</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-violet-950">Estudiantes Detectados ({alumnos.length})</h4>
                  <p className="text-xs text-gray-500">
                    {alumnos.filter((a) => a.seleccionado && a.valido).length} listos para importar al curso
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSeleccionarTodos}
                    className="text-xs font-semibold text-violet-700 hover:text-violet-950 px-3 py-1.5 rounded-lg border border-violet-200 hover:bg-violet-50 transition-colors"
                  >
                    {alumnos.every((a) => a.seleccionado) ? 'Desmarcar Todos' : 'Seleccionar Todos'}
                  </button>
                  <button
                    onClick={handleDescartar}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Descartar datos
                  </button>
                </div>
              </div>

              {/* Tabla interactiva */}
              <div className="border border-violet-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-violet-50 text-violet-950 uppercase font-bold sticky top-0 border-b border-violet-200">
                    <tr>
                      <th className="p-3 w-10 text-center">✓</th>
                      <th className="p-3">Nombre (Col. 1)</th>
                      <th className="p-3">Apellido (Col. 2)</th>
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
                            value={a.nombre}
                            onChange={(e) => handleEditarAlumno(a.idTemp, 'nombre', e.target.value)}
                            placeholder="Nombre..."
                            className="w-full p-1.5 rounded border border-gray-200 text-xs focus:border-violet-500 focus:outline-none"
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
          {alumnos.length > 0 ? (
            <button
              type="button"
              onClick={handleDescartar}
              disabled={procesando}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Descartar y volver a intentar
            </button>
          ) : (
            <button
              type="button"
              onClick={onCerrar}
              disabled={procesando || analizandoFoto}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
          )}

          {alumnos.length > 0 && (
            <button
              onClick={handleGuardarLote}
              disabled={procesando || alumnos.filter((a) => a.seleccionado && a.valido).length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {procesando ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Cargando ({progreso.actual} de {progreso.total})...
                </>
              ) : (
                <>
                  <Check className="w-4.5 h-4.5" />
                  Aceptar e Importar ({alumnos.filter((a) => a.seleccionado && a.valido).length}) Alumnos
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
