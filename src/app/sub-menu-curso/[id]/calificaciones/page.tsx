'use client'

import React from "react"
import Navbar from "../../../components/Navbar"
import BottomNav from "../../../components/BottomNav"

import ListaCalificaciones from "../../../components/ListaCalficaciones"


export default function Calificaciones() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"Calificaciones"} data={"6to Año E.E.T n°79"}></Navbar>
     <ListaCalificaciones></ListaCalificaciones>
     <BottomNav></BottomNav>
    </div>
  );
}