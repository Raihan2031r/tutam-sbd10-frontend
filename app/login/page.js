"use client";

import Link from "next/link";
import Image from "next/image";
import api from "../lib/axios";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import InputForm from "../components/inputForm";
import useHideNavbar from "../components/hideNavbar";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const hideNavbar = useHideNavbar();

    const handleLogin = async () => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.payload.token);
            localStorage.setItem("id", data.payload.user.id);
            window.dispatchEvent(new Event("storage"));
            setLoggedIn(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Login gagal, coba lagi.");
        }
    };

    return (
        <div>
            <nav className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar />
            </nav>
            <main className="flex flex-col items-center justify-center min-h-screen pt-20">
                {loggedIn &&
                    <div className="fixed top-0 flex flex-col w-screen h-screen items-center justify-center z-40 bg-black/40">
                        <div className="flex flex-col h-40 w-72 bg-gray-300 items-center rounded-xl">
                            <h3 className="text-2xl mt-7 font-bold">You{"'"}re Logged In!</h3>
                            <p className="text-gray-600 mb-5">You can now move to our home page</p>
                            <Link href="/" className="bg-gray-500 text-white py-1 px-4 rounded-full hover:bg-gray-900 hover:text-gray-200 hover:font-semibold transition-colors duration-300">
                                Home
                            </Link>
                        </div>
                    </div>
                }
                <form className="flex flex-col items-center justify-center bg-gray-100 border-4 border-gray-700 rounded-3xl p-10 w-full max-w-sm gap-5">
                    <div className="flex flex-row items-center justify-center">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="inline-block mr-2 rounded-2xl" />
                        <h4 className="text-3xl font-semibold text-gray-700">Login</h4>
                    </div>
                    <div className="flex flex-col gap-7 mt-4">
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
                            Not have an account?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </p>
                        <button type="button" className="bg-gray-500 text-white py-1 px-4 rounded-full hover:bg-gray-900 hover:text-gray-200 hover:font-semibold transition-colors duration-300" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}