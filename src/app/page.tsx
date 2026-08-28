import type { Metadata } from "next";
import Inicio from "./components/landing/Inicio";

export const metadata: Metadata = {
  title: "Planificaciones, agenda y gestión de cursos para docentes",
  description:
    "Organizá tu agenda docente, tus planificaciones de clase, cursos, asistencia y calificaciones en un solo lugar. Exportá todo a Excel con un click. Empezá gratis.",
  alternates: {
    canonical: "/",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Organizador Docente",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "App para docentes: agenda y planificaciones de clase, gestión de cursos, asistencia y calificaciones en un solo lugar.",
  url: "https://www.organizadordocente.com",
  offers: {
    "@type": "Offer",
    price: "3999",
    priceCurrency: "ARS",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Organizador Docente",
  image: "https://www.organizadordocente.com/agenda-img.jpeg",
  logo: "https://www.organizadordocente.com/odicono.svg",
  "@id": "https://www.organizadordocente.com/#organization",
  url: "https://www.organizadordocente.com",
  description: "Plataforma web de gestión pedagógica y organización escolar para docentes en Argentina y Latinoamérica.",
  priceRange: "Free - $4999 ARS",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [
    "https://www.instagram.com/organizadordocente",
    "https://www.facebook.com/organizadordocente",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿El Plan Gratis vence en algún momento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. El Plan Gratis es 100% gratuito para siempre. Te permite gestionar hasta 4 cursos con lista de alumnos, tomar asistencias, cargar calificaciones y llevar tu agenda sin ingresar ninguna tarjeta de crédito.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo exportar mis planillas de asistencia y notas a Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El Plan Plus cuenta con la función de exportación e importación directa a planillas formato Excel (.xlsx) con un solo clic, listas para entregar a secretaría o dirección escolar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se procesan los cobros de las suscripciones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Todos los pagos se procesan con la máxima seguridad mediante Mercado Pago. Podés suscribirte de manera mensual o anual utilizando tarjeta de débito, crédito o dinero en tu cuenta de Mercado Pago.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo usar la aplicación si en mi escuela no hay internet o tengo mala señal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Organizador Docente cuenta con Modo Offline en el aula. Podés tomar asistencia y registrar notas dentro de la clase sin conexión. En cuanto tu dispositivo recupere conexión Wi-Fi o datos móviles, la app sincronizará los cambios automáticamente en la nube.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tengo que descargar una aplicación desde Google Play o App Store?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hace falta instalar nada pesado. Organizador Docente es una Progressive Web App (PWA) moderna accesible desde cualquier celular (Android o iPhone), tablet o computadora. Además, podés agregar un acceso rápido a tu pantalla de inicio en 1 segundo y funciona offline.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué incluye el Plan Plus a diferencia del Plan Gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El Plan Gratis te permite gestionar hasta 4 cursos completos con asistencia, calificaciones y agenda. El Plan Plus desbloquea cursos ilimitados, exportación e importación de notas a Excel, módulo de planificaciones anuales, bibliografía pedagógica y cero publicidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Mis datos e información de los alumnos están seguros?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutamente. Toda la información de tus cursos, planificaciones y calificaciones se almacena de forma encriptada en la nube con copias de seguridad continuas y acceso exclusivo desde tu cuenta.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Inicio />
    </>
  );
}
