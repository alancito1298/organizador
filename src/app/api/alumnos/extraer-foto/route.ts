import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No se envió ninguna imagen.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Servicio de IA temporalmente no disponible.' }, { status: 503 });
    }

    // Limpiar string base64 si incluye encabezado data URI
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const cleanMime = mimeType || 'image/jpeg';

    const prompt = `Analiza detalladamente esta imagen de una nómina, lista escolar, cuaderno o planilla de alumnos.
Tu tarea es extraer a cada uno de los estudiantes de la lista con su Nombre y Apellido.
Devuelve EXCLUSIVAMENTE un array JSON válido, sin bloques de código markdown, sin explicaciones ni introducciones.

Estructura obligatoria del JSON:
[
  {
    "nombre": "Nombre de pila del alumno",
    "apellido": "Apellido del alumno",
    "dni": "DNI si figura en la foto, o dejar vacío"
  }
]

Reglas estrictas de extracción:
1. Extrae todos los alumnos que aparezcan legibles en la imagen.
2. Separa con exactitud Nombre y Apellido. Si en la lista figura "Apellido, Nombre", asígnalos al campo correspondiente.
3. Pon la primera letra en mayúscula y las demás en minúscula (Capital Case, ej: "García", "Santiago").
4. Omite números de orden de la lista (1., 2., etc.), encabezados ("Nómina", "Asistencia", "Firma", etc.) o notas al margen.
5. Devuelve ÚNICAMENTE el array JSON crudo, empezando con [ y terminando con ].`;

    const modelos = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let jsonText = '';

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
          console.warn(`Aviso: Modelo ${mod} respondió con código ${res.status}:`, errText);
        }
      } catch (errMod) {
        console.warn(`Error llamando a modelo ${mod}:`, errMod);
      }
    }

    if (!jsonText.trim()) {
      return NextResponse.json(
        { error: 'No se pudo leer la lista de la foto. Asegúrate de que esté bien iluminada y nítida.' },
        { status: 422 }
      );
    }

    // Limpiar posibles etiquetas de markdown
    const cleaned = jsonText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    const jsonFinal = jsonMatch ? jsonMatch[0] : cleaned;

    const parsedAlumnos = JSON.parse(jsonFinal);

    if (!Array.isArray(parsedAlumnos) || parsedAlumnos.length === 0) {
      return NextResponse.json(
        { error: 'No se detectaron nombres de alumnos en la fotografía.' },
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
      { error: err?.message || 'Error al procesar la imagen de alumnos.' },
      { status: 500 }
    );
  }
}
