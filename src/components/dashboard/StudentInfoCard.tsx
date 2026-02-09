"use client";

import { ReactNode } from "react";

interface StudentInfoCardProps {
    label: string;
    value: string;
    subtext?: string;
    icon: ReactNode;
    color: string;
}

export default function StudentInfoCard({ label, value, subtext, icon, color }: StudentInfoCardProps) {
    return (
        <div className="bg-white/60 backdrop-blur-xl p-5 md:p-6 lg:p-7 rounded-[2.5rem] border border-white/80 shadow-2xl shadow-slate-200/40 hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            {/* Premium Glow Decor */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-[0.08] rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700`} />
            <div className={`absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl`} />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                    <h3 className="text-xl md:text-2xl font-black font-heading text-slate-900 tracking-tight leading-none pt-1">{value}</h3>
                    {subtext && <p className="text-xs text-slate-500 font-bold opacity-70 italic">{subtext}</p>}
                </div>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 text-white shadox-inner shadow-indigo-100`}>
                    <div className={`${color.replace('bg-', 'text-')} drop-shadow-sm`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
