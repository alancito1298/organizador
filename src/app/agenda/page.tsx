'use client'

import React from "react"
import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"
import Agenda from "../components/Agenda"


export default function agenda() {
  return (
    <div className=" bg-violet-600 h-full">
     <Navbar titulo="Agenda" data="2025"></Navbar>
    <Agenda></Agenda>
     <BottomNav></BottomNav>
    </div>
  );
}