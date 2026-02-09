"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LessonCardProps {
    lesson: any;
}

const typeStyles: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    THEORY: { label: "Theory", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    REVISION: { label: "Revision", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    PAPER_CLASS: { label: "Paper Class", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
    LESSON_PACK: { label: "Lesson Pack", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
};

export default function LessonCard({ lesson }: LessonCardProps) {
    const style = typeStyles[lesson.type] || typeStyles.THEORY;

    // Robust URL validation for Next.js Image component
    const getSafeImageUrl = (url: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return "/placeholder-lesson.jpg";
        try {
            // Check if it's a valid absolute URL or a relative path
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return "/placeholder-lesson.jpg";
        } catch (e) {
            return "/placeholder-lesson.jpg";
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Type Label - Left Side */}
                <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 ${style.bg}/80 ${style.text}`}>
                        <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
                    </div>
                </div>

                {/* Price Label - Right Side */}
                <div className="absolute top-4 right-4">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                        <span className="text-gray-900 font-black text-sm">Rs: {lesson.price.toLocaleString()}</span>
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
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold text-gray-900">4.9 (124)</span>
                    </div>

                    {lesson.purchases?.[0]?.status === "APPROVED" ? (
                        <Link
                            href={`/dashboard/lesson-store/${lesson.id}`}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors group/btn"
                        >
                            Enrolled
                            <div className="p-2 bg-emerald-50 rounded-xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all">
                                <CheckCircle2 className="w-3 h-3" />
                            </div>
                        </Link>
                    ) : lesson.purchases?.[0]?.status === "PENDING" ? (
                        <Link
                            href={`/dashboard/lesson-store/${lesson.id}`}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
                        >
                            Pending
                            <div className="p-2 bg-amber-50 rounded-xl animate-pulse">
                                <Clock className="w-3 h-3" />
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href={`/dashboard/lesson-store/${lesson.id}`}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-indigo-600 transition-colors group/btn"
                        >
                            Enroll Now
                            <div className="p-2 bg-gray-50 rounded-xl group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-all">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
