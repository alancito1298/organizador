'use client';

import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import PerfilDocente from "../components/PerfilDocente";

export default function Planificaciones() {
  return (
    <>
      <Navbar/>
        <PerfilDocente></PerfilDocente>
      <BottomNav />
    </>
  );
}