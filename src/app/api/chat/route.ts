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

// Cache en memoria para el contexto del docente (5 minutos de vigencia para responder al instante)
interface CacheContexto {
  contexto: string;
  expira: number;
}
const cacheContextoDocente = new Map<string, CacheContexto>();

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

    const { prompt, historial } = await req.json();

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

    // Inyectar contexto dinámico ultrarrápido con Cache y llamadas 100% paralelas
    let contextoUsuario = '';

    if (isAutenticado) {
      const cacheKey = authHeader!.slice(-25);
      const entradaCache = cacheContextoDocente.get(cacheKey);

      if (entradaCache && entradaCache.expira > Date.now()) {
        contextoUsuario = entradaCache.contexto;
      } else {
        try {
          const headers = { Authorization: authHeader! };
          const timeoutOpt = { headers, signal: AbortSignal.timeout(3500) };

          // 1. Cargar en paralelo todos los recursos principales del docente
          const [
            resPerfil,
            resSuscripcion,
            resResumen,
            resHorarios,
            resAgenda,
            resPlanificaciones,
            resCursos,
          ] = await Promise.allSettled([
            fetch(`${API}/auth/me`, timeoutOpt),
            fetch(`${API}/suscripciones/estado`, timeoutOpt),
            fetch(`${API}/dashboard/resumen`, timeoutOpt),
            fetch(`${API}/horarios`, timeoutOpt),
            fetch(`${API}/agenda`, timeoutOpt),
            fetch(`${API}/planificaciones`, timeoutOpt),
            fetch(`${API}/cursos`, timeoutOpt),
          ]);

          const perfil = resPerfil.status === 'fulfilled' && resPerfil.value.ok ? await resPerfil.value.json() : null;
          const suscripcion = resSuscripcion.status === 'fulfilled' && resSuscripcion.value.ok ? await resSuscripcion.value.json() : null;
          const resumen = resResumen.status === 'fulfilled' && resResumen.value.ok ? await resResumen.value.json() : null;
          const horarios = resHorarios.status === 'fulfilled' && resHorarios.value.ok ? await resHorarios.value.json() : [];
          const agenda = resAgenda.status === 'fulfilled' && resAgenda.value.ok ? await resAgenda.value.json() : [];
          const planificaciones = resPlanificaciones.status === 'fulfilled' && resPlanificaciones.value.ok ? await resPlanificaciones.value.json() : [];
          const cursos = resCursos.status === 'fulfilled' && resCursos.value.ok ? await resCursos.value.json() : [];

          contextoUsuario += `\n\n═════════════════════════════════════════════════════════════════════\nEXPEDIENTE Y PERFIL INTEGRAL DEL DOCENTE (PLATAFORMA ORGANIZADOR DOCENTE):\n`;

          // ── A. DATOS PERSONALES DEL DOCENTE ──
          if (perfil) {
            contextoUsuario += `\n👤 DATOS PERSONALES Y CUENTA:
• Nombre completo: ${perfil.nombre || ''} ${perfil.apellido || ''}
• Email registrado: ${perfil.email || 'No especificado'}
• ID de usuario: ${perfil.id || 'N/A'}\n`;
          }

          // ── B. SUSCRIPCIÓN Y ESTADO ──
          if (suscripcion) {
            contextoUsuario += `\n⭐ SUSCRIPCIÓN Y PLAN:
• Plan activo: ${suscripcion.plan?.nombre || suscripcion.estado || 'Plus'}
• Estado de la cuenta: ${suscripcion.estado || 'Activo'}${suscripcion.fechaFin ? ` (Vence/Renueva: ${suscripcion.fechaFin.split('T')[0]})` : ''}\n`;
          }

          // ── C. MÉTRICAS GENERALES DE LA CUENTA ──
          if (resumen) {
            contextoUsuario += `\n📊 MÉTRICAS GENERALES DEL DOCENTE EN LA PLATAFORMA:
• Días de uso en el sistema (antigüedad): ${resumen.diasUsandoSistema ?? 0} días
• Total de cursos activos: ${resumen.totalCursos ?? (Array.isArray(cursos) ? cursos.length : 0)}
• Total de alumnos a cargo: ${resumen.totalAlumnos ?? 0}
• Total de asistencias registradas: ${resumen.totalAsistencias ?? 0}
• Total de calificaciones cargadas: ${resumen.totalCalificaciones ?? 0}
• Horarios semanales cargados: ${resumen.totalHorarios ?? (Array.isArray(horarios) ? horarios.length : 0)}
• Planificaciones subidas: ${resumen.totalPlanificaciones ?? (Array.isArray(planificaciones) ? planificaciones.length : 0)}\n`;
          }

          // ── D. HORARIO SEMANAL DE CLASES ──
          if (Array.isArray(horarios) && horarios.length > 0) {
            contextoUsuario += `\n🕒 HORARIOS DE CLASE Y CRONOGRAMA SEMANAL (${horarios.length} bloques asignados):\n`;
            const horariosPorDia = new Map<string, string[]>();

            for (const h of horarios) {
              const diaNorm = h.dia || 'Sin día';
              let detalle = `Hora: ${h.hora || 'No indicada'}`;
              if (h.descripcion) {
                try {
                  const parsed = JSON.parse(h.descripcion);
                  detalle += ` | Materia: ${parsed.materia || ''} | Curso: ${parsed.curso || ''} | Escuela: ${parsed.escuela || ''}`;
                } catch {
                  detalle += ` | Detalle: ${h.descripcion}`;
                }
              }
              if (!horariosPorDia.has(diaNorm)) horariosPorDia.set(diaNorm, []);
              horariosPorDia.get(diaNorm)!.push(detalle);
            }

            for (const [dia, bloques] of horariosPorDia.entries()) {
              contextoUsuario += `• ${dia}:\n  - ${bloques.join('\n  - ')}\n`;
            }
          }

          // ── E. AGENDA Y PRÓXIMOS EVENTOS ──
          if (Array.isArray(agenda) && agenda.length > 0) {
            contextoUsuario += `\n📅 AGENDA Y RECORDATORIOS DEL DOCENTE (${agenda.length} registros):\n`;
            for (const item of agenda.slice(0, 15)) {
              const fechaStr = item.fecha ? item.fecha.split('T')[0] : 'Fecha no definida';
              contextoUsuario += `• [${fechaStr}] ${item.descripcion}\n`;
            }
          }

          // ── F. PLANIFICACIONES DIDÁCTICAS ──
          if (Array.isArray(planificaciones) && planificaciones.length > 0) {
            contextoUsuario += `\n📚 PLANIFICACIONES PEDAGÓGICAS SUBIDAS (${planificaciones.length} planificaciones):\n`;
            for (const p of planificaciones.slice(0, 10)) {
              contextoUsuario += `• ${p.titulo || p.nombre || 'Planificación'} (Curso ID: ${p.cursoId || 'General'})${p.descripcion ? `: ${p.descripcion}` : ''}\n`;
            }
          }

          // ── G. CURSOS, ESTUDIANTES, NOTAS Y ASISTENCIAS (PARALELO) ──
          if (Array.isArray(cursos) && cursos.length > 0) {
            contextoUsuario += `\n🏫 AULAS, CURSOS Y ESTUDIANTES A CARGO (${cursos.length} cursos):\n`;

            const cursosParalelos = await Promise.all(
              cursos.slice(0, 8).map(async (c: any) => {
                let cursoInfoTxt = `\n▼ CURSO: ${c.anio}° | Materia: "${c.materia}" | Institución: "${c.escuela}" (ID: ${c.id})\n`;

                const [resInsc, resNotas, resAsis] = await Promise.all([
                  fetch(`${API}/inscripciones/curso/${c.id}`, timeoutOpt).catch(() => null),
                  fetch(`${API}/calificaciones/curso/${c.id}`, timeoutOpt).catch(() => null),
                  fetch(`${API}/asistencias/curso/${c.id}`, timeoutOpt).catch(() => null),
                ]);

                const inscripciones = resInsc && resInsc.ok ? await resInsc.json().catch(() => []) : [];
                const notas = resNotas && resNotas.ok ? await resNotas.json().catch(() => []) : [];
                const asistencias = resAsis && resAsis.ok ? await resAsis.json().catch(() => []) : [];

                const inscripcionesMap = new Map<number, string>();
                const alumnosMap = new Map<number, string>();

                if (Array.isArray(inscripciones) && inscripciones.length > 0) {
                  const nomina = inscripciones
                    .map((i: any) => {
                      const nombreCompleto = `${i.alumno?.apellido || ''} ${i.alumno?.nombre || ''}`.trim();
                      if (i.id) inscripcionesMap.set(i.id, nombreCompleto);
                      if (i.alumno?.id) alumnosMap.set(i.alumno.id, nombreCompleto);
                      const extra = [i.alumno?.dni ? `DNI: ${i.alumno.dni}` : '', i.alumno?.contacto ? `Tel: ${i.alumno.contacto}` : ''].filter(Boolean).join(' - ');
                      return extra ? `${nombreCompleto} (${extra})` : nombreCompleto;
                    })
                    .filter(Boolean)
                    .join(', ');
                  cursoInfoTxt += `  Nómina de alumnos (${inscripciones.length}): [${nomina}]\n`;
                }

                if (Array.isArray(notas) && notas.length > 0) {
                  cursoInfoTxt += `  Calificaciones (${notas.length} notas):\n`;
                  const notasPorAlumno = new Map<string, string[]>();
                  for (const n of notas) {
                    const nombreAlumno =
                      (n.alumnoCursoId && inscripcionesMap.get(n.alumnoCursoId)) ||
                      (n.alumno && `${n.alumno.apellido || ''} ${n.alumno.nombre || ''}`.trim()) ||
                      `Estudiante`;
                    const valorNota = n.valor !== undefined && n.valor !== null ? n.valor : (n.nota !== undefined ? n.nota : 'Sin nota');
                    const detalleNota = `${n.tipo || 'Evaluación'} (T${n.trimestre || 1}): ${valorNota}`;
                    if (!notasPorAlumno.has(nombreAlumno)) notasPorAlumno.set(nombreAlumno, []);
                    notasPorAlumno.get(nombreAlumno)!.push(detalleNota);
                  }
                  for (const [alumno, listaNotas] of notasPorAlumno.entries()) {
                    cursoInfoTxt += `    - ${alumno}: ${listaNotas.join('; ')}\n`;
                  }
                }

                if (Array.isArray(asistencias) && asistencias.length > 0) {
                  cursoInfoTxt += `  Asistencias y Faltas (${asistencias.length} registros):\n`;
                  const conteo = new Map<string, { presentes: number; ausentes: number; justificadas: number; buenConcepto: number; malConcepto: number }>();
                  for (const a of asistencias) {
                    const nombreAlumno =
                      (a.alumnoCursoId && inscripcionesMap.get(a.alumnoCursoId)) ||
                      (a.alumno && `${a.alumno.apellido || ''} ${a.alumno.nombre || ''}`.trim()) ||
                      `Estudiante`;
                    if (!conteo.has(nombreAlumno)) {
                      conteo.set(nombreAlumno, { presentes: 0, ausentes: 0, justificadas: 0, buenConcepto: 0, malConcepto: 0 });
                    }
                    const reg = conteo.get(nombreAlumno)!;
                    if (a.estado === 'ausente') reg.ausentes += 1;
                    else if (a.estado === 'justificada') reg.justificadas += 1;
                    else if (a.estado === 'presente_buen_concepto') { reg.presentes += 1; reg.buenConcepto += 1; }
                    else if (a.estado === 'presente_mal_concepto') { reg.presentes += 1; reg.malConcepto += 1; }
                    else if (a.estado && a.estado.startsWith('presente')) reg.presentes += 1;
                  }
                  for (const [alumno, stat] of conteo.entries()) {
                    const conceptosTxt = [
                      stat.buenConcepto > 0 ? `${stat.buenConcepto} buen concepto` : '',
                      stat.malConcepto > 0 ? `${stat.malConcepto} mal concepto` : '',
                    ].filter(Boolean).join(', ');
                    cursoInfoTxt += `    - ${alumno}: ${stat.presentes} Presentes | ${stat.ausentes} Ausentes (Faltas) | ${stat.justificadas} Justificadas${conceptosTxt ? ` (${conceptosTxt})` : ''}\n`;
                  }
                }

                return cursoInfoTxt;
              })
            );

            contextoUsuario += cursosParalelos.join('\n');
          }

          contextoUsuario += `\nINSTRUCCIÓN CRÍTICA DE CONOCIMIENTO PERSONAL: Conoces cada detalle del perfil del docente: su nombre, email, plan, días en la plataforma, escuelas donde enseña, horarios y días de clase, agenda y recordatorios, planificaciones, materias, cada uno de sus alumnos con sus asistencias, faltas, notas y conceptos. Si el docente te pregunta cualquier dato sobre su información personal, profesional, institucional o de sus estudiantes, responde con exactitud y calidez profesional utilizando este expediente.`;

          // Guardar en cache por 5 minutos (300.000 ms)
          cacheContextoDocente.set(cacheKey, {
            contexto: contextoUsuario,
            expira: Date.now() + 5 * 60 * 1000,
          });
        } catch (errContexto) {
          console.error('Error inyectando contexto de docente:', errContexto);
        }
      }
    }

    let historialTexto = '';
    if (Array.isArray(historial) && historial.length > 0) {
      const turnos = historial
        .filter((m: any) => m && m.text && (m.sender === 'user' || m.sender === 'bot'))
        .slice(-8)
        .map((m: any) => `${m.sender === 'user' ? 'Docente' : 'Asistente'}: ${m.text.slice(0, 800)}`);
      if (turnos.length > 0) {
        historialTexto = `\n\n═════════════════════════════════════════════════════════════════════\nHISTORIAL RECIENTE DE LA CONVERSACIÓN CON EL DOCENTE:\n${turnos.join('\n\n')}\n═════════════════════════════════════════════════════════════════════\n`;
      }
    }

    const systemInstruction = `Eres un asistente pedagógico profesional especializado en el Sistema Educativo de Argentina (Nivel Inicial, Primario y Secundario), con amplio dominio de la normativa vigente (Ley de Educación Nacional N° 26.206, Resoluciones del Consejo Federal de Educación - CFE como Res. 311/16 de Inclusión Escolar, Res. 84/09, Res. 93/09, NAP - Núcleos de Aprendizajes Prioritarios y Diseños Curriculares Jurisdiccionales de cada provincia).

DIRECTIVAS PEDAGÓGICAS Y DE INTERACCIÓN OBLIGATORIAS:

1. INTERACTIVIDAD EN PLANIFICACIONES, SECUENCIAS Y PROYECTOS (MUY IMPORTANTE):
   - Cuando el docente te pida armar una planificación (anual, periódica, de unidad), secuencia didáctica o proyecto pedagógico / ABP (Aprendizaje Basado en Proyectos):
     a) Si la consulta es breve o le faltan datos esenciales para contextualizarla bien, NO generes una planificación cerrada o genérica de inmediato.
     b) En su lugar, sé INTERACTIVO: brinda una breve propuesta orientadora inicial (ideas disparadoras de 2 o 3 líneas) y pídele amablemente al docente los datos clave antes de entregarle la versión final completa:
        • Jurisdicción / Provincia y Nivel exacto (para adaptarlo al Diseño Curricular correspondiente).
        • Año / Curso y Materia (ej. 2° año Secundaria Básica - Geografía).
        • Carga horaria estimada o cantidad de clases/semanas previstas.
        • Enfoque pedagógico o dinámica preferida (ABP, estudio de casos, aula invertida, taller, trabajo en grupos).
        • Si tiene alumnos con inclusión / PPI o adecuaciones curriculares (según Res. CFE 311/16) o si en su escuela se aplica alguna resolución institucional específica.
     c) Si el docente YA te proporcionó estos detalles en su pedido o en el historial reciente, genera directamente la planificación completa, profunda, estructurada y lista para aplicar, explicitando la fundamentación y normativa pedagógica.

2. CLARIDAD Y RIGOR EN RESOLUCIONES Y NORMATIVAS EDUCATIVAS ARGENTINAS:
   - Al fundamentar pedagógicamente, cita y articula con precisión el marco normativo (Ley 26.206, Res. CFE 311/16 para inclusión/DUA, NAP, regímenes académicos).
   - Recuerda y aclara siempre al docente que si en su jurisdicción o institución aplican alguna resolución provincial, decreto ministerial o circular técnica específica, te la puede mencionar o pegar y tú la articularás de inmediato.

3. EXÁMENES Y EVALUACIONES:
   - Por defecto, formula evaluaciones con preguntas a desarrollar (análisis reflexivo, pensamiento crítico y producción conceptual), con membrete institucional formal y criterios de evaluación claros.

4. FORMATO Y TONO:
   - Tono pedagógico, profesional, cercano y constructivo de colega a colega docente.
   - Sin rodeos ni disculpas vacías: ve directo al grano o a las preguntas orientadoras.
   - Usa Markdown prolijo: títulos en negrita (# y ##), subtítulos (###), viñetas y formato listo para copiar o imprimir.${contextoUsuario}`;

    // Modelos de respuesta ultrarrápida (gemini-3.5-flash responde en ~1 segundo)
    const modelos = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];
    let replyText = '';

    for (const mod of modelos) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}${historialTexto}\n\nConsulta del docente:\n${prompt}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2500,
              },
            }),
          }
        );
        clearTimeout(timeoutId);

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
