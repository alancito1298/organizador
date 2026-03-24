'use client'

import React from "react"
import BottomNav from "../components/BottomNav"
import Horario from "../components/Horario"


export default function Horarios() {
  return (
    <div className=" bg-fuchsia-200 h-full">
     <Horario></Horario>
     <BottomNav></BottomNav>
    </div>
  );
}