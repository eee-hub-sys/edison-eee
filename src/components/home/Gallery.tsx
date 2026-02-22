"use client";

import React, { useEffect, useState } from "react";
import { getGallery, GalleryItem } from "@/lib/db";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const Gallery = ({ initialGallery = [] }: { initialGallery?: GalleryItem[] }) => {
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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
        <section id="gallery" className="py-24 bg-background">
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
                    {gallery.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedImage(item)}
                            className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 break-inside-avoid"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={600}
                                height={400}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#25343F]/80 via-[#25343F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
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
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-110 bg-[#25343F]/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/60 hover:text-white transition-colors p-2 z-120"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={28} className="md:w-8 md:h-8" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain rounded-2xl shadow-2xl border border-white/10"
                                />
                            </div>

                            <div className="mt-4 md:mt-6 text-center px-4">
                                <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2 block">
                                    {selectedImage.club}
                                </span>
                                <h4 className="text-lg md:text-3xl font-black montserrat text-white leading-tight">
                                    {selectedImage.title}
                                </h4>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
