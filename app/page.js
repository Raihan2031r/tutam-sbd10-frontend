"use client";

import Image from "next/image";
import Navbar from "./components/navbar";
import { useState, useEffect, useRef } from "react";
import CardList from "./components/cardList";

export default function Home() {
  const [isTransparent, setIsTransparent] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsTransparent(heroBottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans">
      <nav className="fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out">
        <Navbar transparent={isTransparent} />
      </nav>

      <div ref={heroRef} className="static mt-27 top-0 bg-black w-full flex items-center justify-center">
        <Image
          src="/hero.png"
          alt="Hero Image"
          width={300}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>

      <main className="flex flex-col items-center min-h-screen">
        <div className="w-full h-full flex flex-col pb-10 items-center justify-center shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-800 mt-10">Welcome to Our Website</h1>
          <p className="text-lg text-gray-600 mt-1">Discover the amazing world of anime!</p>
        </div>
        <div className="w-screen bg-gray-300/55 min-h-screen">
          <CardList />
        </div>
      </main>
    </div>
  );
}