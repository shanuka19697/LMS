"use client";

import { useState, useEffect } from "react";
import { Bell, AlertTriangle, CreditCard, Info, Check, X } from "lucide-react";
import { getStudentNotifications, markNotificationAsRead } from "@/actions/notification";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";

export default function NotificationCenter({ studentIndex }: { studentIndex: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!studentIndex) return;
        fetchNotifications();
        // Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [studentIndex]);

    async function fetchNotifications() {
        const data = await getStudentNotifications(studentIndex);
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
    }

    async function handleMarkRead(id: string) {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await markNotificationAsRead(id);
    }

    function getIcon(type: string) {
        switch (type) {
            case 'WARNING': return <AlertTriangle size={18} className="text-red-500" />;
            case 'PAYMENT': return <CreditCard size={18} className="text-amber-500" />;
            default: return <Info size={18} className="text-blue-500" />;
        }
    }

    function getBgColor(type: string, isRead: boolean) {
        if (isRead) return "bg-white";
        switch (type) {
            case 'WARNING': return "bg-red-50";
            case 'PAYMENT': return "bg-amber-50";
            default: return "bg-blue-50";
        }
    }

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button className="relative w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100 transition-all outline-none">
                    <Bell size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md animate-bounce">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="w-[380px] bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 p-2 z-[100] animate-in fade-in zoom-in-95 duration-200 mr-4"
                    sideOffset={10}
                    align="end"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 mb-2">
                        <h3 className="font-heading font-black text-slate-900">Notifications</h3>
                        <span className="text-xs font-bold text-slate-400">{notifications.length} Total</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-1">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-2xl border border-transparent transition-all group relative ${getBgColor(notification.type, notification.isRead)} hover:border-slate-100`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-slate-100 grayscale opacity-50' : 'bg-white shadow-sm'}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${notification.isRead ? 'text-slate-500 font-medium' : 'text-slate-900 font-bold'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">
                                                {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                    </div>

                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMarkRead(notification.id); }}
                                            className="absolute top-2 right-2 p-1.5 rounded-full text-indigo-500 hover:bg-indigo-100 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-slate-400">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">No details available</p>
                            </div>
                        )}
                    </div>

                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
