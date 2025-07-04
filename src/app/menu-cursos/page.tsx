import BottomNav from "@/app/componets/BottomNav";
import Navbar from "@/app/componets/Navbar";
import ListaCursos from "@/app/componets/Curso";

  export default function MenuCursos() {
    return (
      <><Navbar titulo="Tus" data="Cursos"></Navbar><ListaCursos></ListaCursos><BottomNav></BottomNav></>
    );
  }
  