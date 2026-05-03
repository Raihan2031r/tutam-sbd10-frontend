"use client";

import Navbar from "@/app/components/navbar";
import Link from "next/link";
import useHideNavbar from "@/app/components/hideNavbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/axios";

export default function Anime(){
    const params = useParams();
    const { id } = params;
    const hideNavbar = useHideNavbar();

    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animeStatus, setAnimeStatus] = useState("free");
    const [userStatus, setUserStatus] = useState("free");
    
    useEffect(() => {
        const fetchAnimeDetail = async () => {
            try {
                const response = await api.get(`/animes/${id}`);
                const data = response.data.payload;
                setAnimes(data);
                setAnimeStatus(data.status);
                //console.log(data.status);

                const checkUser = await api.get("/membership/status")
                const membershipData = checkUser.data.payload;
                const now = new Date();
                const isPremium = 
                    membershipData.status === "active" || 
                    (membershipData.status === "canceled" && new Date(membershipData.expires_at) > now);

                setUserStatus(isPremium ? "premium" : "free");
                //console.log(isPremium ? "premium" : "free");

            } catch (error) {
                console.error("Error fetching animes:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnimeDetail();
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!animes) {
        return <div className="min-h-screen flex items-center justify-center text-white">Anime tidak ditemukan.</div>;
    }



    return(
        <div className="min-h-screen w-full bg-white text-gray-600 flex flex-col items-center">
            <div className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar/>
            </div>
            
            <div className="w-full max-w-4xl p-6 flex flex-col gap-6 mt-40">
                <h1 className="text-3xl font-bold">{animes.title}</h1>
                
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                    {animeStatus === "premium" && userStatus === "free" && (
                        <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center gap-4">
                            <p className="text-white text-lg font-semibold">This anime is for premium users only.</p>
                            <Link href="/membership" className="bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300">
                                Upgrade to Premium
                            </Link>
                        </div>
                    )}
                    {(animeStatus === "free" || (animeStatus === "premium" && userStatus === "premium")) && (
                        <iframe
                            src={animes.url}
                            title={animes.title}
                            className="w-full h-full object-cover"
                            allowFullScreen
                        />
                    )}
                </div>

                <div className="bg-gray-300 p-6 rounded-xl shadow-md">
                    <p className="text-gray-700 leading-relaxed text-justify">
                        {animes.description}
                    </p>
                    <div className="mt-4 flex gap-4 text-sm text-gray-300 font-semibold">
                        <span className="bg-gray-600 px-3 py-1 rounded-full uppercase">{animes.category}</span>
                        <span className={`${animeStatus === "premium" ? "bg-amber-600" : "bg-gray-600"} px-3 py-1 rounded-full uppercase`}>{animeStatus}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}