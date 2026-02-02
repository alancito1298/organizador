'use client'

import BottomNav from "../components/BottomNav"
import Navbar from "../components/Navbar"
import ListaPlanificaciones from "../components/ListaPlanificacion"
export default function Planifiaciones() {

    return(<>
    <Navbar titulo="Planificaciones" data="de curso"></Navbar>
    <ListaPlanificaciones></ListaPlanificaciones>
    
    <BottomNav></BottomNav>
    
    </>)

}