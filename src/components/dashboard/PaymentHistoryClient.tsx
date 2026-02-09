"use client";

import { motion } from "framer-motion";
import {
    Clock,
    Calendar,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowUpRight,
    Search,
    BookOpen,
    CreditCard
} from "lucide-react";
import { useState } from "react";

interface PaymentHistoryClientProps {
    initialPurchases: any[];
}

const statusStyles = {
    PENDING: {
        label: "Pending Verification",
        bg: "bg-amber-50 text-amber-700 border-amber-100",
        dot: "bg-amber-500",
        icon: AlertCircle
    },
    APPROVED: {
        label: "Enrolled",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500",
        icon: CheckCircle2
    },
    REJECTED: {
        label: "Rejected",
        bg: "bg-rose-50 text-rose-700 border-rose-100",
        dot: "bg-rose-500",
        icon: XCircle
    }
};

export default function PaymentHistoryClient({ initialPurchases }: PaymentHistoryClientProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPurchases = initialPurchases.filter(p =>
        p.lesson?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-md group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by lesson name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold transition-all"
                />
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 gap-4">
                {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase, index) => {
                        const style = statusStyles[purchase.status as keyof typeof statusStyles] || statusStyles.PENDING;
                        const date = new Date(purchase.createdAt);
                        const StatusIcon = style.icon;

                        return (
                            <motion.div
                                key={purchase.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8"
                            >
                                {/* Icon/Thumbnail */}
                                <div className="hidden md:flex w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <BookOpen size={24} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transaction #{purchase.id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <h3 className="text-xl font-black font-heading text-gray-900 line-clamp-1">{purchase.lesson?.name}</h3>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                            <Calendar size={14} />
                                            <span>{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                            <Clock size={14} />
                                            <span>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                                    <div className="text-2xl font-black font-heading text-gray-900 tracking-tight">
                                        Rs: {purchase.totalPrice.toLocaleString()}
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${style.bg}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
                                        <StatusIcon size={12} className="md:hidden lg:block" />
                                        {style.label}
                                    </div>
                                </div>

                                {/* View Detail Pin (Optional Link) */}
                                <div className="hidden lg:flex p-3 bg-gray-50 rounded-xl text-gray-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <ArrowUpRight size={20} />
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="inline-flex p-8 bg-white rounded-[2.5rem] shadow-sm text-gray-300 mb-6">
                            <CreditCard size={40} />
                        </div>
                        <h3 className="text-2xl font-black font-heading text-gray-900 mb-2">No Transactions Found</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">
                            You haven't made any purchases yet. Your enrolled lesson packs will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
