
import BottomNav from "./componets/BottomNav";

import Navbar from "./componets/Navbar";

export default function Home() {
  return (
    
    <div className="grid bg-violet-500 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar titulo={"BIENVENIDO"} data={"INCIO"}></Navbar>
      
<div>
        <a href="/menu-cursos" className="text-violet-950 m-4 bg-amber-300 rounded-xl p-2">Ir a Cursos</a> <br />
   
</div>
<a href="/menu-cursos" className="text-violet-950 m-4 bg-amber-300 rounded-xl p-2">Ver Alumnos</a>
<BottomNav></BottomNav>
    </div>
  );
}
