
import BottomNav from "./componets/BottomNav";
import Curso from "./componets/Curso";
import Navbar from "./componets/Navbar";

export default function Home() {
  return (
    
    <div className="grid bg-violet-500 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar titulo={"BIENVENIDO"} data={"INCIO"}></Navbar>
      
        
        <h3>Bienvenido</h3>
<BottomNav></BottomNav>
    </div>
  );
}
