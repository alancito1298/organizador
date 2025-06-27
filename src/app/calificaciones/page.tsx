'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"

import ListaCalificaciones from "../componets/ListaCalficaciones"


export default function Calificaciones() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"aa"} data={"aa"}></Navbar>
     <ListaCalificaciones></ListaCalificaciones>
     <BottomNav></BottomNav>
    </div>
  );
}