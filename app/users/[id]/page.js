"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/app/lib/axios";
import Navbar from "@/app/components/navbar";
import useHideNavbar from "@/app/components/hideNavbar";

export default function UserProfile() {
    const { id } = useParams();
    const hideNavbar = useHideNavbar();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ loggedIn, setLoggedIn ] = useState(true);
    const [ membership, setMembership ] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoggedIn(false);
            return;
        } else setLoggedIn(true);

        const fetchData = async () => {
            try {
                const userRes = await api.get(`/users/id/${id}`);
                setUser(userRes.data.payload);
                const membershipRes = await api.get(`/membership/status`) || null;
                setMembership(membershipRes.data.payload.status);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("Kamu tidak punya akses ke halaman ini.");
                } else if (err.response?.status === 404) {
                    setError("User tidak ditemukan.");
                } else {
                    setError("Terjadi kesalahan.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.dispatchEvent(new Event("storage"));
        setLoggedIn(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500">{error}</p>
        </div>
    );

    return (
        <div className="flex flex-col bg-zinc-50 min-h-screen">
            <nav className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out
                ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar />
            </nav>

            <main className="flex flex-col items-center justify-center min-h-screen px-4">
                {!loggedIn &&
                    <div className="fixed top-0 flex flex-col w-screen h-screen items-center justify-center z-40 bg-black/40">
                        <div className="flex flex-col h-40 w-72 bg-gray-300 items-center rounded-xl">
                            <h3 className="text-2xl mt-7 font-bold">You{"'"}re Logged Out!</h3>
                            <p className="text-gray-600 mb-5">Please Log In again!</p>
                            <Link href="/login" className="bg-gray-500 text-white py-1 px-4 rounded-full hover:bg-gray-900 hover:text-gray-200 hover:font-semibold transition-colors duration-300">
                                Login
                            </Link>
                        </div>
                    </div>
                }
                <div className="bg-white border border-gray-200 rounded-xl shadow-md w-full max-w-sm p-8 flex flex-col items-center gap-5">
                    
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white text-3xl font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-xl font-bold text-gray-800">{user.username}</h1>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className={`py-1 px-3 ${ !membership ? 'bg-gray-600' : 'bg-amber-500' } rounded-lg mt-4`}>
                            {membership && <p className="text-sm font-semibold text-white">Premium User</p>}
                            {!membership && <p className="text-sm font-semibold text-white">Free User</p>}
                        </div>
                    </div>

                    <hr className="w-full border-gray-200" />

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-1.5 px-6 rounded-full text-sm hover:bg-red-700 transition-colors duration-300"
                    >
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
}