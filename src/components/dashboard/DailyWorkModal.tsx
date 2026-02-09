"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Clock, CheckCircle2, X, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { logDailyWorkTime } from "@/actions/student";
import { useToast } from "@/components/ui/ToastProvider";

interface DailyWorkModalProps {
    studentIndex: string;
    onClose: () => void;
}

export default function DailyWorkModal({ studentIndex, onClose }: DailyWorkModalProps) {
    const { showToast } = useToast();
    const [hours, setHours] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await logDailyWorkTime(studentIndex, hours);
            if (result.success) {
                setIsSuccess(true);
                showToast("Performance logged successfully!", "success");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                showToast(result.error || "Failed to log work time.", "error");
            }
        } catch (error) {
            showToast("Connection error occurred!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden"
                >
                    {/* Top Decor */}
                    <div className="h-1.5 md:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="p-6 md:p-10">
                        <button
                            onClick={onClose}
                            className="absolute top-4 md:top-6 right-4 md:right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <X size={18} />
                        </button>

                        {!isSuccess ? (
                            <div className="space-y-6 md:space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 md:gap-3 text-indigo-600 mb-1 md:mb-2">
                                        <div className="p-2 md:p-3 bg-indigo-50 rounded-xl md:rounded-2xl">
                                            <Clock size={20} />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Daily Progress</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black font-heading text-gray-900 leading-tight">
                                        How many hours did you study today?
                                    </h2>
                                    <p className="text-gray-500 text-sm md:text-base font-medium">Be honest with yourself, every minute counts!</p>
                                </div>

                                <div className="space-y-5 md:space-y-6">
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-3 md:mb-4">
                                            <span className="text-xs md:text-sm font-bold text-gray-400">Study Intensity</span>
                                            <span className="px-3 md:px-4 py-1 md:py-1.5 bg-indigo-600 text-white rounded-full text-base md:text-lg font-black shadow-lg shadow-indigo-200">
                                                {hours}h
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="15"
                                            step="0.5"
                                            value={hours}
                                            onChange={(e) => setHours(parseFloat(e.target.value))}
                                            className="w-full h-2 md:h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="flex justify-between mt-2 px-1 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Light</span>
                                            <span>Moderate</span>
                                            <span>Extreme</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl md:rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 md:gap-3 group disabled:opacity-70 disabled:scale-100 text-sm md:text-base"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                                Saving Record...
                                            </>
                                        ) : (
                                            <>
                                                Log My Progress
                                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-10 md:py-12 flex flex-col items-center text-center space-y-3 md:space-y-4"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 md:mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900">Great work!</h2>
                                <p className="text-gray-500 text-sm md:text-base max-w-[250px]">
                                    Your daily work time has been recorded successfully. See you tomorrow!
                                </p>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs md:text-sm bg-indigo-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full mt-3 md:mt-4">
                                    <Sparkles size={14} />
                                    <span>Streaks counting...</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
