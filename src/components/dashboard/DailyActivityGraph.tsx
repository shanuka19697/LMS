"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityDataItem {
    day: string;
    hours: number;
    height: string;
}

interface DailyActivityGraphProps {
    data: ActivityDataItem[];
    averageHours: string;
    totalHours: number;
}

export default function DailyActivityGraph({ data, averageHours, totalHours }: DailyActivityGraphProps) {
    return (
        <div className="bg-white/70 backdrop-blur-xl p-6 lg:p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-500/5 h-full flex flex-col relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-100/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-100/30 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-start justify-between mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <h3 className="font-bold font-heading text-gray-900 text-xl tracking-tight">Daily Performance</h3>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Tracking your study velocity this week</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100/50">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">+12% vs last week</span>
                    </div>
                    <div className="p-3 bg-white shadow-lg shadow-indigo-500/10 rounded-2xl text-indigo-600 border border-indigo-50">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="flex items-stretch justify-between gap-3 lg:gap-6 flex-1 min-h-[200px] relative z-10 mb-2">
                {data.map((item, index) => (
                    <div key={item.day} className="flex flex-col items-center gap-4 flex-1 group/bar cursor-default h-full justify-end">
                        <div className="relative w-full h-full flex flex-col justify-end">
                            {/* Ghost bar background */}
                            <div className="absolute inset-x-0 bottom-0 top-0 bg-gray-50/50 rounded-2xl transition-all duration-300 group-hover/bar:bg-gray-100/80" />

                            {/* Main Data Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: item.height }}
                                transition={{ duration: 1, delay: index * 0.05, ease: [0.33, 1, 0.68, 1] }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-2xl relative shadow-lg shadow-indigo-200/50 group-hover/bar:shadow-indigo-500/30 transition-shadow duration-300"
                            >
                                {/* Gloss effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity" />

                                {/* Improved Tooltip */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl opacity-0 scale-75 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all duration-300 shadow-xl pointer-events-none z-20">
                                    {item.hours}h
                                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900" />
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 group-hover/bar:text-indigo-600 transition-colors uppercase tracking-widest">{item.day}</span>
                    </div>
                ))}
            </div>

            {/* Legend / Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Total: {totalHours}h</span>
                    </div>
                </div>
                <span>Average: {averageHours}h / day</span>
            </div>
        </div>
    );
}
