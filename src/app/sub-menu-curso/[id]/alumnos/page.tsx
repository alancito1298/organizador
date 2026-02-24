'use client'

import React from "react"
import Navbar from "../../../components/Navbar"
import BottomNav from "../../../components/BottomNav"
import ListaAlumnos from "../../../components/ListaAlumnos";



export default function Asistencias() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"Materia"} data={"1°"}></Navbar>
     <ListaAlumnos></ListaAlumnos>
     <BottomNav></BottomNav>
    </div>
  );
}