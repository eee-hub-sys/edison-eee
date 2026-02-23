"use client";

import React, { useEffect, useState } from "react";
import { getCoordinators, Coordinator } from "@/lib/db";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Hash, ShieldCheck, GraduationCap } from "lucide-react";

const Team = () => {
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

    useEffect(() => {
        const fetchCoordinators = async () => {
            const data = await getCoordinators();
            setCoordinators(data);
        };
        fetchCoordinators();
    }, []);

    const faculty = coordinators.filter(c => c.type === 'faculty');
    const students = coordinators.filter(c => c.type === 'student');

    return (
        <section id="network" className="py-10 md:py-14 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        Our Pillars
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-black montserrat mb-6 uppercase italic tracking-tighter"
                    >
                        The <span className="highlight">Network</span>
                    </motion.h2>
                </div>

                {faculty.length > 0 && (
                    <div className="mb-16 md:mb-20">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <ShieldCheck className="text-primary shrink-0 w-5 h-5 md:w-6 md:h-6" />
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em]">Faculty Mentors</h3>
                            <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {faculty.map((member, i) => (
                                <CoordinatorCard key={member.id} member={member} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {students.length > 0 && (
                    <div>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <GraduationCap className="text-primary shrink-0 w-5 h-5 md:w-6 md:h-6" />
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em]">Student Leads</h3>
                            <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {students.map((member, i) => (
                                <CoordinatorCard key={member.id} member={member} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const CoordinatorCard = ({ member, index }: { member: Coordinator; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card group p-2"
    >
        <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-4 md:mb-6">
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-all duration-500 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 text-left">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-1">{member.club}</p>
                <h4 className="text-base md:text-lg font-bold uppercase leading-tight truncate">{member.name}</h4>
            </div>
        </div>

        <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] md:text-[10px] font-bold text-text-muted border-b border-black/5 pb-2 gap-2">
                <div className="flex items-center gap-2">
                    <Phone className="text-primary w-[10px] h-[10px] md:w-3 md:h-3" />
                    <span>{member.mobile}</span>
                </div>
                {member.roll_number && (
                    <div className="flex items-center gap-2">
                        <Hash className="text-primary w-[10px] h-[10px] md:w-3 md:h-3" />
                        <span>{member.roll_number}</span>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

export default Team;
