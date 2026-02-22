import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#25343F] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-primary animate-spin" size={40} />
                <span className="text-text-muted text-xs font-black uppercase tracking-[0.3em]">Igniting Grid</span>
            </div>
        </div>
    );
}
