import { MetadataRoute } from "next";

const SITE_URL = "https://www.organizadordocente.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/registro", "/forgotpassword", "/planes"],
      disallow: [
        "/home",
        "/menu-cursos",
        "/sub-menu-curso",
        "/horario",
        "/agenda",
        "/planificaciones",
        "/perfil",
        "/reset-password",
        "/test",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
