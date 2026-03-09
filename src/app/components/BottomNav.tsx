
"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import {
  Home,
  Search,
  PlusCircle,
  Bell,
  User,
  BookUser
  
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
        <Link href="/menu-cursos" className="text-amber-300 hover:text-blue-600">
        <BookUser size={30} />
        </Link>
        <Link href="/menu-cursos" className="text-amber-300 hover:text-blue-600">
          <Home size={30} />
        </Link>
      
        <Link href="/agenda" className="text-amber-300 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-journal-plus" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
