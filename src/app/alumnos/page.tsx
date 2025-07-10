'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"
import ListaAlumnos from "../componets/ListaAlumnos";



export default function Asistencias() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"aaa"} data={"aaa"}></Navbar>
     <ListaAlumnos></ListaAlumnos>
     <BottomNav></BottomNav>
    </div>
  );
}