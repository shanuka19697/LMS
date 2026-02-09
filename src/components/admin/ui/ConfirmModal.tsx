
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, CheckCircle, X, HelpCircle } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "success" | "info";
    isLoading?: boolean;
    children?: React.ReactNode;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
    children
}: ConfirmModalProps) {

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const variants = {
        danger: {
            icon: Trash2,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            buttonBg: "bg-red-600 hover:bg-red-700",
            titleColor: "text-red-600"
        },
        warning: {
            icon: AlertTriangle,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500",
            buttonBg: "bg-amber-600 hover:bg-amber-700",
            titleColor: "text-amber-700"
        },
        success: {
            icon: CheckCircle,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-500",
            buttonBg: "bg-emerald-600 hover:bg-emerald-700",
            titleColor: "text-emerald-700"
        },
        info: {
            icon: HelpCircle,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500",
            buttonBg: "bg-indigo-600 hover:bg-indigo-700",
            titleColor: "text-indigo-700"
        }
    };

    const currentVariant = variants[variant];
    const Icon = currentVariant.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] grid place-items-center p-4 overflow-y-auto"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <div className={`w-20 h-20 rounded-full ${currentVariant.iconBg} mx-auto flex items-center justify-center mb-6`}>
                                    <Icon className={`w-10 h-10 ${currentVariant.iconColor}`} />
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-3 font-heading">
                                    {title}
                                </h3>

                                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                    {description}
                                </p>

                                {children && (
                                    <div className="mb-8">
                                        {children}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="py-3.5 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`py-3.5 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${currentVariant.buttonBg}`}
                                    >
                                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
