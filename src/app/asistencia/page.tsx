'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"
import ListaAsistencias from "../componets/ListaAsistencias"
import Referencias from "../componets/referencias"


export default function Asistencias() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"Asistencias"} data={"3° Matematica Esc. n°22"}></Navbar>
     <Referencias></Referencias>
     <ListaAsistencias ></ListaAsistencias>
     <BottomNav></BottomNav>
    </div>
  );
}