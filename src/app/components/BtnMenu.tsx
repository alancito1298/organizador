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
        className="flex flex-col items-center justify-center rounded-2xl gap-4 w-30 bg-white p-8 h-30 border-violet-700 border-1 text-amber-100 hover:text-violet-900 transition   max-w-96 40"
      >
        <span className="text-8xl bg-violet-100 p-2 rounded-2xl text-violet-900 ">{icono}</span>
        <span className="text-sm font-poppins font text-violet-900">{nombre}</span>
      </Link>
    </div>
  );
}
