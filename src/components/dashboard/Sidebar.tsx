"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FileText, ShoppingBag, CreditCard, User, HelpCircle, LogOut, Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutStudent } from "@/actions/auth";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Class", href: "/dashboard/my-class", icon: BookOpen },
        { name: "Notice Board", href: "/dashboard/notices", icon: MessageSquare },
        { name: "Paper Marks", href: "/dashboard/paper-marks", icon: FileText },
        { name: "Lesson Store", href: "/dashboard/lesson-store", icon: ShoppingBag },
        { name: "Payment", href: "/dashboard/payment", icon: CreditCard },
    ];

    const bottomNavItems = [
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "Help", href: "/dashboard/help", icon: HelpCircle },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm md:shadow-none">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between h-20">
                <Link href="/" className="text-2xl font-bold font-heading text-gray-900 flex items-center gap-1">
                    LMS<span className="text-primary">.</span>
                </Link>
                <button className="md:hidden" onClick={onClose}>
                    <X className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose()} // Auto-close on mobile click
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-indigo-50 text-indigo-600 shadow-sm font-semibold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                    }`}
                            />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="my-4 h-px bg-slate-100" />

                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                    }`}
                            />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => logoutStudent()}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-black uppercase tracking-widest text-xs shadow-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout Now</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Static relative position to flow with flex layout */}
            <aside className="hidden md:block w-64 h-full bg-white z-30 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-80 z-[110] bg-white/90 backdrop-blur-2xl shadow-3xl border-r border-white/40"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
