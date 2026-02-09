"use client";

import { motion } from "framer-motion";
import { Play, Clock, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface VideoItemCardProps {
    video: any;
    lessonId: string;
    index: number;
}

export default function VideoItemCard({ video, lessonId, index }: VideoItemCardProps) {
    const getSafeImageUrl = (url: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return "/images/course_design.png"; // Fallback to a valid image if possible
        try {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return "/images/course_design.png";
        } catch (e) {
            return "/images/course_design.png";
        }
    };

    const safeImageUrl = getSafeImageUrl(video.imageUrl);
    const isLocked = false; // Placeholder for future logic

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-8 md:pl-0"
        >
            {/* Timeline Line (Mobile/Tablet only for now or global via CSS) */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-gray-100">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-500" />
            </div>

            <Link href={`/dashboard/my-class/${lessonId}/${video.videoItemID}`}>
                <div
                    className="relative bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col md:flex-row gap-6 group-hover:-translate-y-1 overflow-hidden"
                >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/30 to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Thumbnail */}
                    <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                        <Image
                            src={safeImageUrl}
                            alt={video.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl transform scale-90 group-hover:scale-110 transition-all duration-500">
                                {isLocked ? <Lock size={20} /> : <Play size={20} className="fill-current ml-1" />}
                            </div>
                        </div>
                        {video.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1">
                                <Clock size={10} />
                                {video.duration}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center py-2 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black border border-indigo-100">
                                {index + 1}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Video Lesson</span>
                        </div>

                        <h3 className="text-xl font-black font-heading text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                            {video.name}
                        </h3>

                        <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-4 md:mb-0 max-w-2xl">
                            {video.shortDescription || "No description available for this lesson."}
                        </p>
                    </div>

                    {/* Action Button (Desktop) */}
                    <div className="hidden md:flex flex-col justify-center items-end pr-4">
                        <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
