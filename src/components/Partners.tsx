"use client";

import { motion } from "framer-motion";
import { Hexagon, Triangle, Circle, Box, Layers, Command } from "lucide-react";

const Partners = () => {
    const partners = [
        { name: "TechCorp", icon: Hexagon },
        { name: "DesignLab", icon: Triangle },
        { name: "EduFuture", icon: Circle },
        { name: "InnovateX", icon: Box },
        { name: "CloudScale", icon: Layers },
        { name: "NextGen", icon: Command },
    ];

    // Duplicate for seamless loop
    const marqueePartners = [...partners, ...partners, ...partners];

    return (
        <section className="py-12 bg-white/50 border-b border-gray-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest font-heading">Trusted by industry leaders</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-16 items-center whitespace-nowrap py-4"
                    animate={{ x: [0, -1035] }} // Adjust based on content width
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Speed of scroll
                    }}
                >
                    {marqueePartners.map((partner, index) => (
                        <div key={index} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <partner.icon className="w-8 h-8 text-gray-800" strokeWidth={2.5} />
                            <span className="text-xl font-bold font-heading text-gray-800">{partner.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Partners;
