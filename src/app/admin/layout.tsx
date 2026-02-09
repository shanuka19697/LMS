"use client";

import { useState, useEffect } from "react";
import { getAdminSession, logoutAdmin, getAdminRole } from "@/actions/admin";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    FileText,
    BookOpen,
    Video,
    CreditCard,
    BarChart2,
    Bell,
    MessageSquare,
    MessageCircle,
    LogOut,
    Menu,
    X,
    Search,
    ShieldCheck,
    ChevronRight,
    Files,
    Calendar,
    Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NoticeBoard from "@/components/dashboard/NoticeBoard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        const checkSession = async () => {
            if (isLoginPage) {
                setIsLoading(false);
                return;
            }
            const session = await getAdminSession();
            const fetchedRole = await getAdminRole();
            setRole(fetchedRole);

            if (!session) {
                router.push("/admin/login");
            } else {
                setIsLoading(false);
            }
        };
        checkSession();
    }, [isLoginPage, router]);

    if (isLoginPage) return <>{children}</>;
    if (isLoading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
            />
        </div>
    );

    const allNavItems = [
        { name: "Students", icon: Users, href: "/admin/students", roles: ["SUPER_ADMIN"] },
        { name: "Papers", icon: Files, href: "/admin/papers", roles: ["SUPER_ADMIN", "PAPER_ADMIN"] },
        { name: "Paper Marks", icon: FileText, href: "/admin/paper-marks", roles: ["SUPER_ADMIN", "PAPER_ADMIN"] },
        { name: "Lesson Packs", icon: BookOpen, href: "/admin/lessons", roles: ["SUPER_ADMIN"] },
        { name: "Video Items", icon: Video, href: "/admin/videos", roles: ["SUPER_ADMIN"] },
        { name: "Zoom Meetings", icon: Video, href: "/admin/zoom", roles: ["SUPER_ADMIN"] },
        { name: "Daily Performance", icon: BarChart2, href: "/admin/performance", roles: ["SUPER_ADMIN"] },
        { name: "Notifications", icon: Bell, href: "/admin/notifications", roles: ["SUPER_ADMIN"] },
        { name: "Notice Board", href: "/admin/notices", icon: Megaphone, roles: ["SUPER_ADMIN"] },
        { name: "Messages", href: "/admin/messages", icon: MessageCircle, roles: ["SUPER_ADMIN", "MESSAGE_ADMIN"] },
        { name: "Payments", href: "/admin/sales", icon: CreditCard, roles: ["SUPER_ADMIN"] },
        { name: "Exam Years", href: "/admin/exam-years", icon: Calendar, roles: ["SUPER_ADMIN"] },
        { name: "Admin Management", href: "/admin/admins", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
    ];

    const navItems = allNavItems.filter(item => role && (item.roles.includes(role) || role === "SUPER_ADMIN"));

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'} hidden md:block`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <ShieldCheck className="text-white shrink-0" size={24} />
                            </div>
                            {isSidebarOpen && (
                                <span className="font-black text-xl text-slate-900 tracking-tight">
                                    LMS<span className="text-indigo-600">.Admin</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {item.icon && <item.icon size={22} className={isActive ? 'text-indigo-600' : 'group-hover:scale-110 transition-transform'} />}
                                    {isSidebarOpen && <span className="font-bold text-[15px]">{item.name}</span>}
                                    {isActive && isSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={() => logoutAdmin()}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
                        >
                            <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                            {isSidebarOpen && <span className="font-bold text-[15px]">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-72' : 'md:pl-20'}`}>
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 md:block hidden"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 hidden sm:block">
                            Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-2" />
                            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                                    AD
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-bold text-slate-950 leading-none capitalize">
                                        {role?.toLowerCase().replace('_', ' ')}
                                    </p>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                                        {pathname.split('/').pop()?.replace('-', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
