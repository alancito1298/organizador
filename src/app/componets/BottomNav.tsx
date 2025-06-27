
"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import {
  Home,
  Search,
  PlusCircle,
  Bell,
  User
} from "lucide-react";
import { ArrowLeft } from 'lucide-react';

const BottomNav = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false); // scroll hacia abajo
      } else {
        setVisible(true); // scroll hacia arriba
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-violet-900  shadow-sm transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 p-2 text-amber-300 hover:bg-violet-800 rounded"
      >
        <ArrowLeft size={28} />
      </button>
        <Link href="/buscar" className="text-amber-300 hover:text-blue-600">
          <Search size={24} />
        </Link>
        <Link href="/crear" className="text-amber-300 hover:text-blue-600">
          <PlusCircle size={36} />
        </Link>
        <Link href="/notificaciones" className="text-amber-300 hover:text-blue-600">
          <Bell size={24} />
        </Link>
        <Link href="/perfil" className="text-amber-300 hover:text-blue-600">
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
