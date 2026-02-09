"use client";

import { useEffect, useState } from "react"; // Changed to client side to handle interactions easily
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { getAdminMessages, markMessageAsRead, markMessageAsReplied } from "@/actions/message";
import { format } from "date-fns";
import { RefreshCw, CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import NotificationSender from "@/components/admin/notifications/NotificationSender"; // Reusing this

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [replyingTo, setReplyingTo] = useState<any>(null);

    async function fetchMessages() {
        const data = await getAdminMessages();
        setMessages(data);
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkRead = async (id: string, currentStatus: boolean) => {
        if (!currentStatus) {
            await markMessageAsRead(id);
            fetchMessages();
        }
    }

    const handleReply = (msg: any) => {
        handleMarkRead(msg.id, msg.isRead);
        setReplyingTo(msg);
    }

    // Callback when notification is sent successfully from NotificationSender
    const handleReplySuccess = async () => {
        if (replyingTo) {
            await markMessageAsReplied(replyingTo.id);
            setReplyingTo(null);
            fetchMessages();
        }
    }

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Student Messages"
                description="Inquiries and support requests"
                actionLabel="Refresh"
                onAction={fetchMessages}
            />

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Message List */}
                <div className="lg:col-span-2 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No messages found.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`relative p-5 rounded-xl border transition-all hover:shadow-md ${msg.isRead ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'
                                    }`}
                            >
                                {!msg.isRead && (
                                    <span className="absolute top-5 right-5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}

                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-bold text-slate-900">{msg.student.firstName} {msg.student.lastName}</p>
                                        <p className="text-xs text-slate-500 font-mono">{msg.student.indexNumber}</p>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-700 mt-2 mb-4 leading-relaxed">
                                    {msg.message}
                                </p>

                                <div className="flex items-center gap-3 border-t border-slate-100/50 pt-3">
                                    <button
                                        onClick={() => handleReply(msg)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <MessageCircle size={14} /> Reply
                                    </button>

                                    {!msg.isRead && (
                                        <button
                                            onClick={() => handleMarkRead(msg.id, false)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                                        >
                                            <CheckCircle size={14} /> Mark as Read
                                        </button>
                                    )}

                                    {msg.isReplied && (
                                        <span className="ml-auto text-xs font-bold text-green-600 flex items-center gap-1">
                                            <CheckCircle size={12} /> Replied
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Reply Panel (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        {replyingTo ? (
                            <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/50 overflow-hidden">
                                <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Replying to</p>
                                    <p className="font-bold text-slate-900 truncate">{replyingTo.student.firstName} {replyingTo.student.lastName}</p>
                                    <p className="text-xs text-slate-500 truncate mt-1">"{replyingTo.message}"</p>
                                </div>
                                <div className="p-4">
                                    {/* We are reusing NotificationSender but pre-filling or guiding the user */}
                                    {/* Since NotificationSender selects student by search, we might need to adjust it or just let admin search. 
                                         For now, I will render it and admin has to search manually, OR 
                                         Ideally NotificationSender should accept a `preSelectedStudent`.
                                         
                                         Let's try to pass props if possible. Looking at NotificationSender.tsx...
                                         It doesn't accept props. I will just render it and let admin search for now to keep it simple & robust.
                                     */}
                                    <p className="text-xs text-slate-400 mb-4 px-1">
                                        Sending notification reply to <b>{replyingTo.student.firstName}</b> ({replyingTo.student.indexNumber}).
                                    </p>
                                    <NotificationSender
                                        preSelectedStudent={replyingTo.student}
                                        replyContext={replyingTo.message}
                                        onSuccess={handleReplySuccess}
                                    />

                                    <button
                                        onClick={() => setReplyingTo(null)}
                                        className="w-full mt-2 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                                <MessageCircle size={32} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">Select a message to reply</p>
                                <p className="text-xs text-slate-400 mt-1">Replies are sent as notifications.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
