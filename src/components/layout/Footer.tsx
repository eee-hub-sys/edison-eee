"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Mail, MapPin, Globe } from "lucide-react";

const Footer = () => {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage) return null;
    return (
        <footer className="pt-16 md:pt-24 pb-8 md:pb-12 mt-16 md:mt-24 border-t border-black/10 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 text-center md:text-left">
                    <div className="lg:col-span-1">
                        <Link href="#home" className="flex items-center justify-center md:justify-start gap-2 mb-6">
                            <Zap className="text-primary fill-current w-7 h-7 md:w-8 md:h-8" />
                            <span className="text-2xl md:text-3xl font-black montserrat tracking-tighter">EDISON</span>
                        </Link>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm mx-auto md:mx-0">
                            The heartbeat of EEE Department. Powering tomorrow, today through innovation and technical excellence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-base md:text-lg font-bold montserrat mb-6 md:mb-8 uppercase tracking-widest text-primary">Navigation</h4>
                        <ul className="space-y-3 md:space-y-4">
                            {["Home", "About", "Clubs", "Events", "Gallery"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`#${item.toLowerCase()}`}
                                        className="text-sm md:text-base text-text-muted hover:text-primary transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base md:text-lg font-bold montserrat mb-6 md:mb-8 uppercase tracking-widest text-primary">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start justify-center md:justify-start gap-3 text-sm md:text-base text-text-muted">
                                <MapPin size={18} className="text-primary shrink-0 mt-1" />
                                <span>Department of Electronics and Electrical Engineering</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3 text-sm md:text-base text-text-muted">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="truncate">eeeclubactivity@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base md:text-lg font-bold montserrat mb-6 md:mb-8 uppercase tracking-widest text-primary">Admin Gateway</h4>
                        <p className="text-xs md:text-sm text-text-muted mb-6">Access the mission control dashboard.</p>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/5 border border-black/10 hover:bg-primary/10 hover:border-primary/20 transition-all font-bold group text-sm md:text-base"
                        >
                            Control Center
                            <Zap size={14} className="group-hover:fill-current transition-all" />
                        </Link>
                    </div>
                </div>

                <div className="pt-8 md:pt-12 border-t border-black/5 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs md:text-sm text-text-muted">
                        © 2026 <span className="text-primary font-bold">EDISON EEE</span>. All technical systems online.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="https://vitsitdepartment.vercel.app/clubs" target="_blank" className="text-[10px] md:text-sm text-text-muted hover:text-primary transition-colors">Developed by <span className="text-primary font-bold">NG-DSDC, DEPT OF IT</span></Link>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-1" />
        </footer>
    );
};

export default Footer;
