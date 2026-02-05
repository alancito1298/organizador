
type Props = {
    titulo: string;
    ruta: string;
  };
  
  export default function ItemCurso({ titulo, ruta }: Props) {
    return (
     <div className=" w-full flex flex-col items-center justify-center">
       <a href={ruta} className=" flex flex-col items-center justify-center h-18 gap-6 m-4 w-6/7 bg-violet-400 text-violet-900  text-3xl font-light  overflow-hidden shadow-md p-2"  >

          <h4 className="font-atma">{titulo}</h4>

      </a></div>
    );
  }
  