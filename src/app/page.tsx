
import BottomNav from "./components/BottomNav";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    
    <div className="grid bg-violet-500 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <Navbar titulo={"BIENVENIDO"} data={"INCIO"}></Navbar>
      
<div>
        <a href="/menu-cursos" className="font-bebas text-violet-950 m-4 bg-amber-300 rounded-xl p-2 flex justify-center align-center">Ir a Cursos</a> 
        <p className="p-5 font-bebas">Esta web sirve para que los docentes puedan organizar y gestionar toda su actividad educativa en un solo lugar.

Permite llevar un control ordenado de cursos, alumnos, asistencias, calificaciones y agenda, evitando el uso de cuadernos, planillas en papel o archivos dispersos. Cada docente accede con su cuenta y gestiona únicamente su propia información, de forma segura y desde cualquier dispositivo.

El objetivo principal es simplificar la tarea diaria del docente, ahorrar tiempo administrativo y facilitar el seguimiento del trabajo pedagógico a lo largo del ciclo lectivo.</p>   
</div>


<BottomNav></BottomNav>
    </div>
  );
}
