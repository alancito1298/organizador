'use client'

import React from "react"
import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"

import ItemsCurso from "../components/ItemsCurso"



export default function subMenuCurso() {
  return (
    <div className=" bg-fuchsia-200 h-full  pb-64">
     <Navbar titulo="Curso" data="Menu"></Navbar>
 <ItemsCurso titulo="ASITENCIAS" ruta="/asistencia"></ItemsCurso>
 <ItemsCurso titulo="CALIFIACIONES" ruta="/calificaciones"></ItemsCurso>
 <ItemsCurso titulo="PLANIFICACIONES" ruta="/planificaciones"></ItemsCurso>
 <ItemsCurso titulo="BIBLIOGRAFIA" ruta="/"></ItemsCurso>
 <ItemsCurso titulo="AGENDA" ruta="/agenda"></ItemsCurso>
 <ItemsCurso titulo="HORARIOS" ruta="/horario"></ItemsCurso>
 <ItemsCurso titulo="ALUMNOS" ruta="/alumnos"></ItemsCurso>
     <BottomNav></BottomNav>
    </div>
  );
}