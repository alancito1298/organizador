
import BottomNav from "./components/BottomNav";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    
    <div className="grid bg-violet-500 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <Navbar titulo={"BIENVENIDO"} data={"INCIO"}></Navbar>
      
<div>
        <a href="/menu-cursos" className="font-bebas text-violet-950 m-4 bg-amber-300 rounded-xl p-2 flex justify-center align-center">Ir a Cursos</a> 
        <p className="p-5 font-bebas">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis nemo, suscipit ab hic cum quod quas vero deserunt omnis repellat iusto molestiae iste nesciunt nam quae fugiat id provident itaque?</p>   
</div>


<BottomNav></BottomNav>
    </div>
  );
}
