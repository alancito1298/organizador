
type Props = {
    titulo: string;
    ruta: string;
  };
  
  export default function ItemCurso({ titulo, ruta }: Props) {
    return (
     <div className=" w-full flex flex-col items-center justify-center">
       <a href={ruta} className="w-full flex flex-col items-center justify-center h-18 gap-6 m-4 max-w-96 bg-violet-900 text-violet-200 rounded-xl text-3xl font-light  overflow-hidden shadow-md p-2"  >

          <h4>{titulo}</h4>

      </a></div>
    );
  }
  