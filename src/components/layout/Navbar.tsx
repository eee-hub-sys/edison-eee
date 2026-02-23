"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const isAdminPage = pathname.startsWith("/admin");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Clubs", href: "#clubs" },
        { name: "Events", href: "#events" },
        { name: "Gallery", href: "#gallery" },
    ];

    if (isAdminPage) return null;

    return (
        <header className="relative w-full z-100 bg-background">
            {/* Top Branding Bar */}
            <div className="bg-background py-3 px-4 md:px-12 flex justify-between items-center border-b border-white/10">
                {/* Top Left: Vignan Logo */}
                <div className="relative w-32 h-10 md:w-56 md:h-14">
                    <Image
                        src="/vg.jpeg"
                        alt="Vignan Logo"
                        fill
                        priority
                        className="object-contain object-left"
                    />
                </div>

                {/* Top Right: Edison Club Logo */}
                <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden bg-white shadow-lg border border-primary/20">
                    <Image
                        src="/eee-logo.png"
                        alt="Edison Club Logo"
                        fill
                        priority
                        className="object-contain p-1"
                    />
                </div>
            </div>

            {/* Bottom: Main Navbar */}
            <nav
                className={cn(
                    "sticky top-0 left-0 w-full transition-all duration-300 py-3 px-4 md:px-8 lg:px-12",
                    scrolled ? "bg-background/80 backdrop-blur-md shadow-xl border-b border-white/10" : "bg-background"
                )}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                    {/* Brand Name (Mobile) / Placeholder */}
                    <div className="lg:hidden">
                        <span className="text-lg font-black tracking-tighter text-foreground montserrat uppercase">Edison</span>
                    </div>

                    {/* Center: Nav Links — absolutely centered */}
                    <ul className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-sm xl:text-base font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right: Actions */}
                    <div className="hidden sm:flex items-center justify-end gap-4 ml-auto">
                        <Link
                            href="#register"
                            className="bg-primary hover:bg-primary/90 text-white text-[10px] lg:text-xs font-bold py-2.5 px-5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 uppercase tracking-widest whitespace-nowrap"
                        >
                            Join Now
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-foreground p-2 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={cn(
                        "fixed inset-0 bg-background/98 backdrop-blur-2xl z-200 lg:hidden transition-all duration-500 ease-in-out flex flex-col items-center justify-center px-6",
                        isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    )}
                >
                    <ul className="flex flex-col items-center gap-8 text-center">
                        {navLinks.map((link, i) => (
                            <motion.li
                                key={link.name}
                                initial={false}
                                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </motion.li>
                        ))}
                        <motion.li
                            initial={false}
                            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: navLinks.length * 0.1 }}
                            className="mt-4 flex flex-col items-center gap-6"
                        >
                            <Link
                                href="#register"
                                className="bg-primary px-12 py-4 rounded-full text-white font-bold"
                                onClick={() => setIsOpen(false)}
                            >
                                Join Now
                            </Link>
                        </motion.li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
