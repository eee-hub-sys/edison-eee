"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const phrases = [
    "Innovating the Future of Energy.",
    "Designing Intelligent Systems.",
    "Mastering the Speed of Light.",
    "Powering the Digital World.",
];

const Hero = ({ initialStats = { clubs: 5, members: 500, events: 20 } }: { initialStats?: { clubs: number, members: number, events: number } }) => {
    const [displayText, setDisplayText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [stats, setStats] = useState(initialStats);

    useEffect(() => {
        const fetchStats = async () => {
            const [clubsRes, registrantsRes, eventsRes] = await Promise.all([
                supabase.from('clubs').select('*', { count: 'exact', head: true }),
                supabase.from('registrations').select('*', { count: 'exact', head: true }),
                supabase.from('events').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                clubs: clubsRes.count || 5,
                members: (registrantsRes.count || 0) + 500, // Assuming 500 is base
                events: eventsRes.count || 20,
            });
        };
        // Background refresh only
        fetchStats();
    }, []);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        let typingSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            typingSpeed = 300;
        }

        const timer = setTimeout(() => {
            if (!isDeleting && charIndex === currentPhrase.length) {
                setIsDeleting(true);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            } else {
                const nextCharIndex = isDeleting ? charIndex - 1 : charIndex + 1;
                setCharIndex(nextCharIndex);
                setDisplayText(currentPhrase.substring(0, nextCharIndex));
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, phraseIndex]);

    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 relative flex items-center gap-4 group"
                    >
                        {/* Vignan Logo */}

                        {/* EEE Logo */}
                        <div className="relative p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Image
                                src="/eee-logo.png"
                                alt="EEE Logo"
                                width={120}
                                height={120}
                                priority
                                className="w-20 h-auto md:w-28 md:h-auto object-contain"
                                style={{ filter: "invert(1) grayscale(1) brightness(2)", height: "auto" }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-1" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-sm font-black mb-8 md:mb-10 tracking-widest md:tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(255,155,81,0.2)] backdrop-blur-md max-w-[90vw] md:max-w-none"
                    >
                        <span className="w-2 h-2 shrink-0 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#FF9B51]" />
                        <span className="truncate">Department of Electrical & Electronics Engineering</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black montserrat tracking-tighter leading-[1.1] md:leading-none mb-6 text-center"
                    >
                        Welcome to{" "}
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-accent to-foreground glow-text block sm:inline">
                            EDISON
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="h-16 md:h-12 mb-6 text-center"
                    >
                        <p className="text-xl md:text-3xl font-medium text-foreground/90 font-mono text-center px-4">
                            {displayText}
                            <span className="w-1 h-6 md:h-8 ml-1 bg-primary inline-block animate-pulse align-middle" />
                        </p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-base md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed text-center px-4"
                    >
                        Empowering the next generation of engineers through innovation, leadership, and technical excellence in
                        Electrical & Electronics Engineering.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <Link href="#clubs" className="btn-primary">
                            Explore Clubs
                        </Link>
                        <Link
                            href="#register"
                            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all font-bold"
                        >
                            Join Community
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="mt-12 md:mt-20 flex flex-wrap gap-8 md:gap-20 justify-center"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-black montserrat text-foreground">{stats.clubs}</span>
                            <span className="text-[10px] md:text-sm text-text-muted uppercase tracking-widest font-bold">Sub-Clubs</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-black montserrat text-foreground">{stats.members}+</span>
                            <span className="text-[10px] md:text-sm text-text-muted uppercase tracking-widest font-bold">Members</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-black montserrat text-foreground">{stats.events}+</span>
                            <span className="text-[10px] md:text-sm text-text-muted uppercase tracking-widest font-bold">Events</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-1" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-1" />
        </section>
    );
};

export default Hero;
