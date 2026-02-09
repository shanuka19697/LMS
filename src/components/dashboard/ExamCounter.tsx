"use client";

import { Timer, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExamCounter() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [examDate, setExamDate] = useState<Date | null>(null);

    useEffect(() => {
        const target = new Date();
        target.setDate(target.getDate() + 14);
        target.setHours(9, 0, 0, 0);
        setExamDate(target);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!examDate) return (
        <div className="bg-indigo-600 rounded-3xl p-6 h-full animate-pulse min-h-[300px]" />
    );

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden h-full flex flex-col justify-between group">
            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />

            {/* Header */}
            <div className="flex items-center justify-between relative z-10 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                        <Timer className="w-5 h-5 text-indigo-50" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-indigo-200 uppercase tracking-widest">Upcoming</p>
                        <h3 className="font-bold text-xl text-white leading-tight">Finals</h3>
                    </div>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                    {examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 relative z-10 mb-6">
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hrs" />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <TimeUnit value={timeLeft.seconds} label="Secs" isLast />
            </div>

            {/* Footer / Link */}
            <button className="relative z-10 w-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md py-3 rounded-xl flex items-center justify-center gap-2 transition-all group-hover:translate-x-1">
                <span className="text-sm font-bold">View Exam Schedule</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function TimeUnit({ value, label, isLast = false }: { value: number, label: string, isLast?: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div className={`bg-white/10 backdrop-blur-md rounded-2xl w-full aspect-[4/5] flex items-center justify-center border border-white/10 mb-2 ${isLast ? 'bg-indigo-400/20 border-indigo-300/30' : ''}`}>
                <span className="text-2xl lg:text-3xl font-bold font-heading tabular-nums tracking-tight">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                {label}
            </span>
        </div>
    )
}
