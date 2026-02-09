"use client";

import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";


import { ArrowRight, Calendar, ExternalLink, Info, MessageSquare } from "lucide-react";

export default function NoticeBoard({ notices, compact = false }: { notices: any[], compact?: boolean }) {
    if (notices.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center ${compact ? 'py-10' : 'py-20'} bg-white rounded-3xl border border-dashed border-slate-200`}>
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Info size={24} className="text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No New Notices</h3>
                <p className="text-xs text-slate-500">Check back later.</p>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                            <MessageSquare size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 font-heading">Notice Board</h2>
                    </div>
                    <Link href="/dashboard/notices" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="space-y-4 relative z-10">
                    {notices.slice(0, 3).map((notice) => (
                        <div key={notice.id} className="group p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-colors border border-transparent hover:border-indigo-100">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight group-hover:text-indigo-700 transition-colors">
                                    {notice.title}
                                </h3>
                                <span className="text-[10px] font-medium text-slate-400 shrink-0 bg-white px-2 py-1 rounded-full border border-slate-100">
                                    {format(new Date(notice.createdAt), "MMM d")}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                {notice.description}
                            </p>
                            {notice.link && (
                                <a
                                    href={notice.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:underline"
                                >
                                    <ExternalLink size={10} /> Link Attached
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    {/* Optional Image */}
                    {notice.imageUrl ? (
                        <div className="h-48 relative w-full bg-slate-100 overflow-hidden">
                            <img
                                src={notice.imageUrl}
                                alt={notice.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    ) : (
                        <div className="h-24 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-b border-slate-100">
                            <MessageSquare className="text-indigo-200" size={48} />
                        </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Notice
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                <Calendar size={12} />
                                {format(new Date(notice.createdAt), "MMMM d, yyyy")}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading leading-tight group-hover:text-indigo-600 transition-colors">
                            {notice.title}
                        </h3>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 whitespace-pre-wrap">
                            {notice.description}
                        </p>

                        {notice.link && (
                            <a
                                href={notice.link}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                                <ExternalLink size={16} />
                                Open Link
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
