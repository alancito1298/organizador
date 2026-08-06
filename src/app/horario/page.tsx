'use client'

import React from "react"
import BottomNav from "../components/shared/BottomNav"
import Horario from "../components/horario/Horario"
import Footer from "../components/shared/Footer"
import Navbar from "../components/shared/Navbar"

export default function Horarios() {
  return (
    <div >
    <Navbar></Navbar>
     <Horario></Horario>
     <BottomNav></BottomNav>
     <Footer></Footer>
    </div>
  );
}