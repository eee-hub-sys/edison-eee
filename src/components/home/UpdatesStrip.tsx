"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UpdatesStrip = () => {
    const [updates, setUpdates] = useState<string[]>([]);

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

        fetchUpdates();

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
    }, []);

    return (
        <div className="w-full bg-primary/10 border-y border-white/10 overflow-hidden py-3 flex items-center my-16 backdrop-blur-md">
            <div className="bg-primary text-[#25343F] px-4 py-1 text-xs font-black montserrat tracking-tighter shrink-0 z-10 shadow-lg">
                LATEST PULSE
            </div>
            <div className="flex-1 overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-medium tracking-wide">
                    {[...updates, ...updates, ...updates].map((update, i) => (
                        <span key={i} className="shrink-0">
                            {update}
                        </span>
                    ))}
                </div>
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default UpdatesStrip;
