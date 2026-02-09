"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { loginStudent, getSession } from "@/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/ToastProvider";

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [indexNumber, setIndexNumber] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await loginStudent(indexNumber, password);

            if (result.success) {
                showToast("Login successful! Welcome back.", "success");
                window.location.href = "/dashboard";
            } else {
                setIsLoading(false);
                showToast(result.error || "Invalid credentials", "error");
            }
        } catch (error) {
            setIsLoading(false);
            showToast("Connection error occurred.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[450px] relative z-10"
            >
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6 rotate-3 hover:rotate-6 transition-transform">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold font-heading text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-500 font-medium">Please sign in to your dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-500/5 relative group">
                    <form onSubmit={handleLogin} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Index Number</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-500 transition-colors">
                                    <Fingerprint className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={indexNumber}
                                    onChange={(e) => setIndexNumber(e.target.value)}
                                    placeholder="e.g. 0525XXXX"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Forgot?</Link>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl shadow-gray-200 hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70"
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>Enter Dashboard</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-10 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        &copy; 2026 Horizon Tech LMS &bull; Secure Access
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
