"use client";

import { motion } from "framer-motion";
import {
    Trophy, Award, TrendingUp,
    FileText, Clock, Sparkles,
    ChevronRight, Info
} from "lucide-react";
import PaperAnalyticsChart from "@/components/dashboard/PaperAnalyticsChart";

interface PaperMarksClientProps {
    papers: any[];
}

export default function PaperMarksClient({ papers }: PaperMarksClientProps) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case "FULL":
                return {
                    bg: "bg-indigo-50/50",
                    border: "border-indigo-100",
                    text: "text-indigo-600",
                    accent: "bg-indigo-600",
                    shadow: "shadow-indigo-100",
                    iconColor: "text-indigo-500"
                };
            case "TIMING":
                return {
                    bg: "bg-emerald-50/50",
                    border: "border-emerald-100",
                    text: "text-emerald-600",
                    accent: "bg-emerald-600",
                    shadow: "shadow-emerald-100",
                    iconColor: "text-emerald-500"
                };
            case "FINAL":
                return {
                    bg: "bg-rose-50/50",
                    border: "border-rose-100",
                    text: "text-rose-600",
                    accent: "bg-rose-600",
                    shadow: "shadow-rose-100",
                    iconColor: "text-rose-500"
                };
            default:
                return {
                    bg: "bg-gray-50/50",
                    border: "border-gray-100",
                    text: "text-gray-600",
                    accent: "bg-gray-600",
                    shadow: "shadow-gray-100",
                    iconColor: "text-gray-500"
                };
        }
    };

    // Prep chart data
    const chartData = (papers || [])
        .filter(p => p.type === "FULL" || p.type === "FINAL" || p.type === "TIMING")
        .slice(0, 8)
        .reverse()
        .map(p => ({
            name: p.paperName,
            full: p.type === "FULL" ? p.totalMark : 0,
            final: p.type === "FINAL" ? p.totalMark : 0,
            timing: p.type === "TIMING" ? p.totalMark : 0
        }));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Academic Analytics</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 leading-tight">
                        Paper <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">Marks</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium mt-2">Track your progress and analyze exam performance.</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <PaperAnalyticsChart data={chartData} />
                </div>
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between min-h-[250px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black font-heading leading-tight">Keep Pushing Higher</h3>
                            <p className="mt-2 text-indigo-100/80 font-medium">Your average score has increased by 12% this month.</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black font-heading text-gray-900">Recent Records</h2>
                    <div className="flex gap-2">
                        {["FULL", "TIMING", "FINAL"].map(type => (
                            <div key={type} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                                <div className={`w-2 h-2 rounded-full ${getTypeStyles(type).accent}`} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((paper, idx) => {
                        const styles = getTypeStyles(paper.type);
                        return (
                            <motion.div
                                key={paper.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group p-6 rounded-[2rem] border transition-all hover:shadow-xl ${styles.bg} ${styles.border} ${styles.shadow}/30`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-3 rounded-2xl bg-white shadow-sm ${styles.text}`}>
                                        {paper.type === "FULL" ? <FileText size={20} /> : paper.type === "TIMING" ? <Clock size={20} /> : <Award size={20} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white shadow-sm ${styles.text}`}>
                                        {paper.type} Paper
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold font-heading text-gray-900 mb-2 truncate">{paper.paperName}</h4>

                                <div className="space-y-4 py-4">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-500">First Paper</span>
                                        <span className="text-gray-900">{paper.firstMark || 0}</span>
                                    </div>
                                    {paper.type !== 'TIMING' && (
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-500">Second Paper</span>
                                            <span className="text-gray-900">{paper.secondMark || 0}</span>
                                        </div>
                                    )}
                                    <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2`} />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Marks</span>
                                        <span className={`text-2xl font-black font-heading ${styles.text}`}>{paper.totalMark}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-bold">{new Date(paper.createdAt).toLocaleDateString()}</span>
                                    <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {papers.length === 0 && (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <div className="inline-flex p-6 bg-white rounded-[2rem] shadow-sm text-gray-300 mb-4">
                            <Info size={32} />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-gray-900">No records found</h3>
                        <p className="text-gray-500 font-medium">Paper results will appear here once recorded by the admin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
