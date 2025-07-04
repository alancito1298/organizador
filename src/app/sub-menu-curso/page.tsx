'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"

import ItemsCurso from "../componets/ItemsCurso"



export default function subMenuCurso() {
  return (
    <div className=" bg-fuchsia-200 h-full  pb-64">
     <Navbar titulo="Curso" data="Menu"></Navbar>
 <ItemsCurso titulo="ASITENCIAS" ruta="/asistencia"></ItemsCurso>
 <ItemsCurso titulo="CALIFIACIONES" ruta="/calificaciones"></ItemsCurso>
 <ItemsCurso titulo="PLANIFICACIONES" ruta="/"></ItemsCurso>
 <ItemsCurso titulo="BIBLIOGRAFIA" ruta="/"></ItemsCurso>
 <ItemsCurso titulo="AGENDA" ruta="/agenda"></ItemsCurso>
 <ItemsCurso titulo="ASITENCIAS" ruta="/asistencia"></ItemsCurso>
     <BottomNav></BottomNav>
    </div>
  );
}