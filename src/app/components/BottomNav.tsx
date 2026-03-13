
"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import {
  Home,
  BookUser,
  Bell,
  CalendarDays
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
      <div className="max-w-md mx-auto flex justify-around items-center gap-1 h-16">
     
        <Link href="/menu-cursos" className="text-violet-100 flex flex-col justify-center items-center hover:text-blue-600">
        <BookUser size={30} />
        <small className="text-xs font-extralight">CURSOS</small>
        </Link>
        <button
        onClick={() => router.back()}
        className="flex items-center gap-2  text-amber-300 hover:bg-violet-800 rounded"
      >
        <ArrowLeft size={35} />
      </button>
        <Link href="/" className="text-amber-300 hover:text-blue-600">
          <Home size={40} />
        </Link>
        <Link href="/" className="text-amber-300 hover:text-blue-600"> <Bell size={32} /></Link>
        <Link href="/agenda" className="text-violet-100 flex flex-col justify-center items-center hover:text-blue-600">
        <CalendarDays size={30} />   <small className="text-xs font-extralight">AGENDA</small>
        </Link>
     
      </div>
    </nav>
  );
};

export default BottomNav;
