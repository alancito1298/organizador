'use client'

import React from "react"

import BottomNav from "../../../components/BottomNav"

import ListaCalificaciones from "../../../components/ListaCalficaciones"


export default function Calificaciones() {
  return (
    <div className=" bg-fuchsia-200 h-full">
  
     <ListaCalificaciones></ListaCalificaciones>
     <BottomNav></BottomNav>
    </div>
  );
}