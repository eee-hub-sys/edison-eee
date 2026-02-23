"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UpdatesStrip = ({ initialUpdates = [] }: { initialUpdates?: string[] }) => {
    const [updates, setUpdates] = useState<string[]>(initialUpdates.length > 0 ? initialUpdates : []);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const { data, error } = await supabase
                    .from('updates')
                    .select('message')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    setUpdates(data.map(u => u.message));
                } else {
                    setUpdates([
                        ""
                    ]);
                }
            } catch (error) {
                console.error("Supabase Fetch Error", error);
                setUpdates(["⚡ Powering the future of EEE...", "🚀 Innovation in progress.", "✨ EDISON Newsroom is live."]);
            }
        };

        if (updates.length === 0) {
            fetchUpdates();
        }

        // Subscribe to real-time updates
        const channel = supabase
            .channel('pulse-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'updates' },
                () => {
                    fetchUpdates();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [updates.length]);

    return (
        <div className="w-full bg-primary/10 border-y border-black/10 overflow-hidden py-4 flex items-center my-8 backdrop-blur-md">
            <div className="bg-primary text-white px-4 py-1.5 text-[10px] md:text-xs font-black montserrat tracking-tighter shrink-0 z-10 shadow-xl ml-4 rounded-sm">
                LATEST PULSE
            </div>
            <div className="flex-1 overflow-hidden relative ml-8">
                <div className="flex animate-marquee whitespace-nowrap gap-16 text-xs md:text-sm font-bold tracking-widest uppercase">
                    {[...Array(10)].map((_, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            {updates.map((update, i) => (
                                <div key={`${groupIndex}-${i}`} className="flex items-center gap-6 shrink-0">
                                    <span className="text-foreground">
                                        {update}
                                    </span>
                                    <span className="text-primary/40">✦</span>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-10%); }
        }
        .animate-marquee {
          animation: marquee 12s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default UpdatesStrip;
