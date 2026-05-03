"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/axios";

export default function CardList(){
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const response = await api.get("/animes");
                setAnimes(response.data.payload);
            } catch (error) {
                console.error("Error fetching animes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimes();
    }, []);

    if (loading) {
        return <div className="flex flex-col h-screen w-screen items-center mt-20">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-content-center gap-4 p-10">
            {animes.map((anime) => (
                <div key={anime.id} className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <Link href={`/animes/${anime.id}`} className="block h-full p-6">
                        <h3 className="text-lg font-bold mb-5 text-center">{anime.title}</h3>
                        <p className="text-gray-600 text-justify">{anime.description}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}