"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Lock, Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid login credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#25343F] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(255,155,81,0.05),transparent)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex items-center gap-4 justify-center mb-12">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_30px_-10px_rgba(255,155,81,0.5)]">
                            <Zap className="text-primary fill-current" size={24} />
                        </div>
                        <span className="text-2xl font-black montserrat tracking-tighter text-white">EDISON</span>
                    </div>
                    <div className="w-px h-8 bg-white/20 mx-2" />
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <Image
                            src="/eee-logo.png"
                            alt="EEE Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            style={{ filter: "invert(1) grayscale(1) brightness(2)", height: "auto" }}
                        />
                        <span className="text-xl font-black montserrat tracking-tighter text-white/40">EEE</span>
                    </div>
                </div>

                <div className="glass-card p-10 border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold montserrat text-white mb-2">Security Gateway</h1>
                        <p className="text-text-muted text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2">
                            <ShieldCheck size={14} className="text-primary" />
                            Admin Authentication
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Access Token (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@edison.eee"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-all text-white placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Passkey</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-all text-white placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 group/btn"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6">
                    <p className="text-center text-text-muted text-[10px] uppercase font-bold tracking-widest">
                        Authorized Personnel Only • © 2026 EDISON
                    </p>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.2em] group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Website
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
