'use client';

import Navbar from "../components/shared/Navbar";
import BottomNav from "../components/shared/BottomNav";
import PerfilDocente from "../components/perfil/PerfilDocente";

export default function Planificaciones() {
  return (
    <>
      <Navbar/>
        <PerfilDocente></PerfilDocente>
      <BottomNav />
    </>
  );
}



