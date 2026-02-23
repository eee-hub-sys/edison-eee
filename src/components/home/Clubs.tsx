"use client";

import React, { useEffect, useState } from "react";
import { getClubs, getCoordinators, Club, Coordinator } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, GraduationCap, Phone, Hash } from "lucide-react";
import Image from "next/image";

const Clubs = ({ initialClubs = [], initialCoordinators = [] }: { initialClubs?: Club[], initialCoordinators?: Coordinator[] }) => {
    const [clubs, setClubs] = useState<Club[]>(initialClubs);
    const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);

    useEffect(() => {
        if (selectedClub) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedClub]);


    useEffect(() => {
        const fetchData = async () => {
            const [clubsData, coordinatorsData] = await Promise.all([
                getClubs(),
                getCoordinators()
            ]);
            setClubs(clubsData);
            setCoordinators(coordinatorsData);
        };
        fetchData();
    }, []);

    const filteredCoordinators = selectedClub
        ? coordinators.filter(c => c.club === selectedClub.name)
        : [];

    const faculty = filteredCoordinators.filter(c => c.type === 'faculty');
    const students = filteredCoordinators.filter(c => c.type === 'student');

    return (
        <section id="clubs" className="py-12 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        Specialized Domains
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black montserrat mb-6"
                    >
                        The <span className="highlight">Core 5</span> Hubs
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-text-muted max-w-2xl mx-auto"
                    >
                        Each sub-club is a specialized center of excellence within the department, fostering innovation and community.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {clubs.map((club, index) => (
                        <motion.div
                            key={club.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedClub(club)}
                            className="glass-card group p-6 md:p-10 cursor-pointer border border-black/10 hover:border-primary/30 transition-all"
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/5 flex items-center justify-center text-3xl md:text-4xl mb-6 group-hover:bg-primary/20 transition-colors">
                                {club.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold montserrat mb-4">{club.name}</h3>
                            <p className="text-sm md:text-base text-text-muted mb-8 leading-relaxed">
                                {club.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedClub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-background/98 backdrop-blur-2xl flex flex-col p-4 md:p-12 overflow-y-auto"
                        onClick={() => setSelectedClub(null)}
                    >
                        <button
                            className="fixed top-6 right-6 md:top-8 md:right-8 text-foreground/50 hover:text-foreground transition-colors z-110 p-2"
                            onClick={() => setSelectedClub(null)}
                        >
                            <X size={28} className="md:w-8 md:h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="max-w-6xl w-full mx-auto my-auto py-12 md:py-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-10 md:mb-16">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl md:text-4xl mb-6 mx-auto">
                                    {selectedClub.icon}
                                </div>
                                <h3 className="text-2xl md:text-5xl font-black montserrat mb-4 capitalize">{selectedClub.name}</h3>
                                <div className="h-1 w-16 md:w-20 bg-primary mx-auto rounded-full" />
                            </div>

                            {faculty.length > 0 && (
                                <div className="mb-12 md:mb-16">
                                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                                        <ShieldCheck className="text-primary shrink-0" size={20} />
                                        <h4 className="text-lg md:text-xl font-black uppercase tracking-[0.2em]">Faculty Mentors</h4>
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
                                        <GraduationCap className="text-primary shrink-0" size={20} />
                                        <h4 className="text-lg md:text-xl font-black uppercase tracking-[0.2em]">Student Leads</h4>
                                        <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {students.map((member, i) => (
                                            <CoordinatorCard key={member.id} member={member} index={i} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredCoordinators.length === 0 && (
                                <div className="text-center py-16 md:py-20 bg-black/5 rounded-3xl border border-black/10 px-6">
                                    <p className="text-text-muted text-base md:text-lg">No coordinator details available for this club yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const CoordinatorCard = ({ member, index }: { member: Coordinator; index: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card group p-2 bg-secondary/50 border-black/10"
    >
        <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-6">
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-all duration-500 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                <h4 className="text-lg font-bold uppercase leading-tight text-foreground">{member.name}</h4>
            </div>
        </div>

        <div className="px-4 pb-4 space-y-3">
            <div className="flex flex-col gap-2 text-[11px] font-bold text-text-muted">
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-primary" />
                    <span>{member.mobile}</span>
                </div>
                {member.roll_number && (
                    <div className="flex items-center gap-2">
                        <Hash size={12} className="text-primary" />
                        <span>{member.roll_number}</span>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);


export default Clubs;
