import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se envió ningún archivo para subir.' },
        { status: 400 }
      );
    }

    // Validar extensión
    const extension = path.extname(file.name).toLowerCase();
    const extensionesPermitidas = ['.pdf', '.docx', '.doc', '.odt', '.txt', '.rtf'];
    if (!extensionesPermitidas.includes(extension)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Solo se aceptan archivos PDF o DOCX / DOC.' },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (25 MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo permitido (25 MB).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio public/uploads si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Sanitizar nombre de archivo
    const timestamp = Date.now();
    const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${timestamp}_${baseName}${extension}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Determinar la URL absoluta
    const hostHeader = req.headers.get('host') || 'localhost:3001';
    let host = hostHeader;
    if (host.startsWith('localhost')) {
      host = host.replace('localhost', '127.0.0.1');
    }
    const protocol = host.includes('127.0.0.1') ? 'http' : 'https';
    const publicUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      relativeUrl: `/uploads/${filename}`,
      filename,
      originalName: file.name,
      size: file.size,
      extension,
    });
  } catch (err: any) {
    console.error('Error al subir archivo:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el archivo.' },
      { status: 500 }
    );
  }
}
