"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-red-50 -z-20" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />
            <div className="absolute inset-0 bg-noise opacity-[0.03] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-sm font-semibold text-blue-600 mb-2"
                        >
                            ✨ Transform your future today
                        </motion.div>

                        <h1 className="text-6xl lg:text-7xl font-bold font-heading leading-[1.1] text-gray-900 tracking-tight">
                            Unlock Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Creative</span> Potential.
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Experience a modern learning environment designed to inspire.
                            Join a community of <span className="text-gray-900 font-semibold">20,000+</span> students mastering new skills.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/login"
                                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                Go to Dashboard
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-100/50">
                            <div className="text-center lg:text-left">
                                <p className="text-3xl font-bold font-heading text-gray-900">2k+</p>
                                <p className="text-sm text-gray-500">Active Students</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div className="text-center lg:text-left">
                                <p className="text-3xl font-bold font-heading text-gray-900">500+</p>
                                <p className="text-sm text-gray-500">Video Courses</p>
                            </div>
                        </div>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2, type: "spring" }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-red-500/30 rounded-full blur-[80px] animate-pulse-slow" />
                            <Image
                                src="/images/hero.png"
                                alt="Learning Illustration"
                                fill
                                className="object-contain relative z-10 drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                                priority
                            />
                        </div>

                        {/* Floating Glass Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute top-0 right-0 lg:-right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-blue-500/10 border border-white/40 z-20 max-w-[150px]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                                <span className="text-xs font-bold text-gray-800">Course Completed</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-0 lg:-left-8 bg-white/90 backdrop-blur-md p-4 pr-8 rounded-2xl shadow-xl shadow-red-500/10 border border-white/40 z-20 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                A+
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Grade Average</p>
                                <p className="text-lg font-bold text-gray-900">Top 10%</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
};

export default Hero;
