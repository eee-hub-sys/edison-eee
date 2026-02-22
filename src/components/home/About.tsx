"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, ShieldCheck, Users } from "lucide-react";

const About = () => {
    const cards = [
        {
            icon: <Rocket className="w-10 h-10 text-primary" />,
            title: "Future Forward",
            desc: "Harnessing emerging technologies to create sustainable and intelligent solutions for global energy needs.",
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-primary" />,
            title: "Technical Excellence",
            desc: "Rigorous mentorship and hands-on laboratory experiences to master the fundamentals of EEE.",
        },
        {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: "Collaborative Growth",
            desc: "A vibrant ecosystem where students, faculty, and industry experts converge to exchange groundbreaking ideas.",
        },
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        Vision & Journey
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-black montserrat mb-6 md:mb-8"
                    >
                        Innovating Beyond <span className="highlight">Boundaries</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-text-muted max-w-3xl mx-auto text-base md:text-lg leading-relaxed px-4"
                    >
                        EDISON serves as a catalyst for creative engineering minds, bridging the gap between academic theory and real-world technological challenges.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card flex flex-col items-center text-center group p-8 md:p-10 lg:px-12 lg:py-14"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 md:mb-8 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                <div className="w-8 h-8 md:w-10 md:h-10 text-primary">
                                    {card.icon}
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold montserrat mb-4">{card.title}</h3>
                            <p className="text-sm md:text-base text-text-muted leading-relaxed">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
