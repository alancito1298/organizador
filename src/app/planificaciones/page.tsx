'use client'

import BottomNav from "../componets/BottomNav"
import Navbar from "../componets/Navbar"
import ListaPlanificaciones from "../componets/ListaPlanificacion"
export default function Planifiaciones() {

    return(<>
    <Navbar titulo="Planificaciones" data="de curso"></Navbar>
    <ListaPlanificaciones></ListaPlanificaciones>
    <BottomNav></BottomNav>
    
    </>)

}