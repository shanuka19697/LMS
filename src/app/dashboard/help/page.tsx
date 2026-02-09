"use client";

import { createMessage, getStudentMessages } from "@/actions/message";
import { useEffect, useState } from "react";
import {
    Send,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    MessageCircle,
    SendHorizontal,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        question: "How do I purchase a lesson pack?",
        answer: "Go to the 'Lesson Store' in your dashboard, select the pack you want, click 'Confirm & Enroll', and upload your payment slip. Once admin verifies it, you'll gain access."
    },
    {
        question: "How long does verification take?",
        answer: "Typically, payments are verified within 12-24 hours. If your purchase is still pending after 24 hours, please message us here."
    },
    {
        question: "Can I watch videos on multiple devices?",
        answer: "Yes, you can log in from different devices, but only one session is allowed at a time for security reasons."
    },
    {
        question: "What if I lose my password?",
        answer: "You can contact support via WhatsApp or Telegram for a password reset request. Please have your Index Number ready."
    }
];

export default function HelpPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    async function fetchMessages() {
        const data = await getStudentMessages();
        setMessages(data);
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!newMessage.trim()) return;

        setIsSending(true);
        const res = await createMessage(newMessage);
        setIsSending(false);

        if (res.error) {
            setError(res.error);
        } else {
            setNewMessage("");
            fetchMessages();
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10 md:pb-0">
            <div className="flex items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">We're here to help you with any issues or inquiries.</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="p-3 bg-white rounded-xl border border-slate-200 active:bg-slate-50 text-slate-500 transition-colors shadow-sm shrink-0"
                    title="Refresh Messages"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Direct Support & FAQ */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Contact Cards */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            Quick Support
                        </h2>

                        <a
                            href="https://wa.me/your_number"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500"
                        >
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900">WhatsApp</p>
                                <p className="text-xs text-slate-500">Fast message support</p>
                            </div>
                            <ExternalLink size={16} className="text-slate-300 group-hover:text-green-500" />
                        </a>

                        <a
                            href="https://t.me/your_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-sky-500"
                        >
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <SendHorizontal size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900">Telegram</p>
                                <p className="text-xs text-slate-500">Official support bot</p>
                            </div>
                            <ExternalLink size={16} className="text-slate-300 group-hover:text-sky-500" />
                        </a>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
                            Common Questions
                        </h2>
                        <div className="space-y-3">
                            {FAQS.map((faq, idx) => (
                                <div key={idx} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-sm font-bold text-slate-700">{faq.question}</span>
                                        {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-4 pb-4"
                                            >
                                                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-50">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Message Admin & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Compose Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900">Message Admin</h2>
                                <p className="text-xs text-slate-500">Response time: Usually within 1 hour</p>
                            </div>
                        </div>

                        <form onSubmit={handleSend} className="space-y-4">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="State your inquiry clearly..."
                                className="w-full h-36 p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all text-sm font-medium"
                            ></textarea>

                            <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${newMessage.length > 450 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                                    {newMessage.length}/500
                                </span>

                                <div className="flex items-center gap-4">
                                    {error && (
                                        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                            <AlertCircle size={14} /> {error}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSending || !newMessage.trim()}
                                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95"
                                    >
                                        {isSending ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                Send Message <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Message History */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-bold text-slate-800">Your Communication log</h2>
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">Private & Secure</span>
                        </div>

                        {messages.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} />
                                </div>
                                <p className="text-slate-500 font-bold">No active tickets.</p>
                                <p className="text-xs text-slate-400">Your sent inquiries will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-400 font-bold">SENT ON</span>
                                                <span className="text-xs text-slate-900 font-black">
                                                    {format(new Date(msg.createdAt), "MMM d, yyyy")}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {msg.isReplied ? (
                                                    <span className="flex items-center gap-1 text-green-600 text-[10px] font-black bg-green-50 px-2 py-1 rounded-lg uppercase">
                                                        <CheckCircle size={10} /> Resolved
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black bg-amber-50 px-2 py-1 rounded-lg uppercase animate-pulse">
                                                        <Clock size={10} /> Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-xs font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                                            {msg.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
