'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, MoveLeft, Ghost } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Animated Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-20"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-20"
                />
            </div>

            <div className="max-w-md w-full relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 404 Icon/Illustration */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20 duration-1000" />
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center relative z-10">
                                <Ghost className="w-12 h-12 text-indigo-600" />
                            </div>
                        </div>
                    </motion.div>

                    <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                        404
                    </h1>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Page not found
                    </h2>

                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                    </p>

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.back()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                        >
                            <MoveLeft className="w-5 h-5" />
                            Go Back
                        </motion.button>

                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                                >
                                    <Home className="w-6 h-6 mb-1" />
                                    <span className="font-medium">Home</span>
                                </motion.div>
                            </Link>

                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                                >
                                    <LayoutDashboard className="w-6 h-6 mb-1" />
                                    <span className="font-medium">Dashboard</span>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-sm text-gray-400"
                >
                    Lost? Need help? <Link href="/contact" className="text-indigo-600 hover:underline">Contact Support</Link>
                </motion.p>
            </div>
        </div>
    );
}
