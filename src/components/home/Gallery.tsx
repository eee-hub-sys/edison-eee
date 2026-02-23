"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getGallery, GalleryItem } from "@/lib/db";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, Images } from "lucide-react";

const Gallery = ({ initialGallery = [] }: { initialGallery?: GalleryItem[] }) => {
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
    const [selectedGroup, setSelectedGroup] = useState<GalleryItem[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const groupedGallery = useMemo(() => {
        const groups = new Map<string, GalleryItem[]>();
        gallery.forEach(item => {
            const key = `${item.title.toLowerCase().trim()}-${item.club}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(item);
        });
        return Array.from(groups.values());
    }, [gallery]);

    useEffect(() => {
        const fetchGallery = async () => {
            const data = await getGallery();
            setGallery(data);
        };
        if (gallery.length === 0) {
            fetchGallery();
        }
    }, [gallery.length]);

    return (
        <section id="gallery" className="py-12 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        Visual Chronicles
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black montserrat mb-6"
                    >
                        Momentum <span className="highlight">Gallery</span>
                    </motion.h2>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {groupedGallery.map((group, index) => {
                        const item = group[0];
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    setSelectedGroup(group);
                                    setCurrentIndex(0);
                                }}
                                className="relative group cursor-pointer overflow-hidden rounded-2xl border border-black/10 break-inside-avoid"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {group.length > 1 && (
                                    <div className="absolute top-4 right-4 bg-foreground/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white/90 z-10 shadow-lg">
                                        <Images size={14} />
                                        <span className="text-xs font-bold">{group.length}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 block">
                                                {item.club}
                                            </span>
                                            <h4 className="text-white font-bold montserrat truncate">{item.title}</h4>
                                        </div>
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0 ml-2">
                                            <ZoomIn size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedGroup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-110 bg-foreground/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedGroup(null)}
                    >
                        <button
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/60 hover:text-white transition-colors p-2 z-120"
                            onClick={() => setSelectedGroup(null)}
                        >
                            <X size={28} className="md:w-8 md:h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full flex items-center justify-center group/modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedGroup.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex((prev) => (prev - 1 + selectedGroup.length) % selectedGroup.length);
                                    }}
                                    className="absolute -left-4 md:-left-16 text-white/50 hover:text-white transition-colors p-2 z-20 hover:scale-110 active:scale-95"
                                >
                                    <ChevronLeft size={48} strokeWidth={1.5} />
                                </button>
                            )}

                            <div className="w-full flex flex-col items-center">
                                <div className="relative aspect-video w-full">
                                    <Image
                                        src={selectedGroup[currentIndex].image}
                                        alt={selectedGroup[currentIndex].title}
                                        fill
                                        unoptimized
                                        className="object-contain rounded-2xl shadow-2xl border border-white/10"
                                    />
                                </div>

                                <div className="mt-4 md:mt-6 text-center px-4">
                                    <div className="flex items-center justify-center gap-3 mb-1 md:mb-2">
                                        <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-widest block">
                                            {selectedGroup[currentIndex].club}
                                        </span>
                                        {selectedGroup.length > 1 && (
                                            <span className="bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest">
                                                {currentIndex + 1} / {selectedGroup.length}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-lg md:text-3xl font-black montserrat text-white leading-tight">
                                        {selectedGroup[currentIndex].title}
                                    </h4>
                                </div>
                            </div>

                            {selectedGroup.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex((prev) => (prev + 1) % selectedGroup.length);
                                    }}
                                    className="absolute -right-4 md:-right-16 text-white/50 hover:text-white transition-colors p-2 z-20 hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight size={48} strokeWidth={1.5} />
                                </button>
                            )}
                        </motion.div>

                        {/* Optional thumbnail strip if multiple images */}
                        {selectedGroup.length > 1 && (
                            <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4 hide-scrollbar" onClick={(e) => e.stopPropagation()}>
                                {selectedGroup.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`relative w-16 h-12 md:w-20 md:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${idx === currentIndex ? 'border-primary scale-110 z-10' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img.image} alt="thumbnail" fill className="object-cover" unoptimized />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
