"use client";

import Link from "next/link";
import useHideNavbar from "../components/hideNavbar";
import Image from "next/image";
import api from "../lib/axios";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import InputForm from "../components/inputForm";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [registered, setRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async () => {
        setErrorMessage("");

        if (!username || !email || !password) {
            setErrorMessage("Semua field harus diisi.");
            return;
        }

        try {
            await api.post("/users/register", { username, email, password });
            setRegistered(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Registrasi gagal, coba lagi.");
        }
    };

    const hideNavbar = useHideNavbar();

    return (
        <div>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar />
            </nav>
            
            <div className="h-10"></div>
            <main className="relative flex flex-col items-center justify-center min-h-screen">
                {registered &&
                    <div className="fixed top-0 flex flex-col w-screen h-screen items-center justify-center z-40 bg-black/40">
                        <div className="flex flex-col h-40 w-72 bg-gray-300 items-center rounded-xl">
                            <h3 className="text-2xl mt-7 font-bold">You{"'"}re registed!</h3>
                            <p className="text-gray-600 mb-5">Please login with your account</p>
                            <Link href="/login" className="bg-gray-500 text-white py-1 px-4 rounded-full hover:bg-gray-900 hover:text-gray-200 hover:font-semibold transition-colors duration-300">
                                Login
                            </Link>
                        </div>
                    </div>
                }
                <form className="flex flex-col items-center justify-center bg-gray-200 border-4 border-gray-700 rounded-2xl p-10 w-full max-w-sm gap-5">
                    <div className="flex flex-row items-center">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="inline-block mr-2 rounded-2xl" />
                        <h4 className="text-3xl font-semibold text-black">Register</h4>
                    </div>
                    <div className="flex flex-col gap-7 mt-4">
                        <InputForm
                            label="Username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <InputForm
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <InputForm
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center min-h-25 justify-end">
                        {errorMessage && (
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        )}
                        <p className="text-sm text-gray-600 mb-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                        <button type="button" className="bg-gray-500 text-white py-1 px-4 rounded-full hover:bg-gray-900 hover:text-gray-200 hover:font-semibold transition-colors duration-300" onClick={handleRegister}>
                            Register
                        </button>
                    </div>
                </form>
            </main>
            <div className="h-10"></div>
        </div>
    );
}