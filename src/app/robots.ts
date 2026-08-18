import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.organizadordocente.com';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/registro', '/login', '/planes', '/recuperar', '/forgotpassword'],
      disallow: [
        '/home',
        '/cursos',
        '/menu-cursos',
        '/agenda',
        '/horario',
        '/planificaciones',
        '/perfil',
        '/curso/',
        '/sub-menu-curso/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
