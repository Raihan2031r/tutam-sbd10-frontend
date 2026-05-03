"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import useHideNavbar from "../components/hideNavbar";
import api from "../lib/axios";

export default function Subscription() {
    const [membership, setMembership] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const hideNavbar = useHideNavbar();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/membership/status");
            setMembership(data.payload);
        } catch (error) {
            setMessage({ text: "Gagal memuat status membership.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            setActionLoading(true);
            const { data } = await api.post("/membership/subscribe");
            setMessage({ text: "Subscription berhasil!", type: "success" });
            setMembership(data.payload);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || "Gagal subscribe.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Yakin ingin membatalkan subscription?")) return;
        try {
            setActionLoading(true);
            const { data } = await api.post("/membership/cancel");
            setMessage({ text: "Subscription dibatalkan.", type: "success" });
            setMembership(data.payload);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || "Gagal membatalkan.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const statusColor = {
        active: "bg-green-400",
        expired: "bg-yellow-400",
        canceled: "bg-red-400",
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
        });
    };

    return (
        <div>
            <nav className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${hideNavbar ? "-translate-y-full" : "translate-y-0"}`}>
                <Navbar />
            </nav>
            <main className="flex flex-col items-center justify-center min-h-screen pt-20">
                <div className="flex flex-col items-center bg-gray-100 border-4 border-gray-700 rounded-3xl p-10 w-full max-w-sm gap-5">

                    {/* Header */}
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-2xl" />
                        <h4 className="text-3xl font-semibold text-gray-700">Premium</h4>
                    </div>
                    <p className="text-sm text-gray-500 -mt-3">Akses semua anime premium tanpa batas</p>

                    {/* Status Card */}
                    {loading ? (
                        <div className="w-full bg-gray-200 rounded-2xl p-4 text-center text-gray-500 text-sm">
                            Memuat status...
                        </div>
                    ) : (
                        <div className="w-full bg-gray-200 rounded-2xl p-4 flex flex-col gap-1">
                            <p className="text-xs text-gray-500">Status membership</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${statusColor[membership?.status] || "bg-gray-400"}`} />
                                <span className="text-base font-semibold text-gray-700 capitalize">
                                    {membership?.status || "Belum berlangganan"}
                                </span>
                            </div>
                            {membership?.expires_at && (
                                <p className="text-xs text-gray-500">
                                    Berakhir: {formatDate(membership.expires_at)}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        {["Akses semua konten premium", "Streaming tanpa iklan", "Rp 29.999 / bulan"].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-green-500 font-bold">✓</span>
                                {item}
                            </div>
                        ))}
                    </div>

                    {message.text && (
                        <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
                            {message.text}
                        </p>
                    )}

                    <div className="w-full flex flex-col gap-2 mt-1">
                        <button
                            onClick={handleSubscribe}
                            disabled={actionLoading}
                            className="w-full bg-gray-500 text-white py-1.5 rounded-full hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50"
                        >
                            {membership?.status === "active"
                                ? "Perpanjang Membership"
                                : "Mulai Berlangganan"}
                        </button>

                        {membership?.status === "active" && (
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="w-full border border-red-400 text-red-500 py-1.5 rounded-full hover:bg-red-50 transition-colors duration-300 disabled:opacity-50"
                            >
                                Batalkan Subscription
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}