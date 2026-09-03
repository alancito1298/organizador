import { NextResponse } from 'next/server';

export const maxDuration = 30;

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

    const prompt = `Analiza esta imagen que contiene una nómina, lista de alumnos o planilla escolar.
Extrae la lista completa de todos los estudiantes (Nombre y Apellido).

Devuelve EXCLUSIVAMENTE un JSON válido (array de objetos) con la siguiente estructura:
[
  {
    "nombre": "Nombre de pila",
    "apellido": "Apellido",
    "dni": "DNI si figura (opcional)"
  }
]

Reglas:
1. Extrae todos los alumnos legibles.
2. Si figura "Apellido, Nombre" (ej. "García, Juan"), separa correctamente: apellido: "García", nombre: "Juan".
3. Formato Capital Case (ej. "López", "Mateo").
4. Omite números de orden (1., 2.), encabezados de página y firmas.
5. Devuelve ÚNICAMENTE el JSON crudo en un array [ ... ].`;

    // Modelos activos con thinkingLevel low para respuesta ultrarrápida (< 3 segundos)
    const modelos = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
    let jsonText = '';
    let ultimoError = '';

    for (const mod of modelos) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
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
                maxOutputTokens: 2048,
                thinkingConfig: {
                  thinkingLevel: 'low',
                },
              },
            }),
          }
        );

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (jsonText.trim()) break;
        } else {
          const errText = await res.text();
          ultimoError = `${mod} (${res.status}): ${errText.slice(0, 100)}`;
          console.warn(`Aviso Gemini API:`, ultimoError);
        }
      } catch (errMod: any) {
        ultimoError = errMod?.message || 'Timeout o error de conexión con Gemini';
        console.warn(`Fallo en modelo ${mod}:`, errMod?.message);
      }
    }

    if (!jsonText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se pudo leer la lista de la foto. Por favor asegúrate de que la foto esté bien enfocada e iluminada.',
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
    } catch {
      console.error('Error parseando JSON:', jsonFinal);
      return NextResponse.json(
        { success: false, error: 'No se pudo interpretar el formato devuelto por la IA. Intenta con otra foto.' },
        { status: 422 }
      );
    }

    if (!Array.isArray(parsedAlumnos) || parsedAlumnos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se detectaron alumnos en la foto. Intenta enfocar más de cerca la lista.' },
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
