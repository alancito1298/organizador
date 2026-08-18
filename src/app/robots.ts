import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.organizadordocente.com';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/registro', '/login', '/planes', '/forgotpassword'],
      disallow: [
        '/home',
        '/menu-cursos',
        '/agenda',
        '/horario',
        '/planificaciones',
        '/perfil',
        '/sub-menu-curso/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
