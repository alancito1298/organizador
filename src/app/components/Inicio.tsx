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
    descripcion: "Organizá todas tus materias en seggundos, separando cursos, años y contenido sin complicaciones",
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
              <a href="/login" className=" border-violet-600 border p-3 rounded-xl"> Iniciar Sesión</a>
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
        <h3 className="bg-violet-950 w-full text-center p-3 font-mono uppercase font-extralight text-5xl mt-20 mb-10">¿Cómo funciona?</h3>
        {/* FEATURES */}
        <Features items={items} />

<span className="h-50 bg-white"></span>
<InfoDispotivos></InfoDispotivos>


<Planes></Planes>

      </main>

 <Footer></Footer>
    
    </body>
  );
}