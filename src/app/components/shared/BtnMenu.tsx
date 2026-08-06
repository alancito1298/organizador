import Link from 'next/link';

type Props = {
  ruta: string;

  icono: React.ReactNode;

  nombre: string;

  descripcion?: string;

  colorIcono?: string;

  bgIcono?: string;

  destacado?: boolean;
};

export default function BtnMenu({
  ruta,
  icono,
  nombre,
  descripcion,
  colorIcono = 'text-violet-900',
  bgIcono = 'bg-violet-100',
  destacado = false,
}: Props) {

  return (

    <div className="w-auto">

      <Link
        href={ruta}
        className={`
        group
        flex
        flex-col
        items-center
        gap-5
        rounded-3xl
        p-5
        min-h-20
        border
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-xl
        border-violet-950
        h-auto
        w-full
        
     
        ${
          destacado
            ? `
            bg-violet-900
            border-violet-800
            text-white
            `
            : `
            bg-white
            border-violet-100
            hover:border-violet-300
            `
        }
        `}
      >

        {/* ICONO */}
        <div
          className={`
          min-h-20
          min-w-20
          rounded-3xl
          flex
          items-center
          justify-center
          text-5xl
          shadow-sm
          transition-all
          group-hover:scale-110
          border
         
          text-violet-950
          ${
            destacado
              ? 'bg-yellow-400 text-violet-950'
              : `${bgIcono} ${colorIcono}`
          }
          `}
        >
          {icono}
        </div>

        {/* TEXTO */}
        <div className="flex flex-col">

          <span
            className={`
            text-lg
            font-poppins
        
            tracking-wide
            
            ${
              destacado
                ? 'text-white'
                : 'text-violet-950'
            }
            `}
          >
            {nombre}
          </span>

          {descripcion && (
            <span
              className={`
              text-sm
              mt-1
              
              ${
                destacado
                  ? 'text-violet-200'
                  : 'text-violet-400'
              }
              `}
            >
              {descripcion}
            </span>
          )}

        </div>

      </Link>

    </div>
  );
}