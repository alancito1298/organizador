'use client'

import React from "react"
import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"
import Horario from "../components/Horario"


export default function Horarios() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Navbar titulo={"Tus"} data={"Horarios"}></Navbar>
     <Horario></Horario>
     <BottomNav></BottomNav>
    </div>
  );
}