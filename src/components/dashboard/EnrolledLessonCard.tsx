"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EnrolledLessonCardProps {
    lesson: any;
}

const typeStyles: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    THEORY: { label: "Theory", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    REVISION: { label: "Revision", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    PAPER_CLASS: { label: "Paper Class", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
    LESSON_PACK: { label: "Lesson Pack", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
};

export default function EnrolledLessonCard({ lesson }: EnrolledLessonCardProps) {
    const style = typeStyles[lesson.type] || typeStyles.THEORY;

    const getSafeImageUrl = (url: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return "/images/course_design.png";
        try {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return "/images/course_design.png";
        } catch (e) {
            return "/images/course_design.png";
        }
    };

    const safeImageUrl = getSafeImageUrl(lesson.imageUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col transition-all duration-500"
        >
            {/* Image Container 16:9 */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={safeImageUrl}
                    alt={lesson.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <PlayCircle className="text-white w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
                </div>

                {/* Type Label - Left Side */}
                <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 ${style.bg}/80 ${style.text}`}>
                        <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-indigo-600 mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">A/L {lesson.examYear}</span>
                </div>

                <h3 className="text-2xl font-black font-heading text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {lesson.name}
                </h3>

                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {lesson.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            Enrolled
                        </div>
                    </div>

                    <Link
                        href={`/dashboard/my-class/${lesson.id}`}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-indigo-600 transition-colors group/btn"
                    >
                        Watch Now
                        <div className="p-2 bg-gray-50 rounded-xl group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-all">
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
