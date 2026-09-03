type Props = {
  texto?: string;
};

export default function Cargando({ texto = 'Cargando...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-16 px-4 bg-surface-bg font-mulish antialiased">
      {/* Contenedor circular neumórfico con spinner genérico moderno */}
      <div className="w-16 h-16 neu-inset rounded-2xl flex items-center justify-center mb-4">
        <div className="w-8 h-8 border-3 border-accent-violet/20 border-t-accent-violet rounded-full animate-spin"></div>
      </div>

      <p className="text-accent-violet font-extrabold text-xs uppercase tracking-widest text-center animate-pulse">
        {texto}
      </p>
    </div>
  );
}