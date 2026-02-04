'use client'

import React from "react"
import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"

import ItemsCurso from "../components/ItemsCurso"



export default function subMenuCurso() {
  return (
    <div className=" bg-fuchsia-200 h-220">
     <Navbar titulo="Curso" data="Menu"></Navbar>
 <div className="mt-4 mb-8">
  <ItemsCurso titulo="Asitencias" ruta="/asistencia"></ItemsCurso>
    <ItemsCurso titulo="Calificaciones" ruta="/calificaciones"></ItemsCurso>
      <ItemsCurso titulo="Planificaciones" ruta="/planificaciones"></ItemsCurso>
        <ItemsCurso titulo="Bibliografia" ruta="/"></ItemsCurso>
          <ItemsCurso titulo="Agenda" ruta="/agenda"></ItemsCurso>
            <ItemsCurso titulo="Horarios" ruta="/horario"></ItemsCurso>
              <ItemsCurso titulo="Alumnos" ruta="/alumnos"></ItemsCurso>
 </div>
     <BottomNav></BottomNav>
    </div>
  );
}