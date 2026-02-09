"use client";

import { Video, Calendar, Clock, Lock, ArrowRight, AlertCircle, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function ZoomMeetingCard({ meeting }: { meeting: any }) {
    const [isAppNotInstalled, setIsAppNotInstalled] = useState(false);
    const [isAttempting, setIsAttempting] = useState(false);

    const startTime = new Date(meeting.startTime);
    const isToday = new Date().toDateString() === startTime.toDateString();

    const appLink = meeting.meetingId
        ? `zoommtg://zoom.us/join?confno=${meeting.meetingId}${meeting.meetingPassword ? `&pwd=${encodeURIComponent(meeting.meetingPassword)}` : ''}`
        : meeting.zoomLink;

    const handleJoin = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAppNotInstalled(false);
        setIsAttempting(true);

        // Attempt to open the app via custom protocol
        window.location.assign(appLink);

        // Heuristic: If we are still focused after 3s, the app likely isn't installed
        const timeout = setTimeout(() => {
            setIsAttempting(false);
            setIsAppNotInstalled(true);
        }, 3000);

        // If the window loses focus (app opened/dialog showed up), the app is likely there
        const handleBlur = () => {
            clearTimeout(timeout);
            setIsAttempting(false);
            window.removeEventListener('blur', handleBlur);
        };

        window.addEventListener('blur', handleBlur);

        // Also cleanup listener if user stays on page
        setTimeout(() => window.removeEventListener('blur', handleBlur), 5000);
    };

    return (
        <div className="group relative bg-white rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Active Indicator Pulse */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live Class</span>
            </div>

            <div className="p-8 pb-0 flex-1">
                {/* Icon Area */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Video className="text-white" size={32} />
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-black font-heading text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                            {meeting.name}
                        </h3>
                        <p className="text-slate-500 font-medium line-clamp-2">
                            {meeting.shortDescription}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 py-4 border-t border-dashed border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                            <Calendar size={16} className="text-indigo-500" />
                            {format(startTime, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                            <Clock size={16} className="text-indigo-500" />
                            {format(startTime, "h:mm a")}
                        </div>
                    </div>
                </div>
            </div>

            {/* Credential Section (Only if available) */}
            {(meeting.meetingId || meeting.meetingPassword) && (
                <div className="px-8 py-3 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 font-mono space-y-1">
                    {meeting.meetingId && <div className="flex justify-between"><span>Meeting ID:</span> <span className="font-bold text-slate-700 select-all">{meeting.meetingId}</span></div>}
                    {meeting.meetingPassword && <div className="flex justify-between"><span>Passcode:</span> <span className="font-bold text-slate-700 select-all">{meeting.meetingPassword}</span></div>}
                </div>
            )}

            {/* App Not Found Warning */}
            {isAppNotInstalled && (
                <div className="mx-8 mb-6 p-5 bg-amber-50 rounded-[1.5rem] border border-amber-200 animate-in zoom-in-95 duration-300">
                    <div className="flex gap-4">
                        <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0 h-fit">
                            <AlertCircle className="text-amber-600" size={24} />
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-amber-900 leading-tight">Zoom App not detected?</h4>
                                <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                                    It looks like the Zoom application didn't open automatically. You can join via your browser or download the app.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                <a
                                    href={meeting.zoomLink}
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-800 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
                                >
                                    <ExternalLink size={14} /> Join via Browser
                                </a>
                                <a
                                    href="https://zoom.us/download"
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-700 active:scale-95 transition-all shadow-sm shadow-amber-200"
                                >
                                    <Download size={14} /> Get Zoom App
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Footer */}
            <div className="p-4 bg-slate-50/50 mt-auto">
                <button
                    onClick={handleJoin}
                    disabled={isAttempting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:translate-y-[-2px] group/btn"
                >
                    <Video size={20} />
                    <span>{isAttempting ? "Opening Zoom..." : "Join Live Class"}</span>
                    {!isAttempting && <ArrowRight size={18} className="opacity-70 group-hover/btn:translate-x-1 transition-transform" />}
                </button>
            </div>
        </div>
    );
}
