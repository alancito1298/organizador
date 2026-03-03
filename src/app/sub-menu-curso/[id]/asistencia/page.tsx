'use client'

import React from "react"
import Navbar from "../../../components/Navbar"
import BottomNav from "../../../components/BottomNav"
import ListaAsistencias from "../../../components/ListaAsistencias"
import Referencias from "../../../components/referencias"


export default function Asistencias() {
  return (
    <div className=" bg-fuchsia-200 h-full">
    
     <ListaAsistencias ></ListaAsistencias>
     <BottomNav></BottomNav>
    </div>
  );
}