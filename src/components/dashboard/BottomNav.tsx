"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, MessageSquare, User, HelpCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { logoutStudent } from "@/actions/auth";

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-600", glow: "shadow-blue-400/30" },
        { name: "Class", href: "/dashboard/my-class", icon: BookOpen, color: "text-emerald-600", glow: "shadow-emerald-400/30" },
        { name: "Notices", href: "/dashboard/notices", icon: MessageSquare, color: "text-amber-600", glow: "shadow-amber-400/30" },
        { name: "Support", href: "/dashboard/help", icon: HelpCircle, color: "text-purple-600", glow: "shadow-purple-400/30" },
        { name: "Profile", href: "/dashboard/profile", icon: User, color: "text-indigo-600", glow: "shadow-indigo-400/30" },
        { name: "Logout", href: "#", icon: LogOut, action: logoutStudent, color: "text-rose-600", glow: "shadow-rose-400/30" },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-50">
            <nav className="bg-white/80 backdrop-blur-3xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-1.5 ring-1 ring-black/5">
                <div className="flex items-center justify-between relative px-2">
                    {navItems.map((item) => {
                        const isActive = item.href !== "#" && pathname === item.href;

                        const Content = () => (
                            <div className="relative flex flex-col items-center py-1">
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    animate={isActive ? {
                                        y: -4,
                                        scale: 1.15,
                                    } : { y: 0, scale: 1 }}
                                    className={`p-2 transition-all duration-300 relative z-10 ${isActive
                                            ? `${item.color} drop-shadow-[0_0_8px_currentColor]`
                                            : 'text-slate-400 opacity-60'
                                        }`}
                                >
                                    <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                </motion.div>
                                <span className={`text-[8.5px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${isActive
                                        ? `${item.color} opacity-100`
                                        : 'text-slate-400 opacity-50'
                                    }`}>
                                    {item.name}
                                </span>
                            </div>
                        );

                        if (item.action) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => item.action!()}
                                    className="flex-1 flex flex-col items-center justify-center group"
                                >
                                    <Content />
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex-1 flex flex-col items-center justify-center group relative"
                            >
                                <Content />
                                {isActive && (
                                    <motion.div
                                        layoutId="premiumNavIndicator"
                                        className={`absolute -bottom-1 w-1.5 h-1.5 ${item.color.replace('text', 'bg')} rounded-full shadow-[0_0_12px_currentColor]`}
                                        transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default BottomNav;
