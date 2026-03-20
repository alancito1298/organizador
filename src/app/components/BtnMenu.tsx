import Link from 'next/link';

type Props = {
  ruta: string;
  icono: React.ReactNode;
  nombre: string;
};


export default function BtnMenu({ ruta, icono, nombre }: Props) {
  return (
    <div >
      <Link
        href={ruta}
        className="flex flex-col items-center justify-center gap-4 w-auto bg-violet-600 p-8 h-auto border-violet-700 border-1 text-amber-100 hover:text-violet-900 transition   max-w-96 40"
      >
        <span className="text-8xl ">{icono}</span>
        <span className="text-lg font-medium uppercase">{nombre}</span>
      </Link>
    </div>
  );
}
