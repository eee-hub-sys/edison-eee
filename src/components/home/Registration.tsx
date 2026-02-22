"use client";

import React, { useState } from "react";
import { submitRegistrationAction } from "@/app/actions/registrations";
import { RegistrationData } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";

const Registration = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubs, setClubs] = useState<{ name: string }[]>([]);
    const [formData, setFormData] = useState<RegistrationData>({
        name: "",
        email: "",
        roll_number: "",
        club: "",
        mobile: "",
        year: "",
    });

    React.useEffect(() => {
        const fetchClubs = async () => {
            const { data } = await supabase.from('clubs').select('name').order('name');
            if (data) setClubs(data);
        };
        fetchClubs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await submitRegistrationAction(formData);
            if (result.success) {
                setSuccess(true);
                setFormData({ name: "", email: "", roll_number: "", club: "", mobile: "", year: "" });

                // EmailJS Sending Logic in background
                emailjs.send(
                    "service_hmbpntj", // Replace with your Service ID
                    "template_i6yr8oo", // Replace with your Template ID
                    {
                        to_name: formData.name,
                        to_email: formData.email,
                        club_name: formData.club,
                        roll_number: formData.roll_number,
                        message: `Welcome to ${formData.club}! Your registration as a member has been received and is currently pending approval.`,
                    },
                    "wkedLSVzh-u7CXVRU" // Replace with your Public Key
                ).catch(emailError => {
                    console.error("Email Sending Error:", emailError);
                });
            } else {
                setError(result.error || "Registration failed. Please try again.");
            }
        } catch {
            setError("A connection error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="register" className="py-20 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <span className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block">
                            Join EDISON
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black montserrat mb-6">
                            Ready to <span className="highlight">Plug In?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Join over 500+ active members and start your journey in engineering excellence today.
                        </p>
                        <ul className="space-y-6 inline-block text-left">
                            {[
                                "Industry-grade Workshops",
                                "National Level Competitions",
                                "Exclusive Alumni Network",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-foreground/80 font-medium text-sm md:text-base">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Zap size={14} fill="currentColor" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex-1 w-full max-w-xl"
                    >
                        <div className="glass-card relative overflow-hidden p-6 md:p-10">

                            <AnimatePresence mode="wait">
                                {!success ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6 md:y-8"
                                    >
                                        <h3 className="text-xl md:text-2xl font-bold montserrat mb-6 md:mb-10 text-center md:text-left">Membership Application</h3>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all text-sm md:text-base"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all text-sm md:text-base"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Roll Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.roll_number}
                                                        onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all text-sm md:text-base"
                                                        placeholder="EEE2024..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Mobile Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        pattern="[0-9]{10}"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all text-sm md:text-base"
                                                        placeholder="10 Digits"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Preferred Club
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.club}
                                                        onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all appearance-none text-sm md:text-base"
                                                    >
                                                        <option value="" className="bg-background">Select Domain</option>
                                                        {clubs.length > 0 ? (
                                                            clubs.map((c) => (
                                                                <option key={c.name} value={c.name} className="bg-background text-sm md:text-base">
                                                                    {c.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <option value="Green Energy" className="bg-background">Green Energy</option>
                                                                <option value="Echo" className="bg-background">Echo</option>
                                                                <option value="Vidyut" className="bg-background">Vidyut</option>
                                                                <option value="Krida" className="bg-background">Krida</option>
                                                                <option value="Tech Forge Club" className="bg-background">Tech Forge Club</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted mb-2 md:mb-3 block">
                                                        Academic Year
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.year}
                                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-primary outline-none transition-all appearance-none text-sm md:text-base"
                                                    >
                                                        <option value="" className="bg-background">Current Year</option>
                                                        <option value="1" className="bg-background">1st Year</option>
                                                        <option value="2" className="bg-background">2nd Year</option>
                                                        <option value="3" className="bg-background">3rd Year</option>
                                                        <option value="4" className="bg-background">4th Year</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                                                {error}
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full btn-primary disabled:opacity-50 text-sm md:text-base"
                                        >
                                            {loading ? "Initiating Grid Connection..." : "Initiate Membership"}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center text-center"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 font-bold shrink-0">
                                            <CheckCircle2 size={40} className="md:w-12 md:h-12" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold montserrat mb-4">Welcome to the Grid!</h3>
                                        <p className="text-sm md:text-base text-text-muted mb-8">
                                            Your membership application has been logged. Get ready to power the future.
                                        </p>
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="text-primary font-bold hover:underline text-sm md:text-base"
                                        >
                                            Submit another application
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Registration;

