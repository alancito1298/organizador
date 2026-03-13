'use client'

import React from "react"

import BottomNav from "../../../components/BottomNav"
import ListaAsistencias from "../../../components/ListaAsistencias"



export default function Asistencias() {
  return (
    <div className=" bg-fuchsia-200 h-full">
    
     <ListaAsistencias ></ListaAsistencias>
     <BottomNav></BottomNav>
    </div>
  );
}