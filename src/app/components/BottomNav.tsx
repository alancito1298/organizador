
"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import {
  Home,
 
  Bell,
  
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
      className={`fixed  bottom-0 left-0 right-0 z-50 bg-none  border-t border-violet-950 shadow-xl bg-white/90 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      } md:translate-y-0`}
    >
      <div className="max-w-md mx-auto flex justify-center items-center gap-10 h-16">
     
       
        <button
        onClick={() => router.back()}
        className="text-violet-950 rounded-2xl border-2 bg-violet-100 p-1"
      >
        <ArrowLeft size={35} />
      </button>
        <Link href="/home" className="text-violet-950 rounded-2xl border-2 bg-violet-100 p-1">
          <Home size={40} />
        </Link>
        <Link href="/home" className="text-violet-950 rounded-2xl border-2 bg-violet-100 p-1"> <Bell size={32} /></Link>
        
     
      </div>
    </nav>
  );
};

export default BottomNav;
