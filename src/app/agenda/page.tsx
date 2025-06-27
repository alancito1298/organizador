'use client'

import React from "react"
import Navbar from "../componets/Navbar"
import BottomNav from "../componets/BottomNav"
import Agenda from "../componets/Agenda"


export default function agenda() {
  return (
    <div className=" bg-violet-600 h-full">
     <Navbar titulo="Agenda" data=""></Navbar>
    <Agenda></Agenda>
     <BottomNav></BottomNav>
    </div>
  );
}