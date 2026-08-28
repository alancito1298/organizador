import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

// Rate Limiter en memoria (Sliding window por IP / Token)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Limpiar timestamps fuera de la ventana
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    return false; // Límite excedido
  }

  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  // Limpieza periódica para evitar fugas de memoria
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.timestamps.length === 0 || now - v.timestamps[v.timestamps.length - 1] > windowMs) {
        rateLimitMap.delete(k);
      }
    }
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const authHeader = req.headers.get('authorization');
    const isAutenticado = Boolean(authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 15);

    // Límite de Rate Limit: 15 req/min para autenticados, 3 req/10min para invitados/público
    const rateLimitKey = isAutenticado ? `auth_${authHeader!.slice(-12)}` : `guest_${ip}`;
    const maxRequests = isAutenticado ? 15 : 3;
    const windowMs = isAutenticado ? 60 * 1000 : 10 * 60 * 1000;

    if (!checkRateLimit(rateLimitKey, maxRequests, windowMs)) {
      return NextResponse.json(
        {
          error: isAutenticado
            ? 'Has alcanzado el límite de consultas por minuto. Por favor, aguarda un instante.'
            : 'Has alcanzado el límite de consultas de prueba. Inicia sesión para continuar.',
        },
        { status: 429 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'El mensaje es requerido' }, { status: 400 });
    }

    if (prompt.length > 2500) {
      return NextResponse.json(
        { error: 'El mensaje no puede superar los 2500 caracteres' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Servicio de IA temporalmente no disponible' },
        { status: 503 }
      );
    }

    // Inyectar contexto dinámico de la cuenta del usuario si está autenticado
    let contextoUsuario = '';

    if (isAutenticado) {
      try {
        const resCursos = await fetch(`${API}/cursos`, {
          headers: { Authorization: authHeader! },
        });

        if (resCursos.ok) {
          const cursos = await resCursos.json();
          if (Array.isArray(cursos) && cursos.length > 0) {
            contextoUsuario += `\n\nDATOS Y CONTEXTO REAL DE LA CUENTA DEL DOCENTE (ARGENTINA):\nEl docente autenticado tiene cargadas las siguientes aulas, estudiantes, calificaciones y ASISTENCIAS/FALTAS en su plataforma:\n`;

            for (const c of cursos.slice(0, 8)) {
              contextoUsuario += `\n• CURSO: ${c.anio}° | Materia: "${c.materia}" | Institución: "${c.escuela}" (ID: ${c.id})\n`;

              // 1. Obtener nómina de alumnos
              let inscripcionesMap = new Map<number, string>();
              let alumnosMap = new Map<number, string>();

              try {
                const resInsc = await fetch(`${API}/inscripciones/curso/${c.id}`, {
                  headers: { Authorization: authHeader! },
                });
                if (resInsc.ok) {
                  const inscripciones = await resInsc.json();
                  if (Array.isArray(inscripciones) && inscripciones.length > 0) {
                    const nomina = inscripciones
                      .map((i: any) => {
                        const nombreCompleto = `${i.alumno?.apellido || ''} ${i.alumno?.nombre || ''}`.trim();
                        if (i.id) inscripcionesMap.set(i.id, nombreCompleto);
                        if (i.alumno?.id) alumnosMap.set(i.alumno.id, nombreCompleto);
                        return nombreCompleto;
                      })
                      .filter(Boolean)
                      .join(', ');
                    contextoUsuario += `  Nómina de alumnos (${inscripciones.length}): [${nomina}]\n`;
                  }
                }
              } catch (e) {
                // ignorar fallos
              }

              // 2. Obtener calificaciones del curso
              try {
                const resNotas = await fetch(`${API}/calificaciones/curso/${c.id}`, {
                  headers: { Authorization: authHeader! },
                });
                if (resNotas.ok) {
                  const notas = await resNotas.json();
                  if (Array.isArray(notas) && notas.length > 0) {
                    contextoUsuario += `  REGISTRO DE CALIFICACIONES Y NOTAS (${notas.length} notas cargadas):\n`;

                    const notasPorAlumno = new Map<string, string[]>();
                    for (const n of notas) {
                      const nombreAlumno =
                        (n.alumnoCursoId && inscripcionesMap.get(n.alumnoCursoId)) ||
                        (n.alumno && `${n.alumno.apellido || ''} ${n.alumno.nombre || ''}`.trim()) ||
                        (n.alumnoId && alumnosMap.get(n.alumnoId)) ||
                        `Estudiante`;

                      const valorNota = n.valor !== undefined && n.valor !== null ? n.valor : (n.nota !== undefined ? n.nota : 'Sin nota');
                      const detalleNota = `${n.tipo || 'Evaluación'} (T${n.trimestre || 1}): ${valorNota}`;

                      if (!notasPorAlumno.has(nombreAlumno)) {
                        notasPorAlumno.set(nombreAlumno, []);
                      }
                      notasPorAlumno.get(nombreAlumno)!.push(detalleNota);
                    }

                    for (const [alumno, listaNotas] of notasPorAlumno.entries()) {
                      contextoUsuario += `    - ${alumno}: ${listaNotas.join('; ')}\n`;
                    }
                  } else {
                    contextoUsuario += `  Calificaciones: Sin notas cargadas aún.\n`;
                  }
                }
              } catch (e) {
                // ignorar fallos de notas
              }

              // 3. Obtener asistencias y faltas del curso (todos los trimestres)
              try {
                let todasAsistencias: any[] = [];
                for (let t = 1; t <= 3; t++) {
                  const resAsis = await fetch(`${API}/asistencias/curso/${c.id}?trimestre=${t}`, {
                    headers: { Authorization: authHeader! },
                  });
                  if (resAsis.ok) {
                    const dataAsis = await resAsis.json();
                    if (Array.isArray(dataAsis)) {
                      todasAsistencias = todasAsistencias.concat(dataAsis);
                    }
                  }
                }

                if (todasAsistencias.length > 0) {
                  contextoUsuario += `  REGISTRO DE ASISTENCIAS Y FALTAS (${todasAsistencias.length} registros cargados):\n`;

                  const conteoAsistencias = new Map<string, { presentes: number; ausentes: number; justificadas: number }>();

                  for (const a of todasAsistencias) {
                    const nombreAlumno =
                      (a.alumnoCursoId && inscripcionesMap.get(a.alumnoCursoId)) ||
                      (a.alumno && `${a.alumno.apellido || ''} ${a.alumno.nombre || ''}`.trim()) ||
                      `Estudiante`;

                    if (!conteoAsistencias.has(nombreAlumno)) {
                      conteoAsistencias.set(nombreAlumno, { presentes: 0, ausentes: 0, justificadas: 0 });
                    }

                    const reg = conteoAsistencias.get(nombreAlumno)!;
                    if (a.estado === 'ausente') {
                      reg.ausentes += 1;
                    } else if (a.estado === 'justificada') {
                      reg.justificadas += 1;
                    } else if (a.estado && a.estado.startsWith('presente')) {
                      reg.presentes += 1;
                    }
                  }

                  for (const [alumno, stat] of conteoAsistencias.entries()) {
                    contextoUsuario += `    - ${alumno}: ${stat.presentes} Presentes | ${stat.ausentes} Ausentes (Faltas) | ${stat.justificadas} Justificadas\n`;
                  }
                } else {
                  contextoUsuario += `  Asistencias: Aún no se han tomado asistencias ni registrado faltas en este curso.\n`;
                }
              } catch (e) {
                // ignorar fallos de asistencia
              }
            }

            contextoUsuario += `\nInstrucción de uso de contexto: Si el docente te pregunta por un alumno, asistencias, inasistencias/faltas, justificadas o notas de sus materias, utiliza esta información exacta para responder con precisión.`;
          }
        }
      } catch (errContexto) {
        console.error('Error inyectando contexto de docente:', errContexto);
      }
    }

    const systemInstruction = `Eres un asistente pedagógico profesional especializado en el Sistema Educativo de Argentina (Nivel Secundario y Primario).

REGLAS OBLIGATORIAS DE CONFIGURACIÓN DEL USUARIO:
1. ESTILO 100% DIRECTO AL GRANO: JAMÁS incluyas introducciones, saludos, comentarios de cortesía ni textos de relleno (NO digas "¡Hola!", "Comprendo...", "Aquí tienes..."). Comienza DIRECTAMENTE con el contenido solicitado. Solo incluye explicaciones extendidas si el usuario las pide de manera explícita.
2. EXÁMENES Y EVALUACIONES: Por defecto, formula EXÁMENES CON PREGUNTAS A DESARROLLAR (preguntas conceptuales de análisis, reflexión y desarrollo) adecuadamente numeradas, con su encabezado institucional y pautas de respuesta al final.
3. ADAPTACIONES CURRICULARES (DUA/TDAH/Dislexia): Incluye adaptaciones curriculares ÚNICAMENTE si el docente lo solicita de manera explícita en su consulta.
4. NIVEL EDUCATIVO: Diseñado para Nivel Secundario en Argentina (adaptable a Primaria si la consigna lo menciona).
5. FORMATO: Usa Markdown limpio, estructurado con negritas, listas y bloques bien organizados listo para imprimir o copiar.${contextoUsuario}`;

    const modelos = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
    let replyText = '';

    for (const mod of modelos) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nConsulta del docente:\n${prompt}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2500,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) break;
        } else {
          console.warn(`Modelo ${mod} devolvió estado ${res.status}, intentando siguiente...`);
        }
      } catch (e) {
        console.error(`Error consultando modelo ${mod}:`, e);
      }
    }

    if (!replyText) {
      replyText = 'No pude generar la respuesta en este momento. Por favor reintenta en un instante.';
    }

    return NextResponse.json({ response: replyText });
  } catch (error: any) {
    console.error('Error en API /api/chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
