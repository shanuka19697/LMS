"use client";

import { motion } from "framer-motion";
import { Play, Clock, Video } from "lucide-react";
import Image from "next/image";

interface VideoCardProps {
    video: {
        name: string;
        imageUrl: string;
        shortDescription: string;
        duration: string;
        videoUrl: string;
    };
}

export default function VideoCard({ video }: VideoCardProps) {
    // Robust URL validation for Next.js Image component
    const getSafeImageUrl = (url: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return "/placeholder-lesson.jpg";
        try {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return "/placeholder-lesson.jpg";
        } catch (e) {
            return "/placeholder-lesson.jpg";
        }
    };

    const safeImageUrl = getSafeImageUrl(video.imageUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden flex flex-col transition-all duration-500"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={safeImageUrl}
                    alt={video.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-0 group-hover:scale-100 transition-transform duration-500">
                        <Play size={20} className="text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Duration Label - Left Side (Green) */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                        <Clock size={10} className="text-white" />
                        <span className="text-[10px] font-black tracking-widest text-white">{video.duration || "10:00"}</span>
                    </div>
                </div>

                {/* Video Label - Right Side (Red) */}
                <div className="absolute bottom-3 right-3">
                    <div className="bg-rose-500/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                        <Video size={10} className="text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Video</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
                <h4 className="text-lg font-black font-heading text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {video.name}
                </h4>
                <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">
                    {video.shortDescription}
                </p>
            </div>
        </motion.div>
    );
}
