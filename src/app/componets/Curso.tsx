export default function Curso() {
    return (<a href="/sub-menu-curso">
      <div className="flex w-fit bg-violet-200  text-violet-950 rounded-xl overflow-hidden shadow-md">
        <div className="flex items-center justify-center px-6 py-4 text-5xl font-bold">
          3°
        </div>
        <div className="w-1 bg-white my-4"></div>
        <div className="flex flex-col justify-center px-4 py-2 leading-tight">
          <p className="text-sm">Escuela N°91 "Nombre insti"s</p>
          
          <span className="text-xl font-bold italic tracking-wider">GEOGRAFÍA</span>
        </div>
      </div>
      </a> );
  }
  