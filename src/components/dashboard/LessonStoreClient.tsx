"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LessonCard from "./LessonCard";
import { LayoutGrid, Filter, Info } from "lucide-react";

interface LessonStoreClientProps {
    initialLessons: any[];
}

const filterTypes = [
    { id: "ALL", label: "All Lessons" },
    { id: "THEORY", label: "Theory" },
    { id: "REVISION", label: "Revision" },
    { id: "PAPER_CLASS", label: "Paper Class" },
    { id: "LESSON_PACK", label: "Lesson Packs" },
];

export default function LessonStoreClient({ initialLessons }: LessonStoreClientProps) {
    const [activeFilter, setActiveFilter] = useState("ALL");

    const filteredLessons = initialLessons.filter(lesson =>
        activeFilter === "ALL" || lesson.type === activeFilter
    );

    return (
        <div className="space-y-12">
            {/* Filter Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-2">
                <div className="flex items-center gap-4 bg-gray-100/50 p-2 rounded-3xl border border-gray-200/50 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {filterTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveFilter(type.id)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${activeFilter === type.id
                                    ? "bg-white text-gray-900 shadow-md transform scale-105"
                                    : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="text-sm font-bold">{filteredLessons.length} Lessons Available</span>
                </div>
            </div>

            {/* Lesson Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredLessons.map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredLessons.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200"
                >
                    <div className="inline-flex p-8 bg-white rounded-[2.5rem] shadow-sm text-gray-300 mb-6">
                        <Info size={40} />
                    </div>
                    <h3 className="text-2xl font-black font-heading text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto">
                        We couldn't find any lessons matching your current filter in your exam year. Try another category!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
