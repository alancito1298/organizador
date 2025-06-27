type Props = {
    titulo: string;

    ruta: string;
  };
  
  export default function ItemMenu({ titulo, ruta }: Props) {
    return (
      <a href={ruta} className="flex flex-col items-center justify-start">
        <div className="flex w-4/5 text-center justify-center item-center h-20 bg-violet-900 text-violet-200 font-light text-3xl mt-5  p-auto rounded-xl overflow-hidden shadow-md p-2">
          <h4 className=" block text-center m-auto ">{titulo}</h4>
      
        </div>
 
      </a>
    );
  }
  