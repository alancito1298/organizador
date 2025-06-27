// components/Navbar.tsx
"use client"; // Solo si estás usando App Router

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Instalar con: npm install lucide-react

type Props = {
  titulo: string;
  data: string;
};
const Navbar = ({ titulo, data }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-violet-900 border-b w-full mb-4 p-0  shadow-md">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 text-xl  text-violet-300">
           <p className="text-violet-200">{titulo}</p>
           <strong className="text-amber-300 font-light text-sm">{data}</strong>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Inicio</Link>
            <Link href="/cursos" className="text-gray-700 hover:text-blue-600">Cursos</Link>
            <Link href="/usuarios" className="text-gray-700 hover:text-blue-600">Usuarios</Link>
            <Link href="/perfil" className="text-gray-700 hover:text-blue-600">Perfil</Link>
          </div>

          {/* Botón hamburguesa */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-gray-700">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-blue-600">Inicio</Link>
          <Link href="/cursos" className="block text-gray-700 hover:text-blue-600">Cursos</Link>
          <Link href="/usuarios" className="block text-gray-700 hover:text-blue-600">Agenda</Link>
          <Link href="/perfil" className="block text-gray-700 hover:text-blue-600">Salir</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;