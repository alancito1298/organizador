'use client'

import BottomNav from "../components/BottomNav"
import Navbar from "../components/Navbar"
import ListaPlanificaciones from "../components/ListaPlanificacion"
export default function Planifiaciones() {

    return(<>
    <Navbar titulo="Planificaciones" data="de curso"></Navbar>
    <ListaPlanificaciones></ListaPlanificaciones>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis nemo, suscipit ab hic cum quod quas vero deserunt omnis repellat iusto molestiae iste nesciunt nam quae fugiat id provident itaque?</p>   
    <BottomNav></BottomNav>
    
    </>)

}