import BottomNav from "@/app/components/BottomNav";
import Navbar from "@/app/components/Navbar";
import ListaCursos from "@/app/components/Cursos";

  export default function MenuCursos() {
    return (
      <><Navbar titulo="Tus Cursos" data=""></Navbar>
        <ListaCursos></ListaCursos>
      <BottomNav></BottomNav>
      </>
    );
  }
  