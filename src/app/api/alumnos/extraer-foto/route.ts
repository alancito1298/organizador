import { NextResponse } from 'next/server';

export const maxDuration = 60; // Permitir hasta 60s en Vercel si es necesario

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.imageBase64) {
      return NextResponse.json({ success: false, error: 'No se recibió la imagen.' }, { status: 400 });
    }

    const { imageBase64, mimeType } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Servicio de IA temporalmente no disponible.' }, { status: 503 });
    }

    // Limpiar string base64 si incluye prefijo data URI
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const cleanMime = mimeType || 'image/jpeg';

    const prompt = `Actúa como un asistente experto en digitalización de nóminas escolares y listas de alumnos.
Analiza con máxima atención la imagen adjunta (que puede ser una lista escrita a mano, una planilla impresa, una hoja de asistencia o un cuaderno de clase).
Tu objetivo es extraer a cada uno de los alumnos presentes en la lista.

Devuelve EXCLUSIVAMENTE un JSON válido (array de objetos) con la siguiente estructura exacta:
[
  {
    "nombre": "Nombre de pila del estudiante",
    "apellido": "Apellido del estudiante",
    "dni": "DNI si figura en la lista, sino dejar vacío"
  }
]

Reglas estrictas:
1. Extrae todos los alumnos que aparezcan legibles en la imagen.
2. Si la lista dice "Apellido, Nombre" (ej: "García, Juan"), asegúrate de asignar "García" como apellido y "Juan" como nombre.
3. Si solo figura el nombre completo en una sola línea (ej: "Juan García"), pon "Juan" como nombre y "García" como apellido.
4. Pon formato Capital Case (primer letra mayúscula, ej: "Martínez", "Sofía").
5. Ignora números de orden (1, 2, 3...), encabezados de columnas (ej. "Alumno", "Firma", "DNI", "Fecha") y firmas o garabatos.
6. Devuelve ÚNICAMENTE el array JSON crudo, empezando con [ y terminando con ]. Sin explicaciones ni texto adicional.`;

    // Modelos activos y compatibles con la API Key actual
    const modelos = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
    let jsonText = '';
    let ultimoError = '';

    for (const mod of modelos) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: cleanMime,
                        data: cleanBase64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2500,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (jsonText.trim()) break;
        } else {
          const errText = await res.text();
          ultimoError = `Modelo ${mod} (${res.status}): ${errText.slice(0, 150)}`;
          console.warn(`Aviso Gemini API:`, ultimoError);
        }
      } catch (errMod: any) {
        ultimoError = errMod?.message || 'Error de conexión con Gemini';
        console.warn(`Error llamando a modelo ${mod}:`, errMod);
      }
    }

    if (!jsonText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se pudo leer la lista de la foto. Asegúrate de que esté bien iluminada y nítida. ' + (ultimoError ? `(${ultimoError})` : ''),
        },
        { status: 422 }
      );
    }

    // Limpiar posibles bloques markdown ```json o texto circundante
    const cleaned = jsonText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    const jsonFinal = jsonMatch ? jsonMatch[0] : cleaned;

    let parsedAlumnos: any[] = [];
    try {
      parsedAlumnos = JSON.parse(jsonFinal);
    } catch (e) {
      console.error('Error parseando JSON de Gemini:', jsonFinal);
      return NextResponse.json(
        { success: false, error: 'La IA leyó la imagen pero no pudo formatear los datos como lista.' },
        { status: 422 }
      );
    }

    if (!Array.isArray(parsedAlumnos) || parsedAlumnos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se detectaron nombres de alumnos en la fotografía. Intenta enfocar más de cerca.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      alumnos: parsedAlumnos,
    });
  } catch (err: any) {
    console.error('Error en /api/alumnos/extraer-foto:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al procesar la imagen de alumnos.' },
      { status: 500 }
    );
  }
}
