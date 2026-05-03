"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "../lib/axios";

export default function Navbar({ transparent = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [searchError, setSearchError] = useState("");
    
    const id = typeof window !== "undefined" ? localStorage.getItem("id") : null;
    const [loggedIn, setLoggedIn] = useState(() => {
        if (typeof window === "undefined") return false;        
        return !!localStorage.getItem("token");
    });

    useEffect(() => {
        setLoggedIn(!!localStorage.getItem("token"));
        const handleStorage = () => {
            setLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);
    
    const handleSearch = async (e) => {
        if (e.key !== "Enter") return;
        if (!title.trim()) return;

        try {
            setSearchError("");
            const response = await api.get(`/animes/search?title=${title.trim()}`);
            window.location.href = `/animes/${response.data.payload[0].id}`;
        } catch (error) {
            if (error.response?.status === 404) {
                setSearchError("Item tidak ditemukan");
            } else {
                setSearchError("Terjadi kesalahan");
            }
        }
    };

    return (
        <nav className={`relative flex flex-col justify-between items-center w-screen bg-gray-200 ${transparent ? 'bg-transparent backdrop-blur-md' : 'border-b-4 border-gray-500'}`}>
            {!menuOpen && (
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="pl-4">
                        <Link href="/" className={`font-bold text-xl py-7 px-4 flex text-gray-600 transition-colors duration-300 justify-center items-center`}>
                            <Image src="/logo.png" alt="Logo" width={50} height={50} className="inline-block mr-2 rounded-2xl" />
                            <span className={`text-3xl font-extralight pr-2.5 text-gray-600`}>|</span>
                            ShiroNime
                        </Link>
                    </div>

                    <div className={`${transparent ? 'hidden' : 'relative'}`}>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search Anime..."
                            className="placeholder:text-center hidden sm:inline-block border-2 bg-gray-300 border-gray-200 rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
                        />
                        {searchError && (
                            <p className="absolute top-full mt-1 left-0 text-red-500 text-xs whitespace-nowrap">
                                {searchError}
                            </p>
                        )}
                    </div>

                    <div className="hidden md:flex flex-row text-lg font-semibold mr-4">
                        <Link href="/subscriptions" className="group text-gray-600 hover:text-white py-7 px-4 rounded-2xl hover:bg-gray-500/60 transition-colors duration-500">
                            Subscription
                        </Link>
                        <Link href="/animes" className="group text-gray-600 hover:text-white py-7 px-4 rounded-2xl hover:bg-gray-500/60 transition-colors duration-500">
                            Anime
                        </Link>
                        {loggedIn ? (
                            <Link href={`/users/${id}`} className="group text-white py-7 px-4 hover:bg-gray-500/60 transition-colors duration-500 rounded-2xl">
                                <Image src="/profile.png" alt="Profile Icon" width={25} height={25} className="group-hover:invert not-hover:opacity-70 inline-block" />
                            </Link>
                        ) : (
                            <Link href="/login" className="group text-white py-7 px-4 hover:bg-gray-500/60 transition-colors duration-500 pr-7 rounded-2xl">
                                <Image src="/login.png" alt="Login Icon" width={25} height={25} className="group-hover:invert not-hover:opacity-70 inline-block" />
                            </Link>
                        )}
                    </div>

                    <div className="flex md:hidden">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className={`text-white py-7 px-5 mr-5 hover:bg-gray-500/60 hover:text-white transition-colors duration-500 delay-200 rounded-2xl`}
                        >
                            <p className="text-gray-600 text-2xl font-extrabold">☰</p>
                        </button>
                    </div>
                </div>
            )}

            {menuOpen && (
                <div className="relative md:hidden inset-0 z-50 w-full flex flex-col bg-gray-200">
                    <div className="flex flex-row-reverse pr-5 pt-3">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="text-slate-600 px-2 py-0.5 duration-500 delay-200"
                        >
                            <p className="text-red-600 font-extrabold">X</p>
                        </button>
                    </div>
                    <Link
                        href="/subscriptions"
                        onClick={() => setMenuOpen(false)}
                        className="group flex flex-row text-black font-semibold items-center gap-2 px-6 py-4 hover:bg-slate-600 hover:text-white transition-colors"
                    >
                        Subscription
                    </Link>
                    <Link
                        href="/animes"
                        onClick={() => setMenuOpen(false)}
                        className="group flex flex-row text-black font-semibold items-center gap-2 px-6 py-4 hover:bg-slate-600 hover:text-white transition-colors"
                    >
                        Anime
                    </Link>
                    {!loggedIn ? (
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="group flex flex-row text-black font-semibold items-center gap-2 px-6 py-4 hover:bg-slate-600 hover:text-white transition-colors"
                        >
                            <Image src="/login.png" alt="Login Icon" width={20} height={20} className="inline-block mr-1 group-hover:invert" />
                            Login
                        </Link>) : (
                        <Link
                            href={`/users/${id}`}
                            onClick={() => setMenuOpen(false)}
                            className="group flex flex-row text-black font-semibold items-center gap-2 px-6 py-4 hover:bg-slate-600 hover:text-white transition-colors"
                        >
                            <Image src="/profile.png" alt="Profile Icon" width={20} height={20} className="inline-block mr-1 group-hover:invert" />
                            Profile
                        </Link>
                    )}
                    <div className="relative">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setSearchId(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search Anime..."
                            className="placeholder:text-center sm:hidden border-2 bg-gray-300 border-gray-200 rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 w-10/12 my-4 mx-4"
                        />
                        {searchError && (
                            <p className="text-red-500 text-xs mx-4">{searchError}</p>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}