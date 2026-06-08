"use client";

import Image from "next/image";
import { Book } from "lucide-react";
import Features from "./Features";
import Planes from "./PlanesPrecios";
import Header from "./Header";
import Footer from "./Footer";
import InfoDispotivos from "./InfoDispositivos";

export default function Inicio() {
 

 

   {/* 
  
  */}

const items = [
  {
   
    titulo: " ✔ Crear y gestionar cursos fácilmente ",
    descripcion: "Organizá todas tus materias en segundos, separando cursos, años y contenido sin complicaciones",
    icono: Book,
    imagen:"/cursos-img.jpeg"
  },
  {
    titulo: " ✔ Registrar asistencia y concepto en segundos ",
    descripcion: "Marcá el registro de tus clases con tan solo un click",
    icono: Book,
    imagen:"/asistencias-img.jpeg"
  },

  {
    titulo: "✔ Tener toda tu información en un solo lugar",
    descripcion: "Vas a tener todo en un solo lugar: Agenda, Planificaciones, Calificaciones, Horarios, Asistencia, Conceptos y Recordatorios",
    icono: Book,
    imagen:"/agenda-img.jpeg"
  },

  {
    titulo: "✔ Seguimiento organizado de calificaciónes",
    descripcion: "Agrega, ordena, consulta y edita calificaciónes facilmente",
    icono: Book,
    imagen:"/calificaciones-img.jpeg"
  },
  {
    titulo: "✔ Admistra tus alumnos con sencillez",
    descripcion: "Agrega, borra, consulta y edita estudiantes con un solo click",
    icono: Book,
    imagen:"/alumnos-img.jpeg"
  },
  {
    titulo: "✔ Seguimiento detallado de cada alumno",
    descripcion: "Vas a poder visualizar todas las estadísticas de cada alumno, para tener un seguimiento mas preciso",
    icono: Book,
    imagen:"/detalle-alumno-img.jpeg"
  },
];
  return (
    <body className="bg-white text-white flex flex-col items-center p-0 h-full">
      
     <Header></Header>

      <main className="w-full flex items-center flex-col">

        {/* HERO */}
        <section className=" w-full  mt-10">
          <div className="relative grid w-full bg-violet-950  lg:h-[32rem] place-items-center">
            <div className="flex flex-col items-center mx-auto text-center">
              <h1 className="text-4xl font-semibold text-white uppercase md:text-6xl">Organizador Docente</h1>
              <p className="mt-6 text-lg font-extralight font-mono  text-white">Diseñados por docentes.</p>
            </div>
            <div className=" flex justify-center uppercase font-sans gap-5 text-sm items-center h-20"> 
              <a href="/login" className=" border-violet-600 text-white border p-3 rounded-xl"> Iniciar Sesión</a>
              <a href="/registro"className="text-violet-600 bg-white p-3 border rounded-xl">Registrarme</a>              
            </div>

          </div>

          <svg className="fill-violet-950" viewBox="0 0 1440 57">
            <path d="M1440 0H0V57C720 0 1440 57 1440 57V0Z" />
          </svg>
        </section>

        {/* ABOUT */} 
        <section className="container flex flex-col items-center justify-center  px-6 py-8 mx-auto lg:py-16">
          <div className="lg:flex lg:items-center mt-30 px-6 py-8 lg:-mx-4">
            <div className="lg:w-1/2 lg:px-6">
              <h3 className="text-2xl mt-5 uppercase font-medium text-violet-950 font-sans  text-center md:text-2xl lg:text-3xl">
              Organizá tus clases sin perder tiempo
              </h3>

              <p className="m-6 text-gray-500">
              Gestioná cursos, alumnos, asistencia y notas desde un solo lugar.
Diseñado para docentes reales.
              </p> </div>
     

 
            

           

            <div className="mt-8 lg:w-1/2 lg:px-4 lg:mt-0">
              <Image
                className="object-cover w-full rounded-xl h-96 "
                src="/img-profe.jpg"
                alt="imagen joven profesora"
                width={1200}
                height={400}
              />
            </div>
          </div>
        </section>
        <h3 className="bg-violet-950 w-full text-center p-3 font-mono uppercase font-extralight text-6xl mt-20 mb-10">¿Cómo funciona?</h3>
        {/* FEATURES */}
        <Features items={items} />
        
        
        <section className="py-20 px-6  border-t lg:flex flex-col lg:items-center borde-4  mt-100">
  <div className="max-w-4xl mx-4 mt-25  m-auto">

    {/* Header */}
    <div className="flex items-center gap-3 mb-3 mt-25">
      <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-xs text-violet-500 uppercase tracking-widest font-medium">Exportación de datos</p>
    </div>

    <h2 className="text-4xl uppercase font-light text-violet-950 mb-4">
      Toda tu información lista para imprimir
    </h2>

    <p className="text-violet-600 text-lg leading-relaxed mb-10 max-w-2xl">
      Con un solo clic exportás cualquier sección a un archivo Excel (.xlsx) prolijo y ordenado.
      Ideal para archivar, compartir con directivos o imprimir al finalizar el trimestre.
    </p>

    {/* Feature cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
      {[
        { icon: '📋', title: 'Asistencias', desc: 'Planilla completa con estado de cada alumno por fecha y trimestre.' },
        { icon: '📊', title: 'Calificaciones', desc: 'Notas organizadas por tipo de evaluación y trimestre.' },
        { icon: '👥', title: 'Alumnos', desc: 'Listado completo del curso con datos de contacto.' },
      ].map((item) => (
        <div key={item.title} className="bg-white  w-full border-gray-200 rounded-xl p-5">
          <span className="text-2xl block mb-2">{item.icon}</span>
          <p className="text-xl uppercase text-gray-950 mb-1">{item.title}</p>
          <p className="text-sm text-violet-900 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
    <p className="text-violet-400 text-center mb-4">Se decargará una tabla similar con los datos correspondientes a cada curso </p>
    {/* Excel mockup */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
    
      {/* Toolbar */}
      <div className="bg-[#1D6F42] px-4 py-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-white text-sm font-medium">asistencias_curso_tecnologia.xlsx</span>
      </div>

      {/* Table */}
 
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#C6EFCE]">
              {['Apellido', 'Nombre', '12/04', '19/04', '26/04', '% asist.'].map((h) => (
                <th key={h} className="px-3 py-2 text-left border border-gray-300 text-[#1D6F42] font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { apellido: 'Alumno A', nombre: 'Nombre', d1: 'P', d2: 'P', d3: 'A', pct: '67%', c3: 'A' },
              { apellido: 'Alumno B', nombre: 'Nombre', d1: 'P', d2: 'P', d3: 'P', pct: '100%', c3: 'P' },
              { apellido: 'Alumno C', nombre: 'Nombre', d1: 'A', d2: 'J', d3: 'P', pct: '33%', c3: 'J' },
            ].map((row, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-3 py-2 border border-gray-200 text-gray-700">{row.apellido}</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-700">{row.nombre}</td>
                {[row.d1, row.d2, row.d3].map((d, i) => (
                  <td key={i} className={`px-3 py-2 border border-gray-200 text-center font-medium
                    ${d === 'P' ? 'bg-[#C6EFCE] text-[#1D6F42]' : ''}
                    ${d === 'A' ? 'bg-[#FFCCCC] text-[#9C0006]' : ''}
                    ${d === 'J' ? 'bg-[#FFF2CC] text-[#7D5A00]' : ''}
                  `}>{d}</td>
                ))}
                <td className="px-3 py-2 border border-gray-200 text-center text-gray-700">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* CTA */}
    <div className="flex items-center gap-4 flex-wrap">
      <a  href="/"   download="asitencias_Escuela_n°22_5_TIC.xlsx" className="flex items-center gap-2 bg-[#1D6F42] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-green-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Descargar planilla de ejemplo
      </a>
      <p className="text-xs text-gray-400">Compatible con Excel, Google Sheets y LibreOffice</p>
    </div>

  </div>
</section>
<span className="h-50 bg-white"></span>
<InfoDispotivos></InfoDispotivos>


<Planes></Planes>

      </main>

 <Footer></Footer>
    
    </body>
  );
}