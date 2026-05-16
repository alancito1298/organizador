'use client'

import React from "react"
import BottomNav from "../components/BottomNav"
import Horario from "../components/Horario"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

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