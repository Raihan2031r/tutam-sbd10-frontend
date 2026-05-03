"use client";

import Navbar from "../components/navbar"; 
import useHideNavbar from "../components/hideNavbar";
import { useState, useEffect } from "react";
import api from "../lib/axios";

export default function AnimeList(){
    const hideNavbar = useHideNavbar();
    const [animes, setAnimes] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const getAnime = async (filter = null) => {
        try{
            let endpoints = '';
            if(!filter) endpoints = '/animes';
            else endpoints = `/animes/filter/alphabet?alphabet=${filter}`;

            const response = await api.get(endpoints);
            setAnimes(response.data.payload);
        } catch (error){
            console.error("Error fetching animes:", error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        getAnime();
    }, []);

    const handleFilter = (letter) => {
        setActiveFilter(letter);
        getAnime(letter);
    }

    const handleClear = () => {
        setActiveFilter(null);
        getAnime();
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return(
        <div className="min-h-screen w-full bg-white text-gray-600 flex flex-col items-center">
            <div className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar/>
            </div>

            <main className="flex flex-col gap-10 mt-50 items-center min-h-96 w-full">
                <div className="fixed top-16 flex flex-col items-center justify-center z-30 bg-white w-full py-3 mt-20">
                    <h2 className="text-3xl text-gray-700 font-bold">Anime List</h2>
                    <div className="flex flex-wrap justify-center gap-1 max-w-2xl mt-2">
                        {alphabet.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => handleFilter(letter)}
                                className={`w-8 h-8 text-sm font-semibold rounded 
                                    ${activeFilter === letter 
                                        ? "bg-slate-700 text-white" 
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                                    } transition-colors duration-200`}
                            >
                                {letter}
                            </button>
                        ))}
                        <button
                            onClick={handleClear}
                            className="w-16 h-8 text-sm font-semibold rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl px-4 mt-32">
                    {animes.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Tidak ada anime ditemukan.</p>
                    ) : (
                        animes.map((anime) => (
                            <a key={anime.id} href={`/animes/${anime.id}`}
                                className="bg-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col gap-2">
                                <h3 className="font-semibold text-gray-700 text-sm">{anime.title}</h3>
                                <span className="text-xs text-gray-500 uppercase">{anime.category}</span>
                            </a>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
}