"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Lock, ShieldCheck, ArrowLeft,
    Loader2, KeyRound, Key, RefreshCcw,
    ShieldAlert, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { changeStudentPassword } from "@/actions/student";
import { getSession, logoutStudent } from "@/actions/auth";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [studentIndex, setStudentIndex] = useState("");
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const index = await getSession();
            if (!index) {
                router.push("/login");
                return;
            }
            setStudentIndex(index);
        };
        checkAuth();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        const result = await changeStudentPassword(
            studentIndex,
            formData.oldPassword,
            formData.newPassword
        );

        if (result.success) {
            setShowSuccess(true);
        } else {
            setError(result.error || "An error occurred.");
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutStudent();
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(async () => {
                await logoutStudent();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <Link
                    href="/dashboard/profile"
                    className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Account Security</h1>
                    <p className="text-gray-500 text-sm">Update your password to keep your account safe.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 relative overflow-hidden"
            >
                {/* Visual Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 mb-2">
                        <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Status</p>
                            <p className="text-sm font-bold text-indigo-900 leading-none">Your connection is encrypted</p>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold"
                        >
                            <ShieldAlert size={18} />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <SecurityInput
                            icon={<Key size={20} />}
                            label="Current Password"
                            type="password"
                            value={formData.oldPassword}
                            onChange={(v: string) => updateField("oldPassword", v)}
                        />

                        <div className="h-px bg-gray-100 my-2" />

                        <SecurityInput
                            icon={<KeyRound size={20} />}
                            label="New Password"
                            type="password"
                            value={formData.newPassword}
                            onChange={(v: string) => updateField("newPassword", v)}
                        />

                        <SecurityInput
                            icon={<RefreshCcw size={20} />}
                            label="Confirm New Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(v: string) => updateField("confirmPassword", v)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || showSuccess}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-bold rounded-[1.5rem] shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating Security...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Update Password
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Your safety is our priority
                    </p>
                </form>
            </motion.div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/20 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Password Changed!</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Your security credentials have been updated successfully. Redirecting you to login...
                            </p>

                            <div className="flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface SecurityInputProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (val: string) => void;
    type: string;
}

function SecurityInput({ icon, label, value, onChange, type }: SecurityInputProps) {
    return (
        <div className="space-y-2 group">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                {label}
            </label>
            <div className="relative flex items-center">
                <div className="absolute left-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    className="w-full pl-14 pr-4 py-5 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all text-gray-700 font-medium placeholder-gray-300"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    );
}
