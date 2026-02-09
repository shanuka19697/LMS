"use client";

import { Bell, Search, ChevronDown, User, FileText, HelpCircle, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutStudent } from "@/actions/auth";
import NotificationCenter from "./NotificationCenter";

interface HeaderProps {
    userName: string;
    userEmail: string;
    studentIndex: string;
    onMenuClick: () => void;
}

const Header = ({ userName, userEmail, studentIndex, onMenuClick }: HeaderProps) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = [
        { name: "My Profile", icon: User, href: "/dashboard/profile" },
        { name: "Paper Marks", icon: FileText, href: "/dashboard/paper-marks" },
        { name: "Contact Support", icon: HelpCircle, href: "/dashboard/help" },
    ];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleLogout = async () => {
        await logoutStudent();
    };

    return (
        <header className="h-16 md:h-20 bg-white/60 backdrop-blur-2xl border-b border-white/80 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between transition-all">
            {/* Mobile Menu Button - Larger touch target */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-3 -ml-2 text-slate-600 active:bg-slate-100 rounded-xl transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search courses, assignments..."
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Spacer for mobile alignment */}
            <div className="md:hidden" />

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                <div className="md:block scale-90 md:scale-100">
                    <NotificationCenter studentIndex={studentIndex} />
                </div>

                <div className="h-8 w-px bg-gray-200 hidden md:block" />

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all select-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {getInitials(userName)}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-gray-900 leading-none">{userName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Student</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30 cursor-default"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 z-40 origin-top-right"
                                >
                                    <div className="p-3 border-b border-gray-100 mb-1">
                                        <p className="text-sm font-bold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500">{userEmail}</p>
                                    </div>

                                    <div className="space-y-1">
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-1 pt-1 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
