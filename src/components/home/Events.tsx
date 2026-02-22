"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getEvents, Event } from "@/lib/db";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

const Events = ({ initialEvents = [] }: { initialEvents?: Event[] }) => {
    const [events, setEvents] = useState<Event[]>(initialEvents);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
        };
        if (events.length === 0) {
            fetchEvents();
        }
    }, [events.length]);

    return (
        <section id="events" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        Calendars & Milestones
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black montserrat mb-6"
                    >
                        Upcoming <span className="highlight">Events</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card flex flex-col group overflow-hidden p-0"
                        >
                            <div className="relative h-48 md:h-56 overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] md:text-xs font-black montserrat uppercase tracking-widest text-white shadow-lg z-10">
                                    {event.club}
                                </div>
                                {event.isLive && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 px-3 py-1 rounded-full text-[10px] font-black montserrat uppercase tracking-widest text-white shadow-lg animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                        Live
                                    </div>
                                )}
                            </div>
                            <div className="p-5 md:p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm mb-3 md:mb-4">
                                    <Calendar size={14} className="md:w-4 md:h-4" />
                                    {event.date}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold montserrat mb-3 md:mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                    {event.title}
                                </h3>
                                <p className="text-text-muted text-xs md:text-sm mb-6 md:mb-8 line-clamp-3">
                                    {event.description}
                                </p>
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {event.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-[9px] md:text-[10px] uppercase font-black tracking-widest bg-white/5 border border-white/10 px-2 md:px-3 py-1 rounded-full text-text-muted flex items-center gap-1"
                                        >
                                            <Tag size={10} className="text-primary/60" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
