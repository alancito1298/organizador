'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"

import ItemCurso from "../componets/ItemCurso"



export default function subMenuCurso() {
  return (
    <div className=" bg-fuchsia-200 h-full  pb-64">
     <Navbar titulo="Curso" data="Menu"></Navbar>
 <ItemCurso titulo="ASITENCIAS" ruta="/asistencia"></ItemCurso>
 <ItemCurso titulo="CALIFIACIONES" ruta="/calificaciones"></ItemCurso>
 <ItemCurso titulo="PLANIFICACIONES" ruta="/"></ItemCurso>
 <ItemCurso titulo="BIBLIOGRAFIA" ruta="/"></ItemCurso>
 <ItemCurso titulo="AGENDA" ruta="/agenda"></ItemCurso>
 <ItemCurso titulo="ASITENCIAS" ruta="/asistencia"></ItemCurso>
     <BottomNav></BottomNav>
    </div>
  );
}