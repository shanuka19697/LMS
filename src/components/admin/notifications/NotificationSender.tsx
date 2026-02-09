"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { Search, Send, AlertTriangle, Info, CreditCard, CheckCircle, User } from "lucide-react";
import { searchStudents } from "@/actions/performance"; // Reuse existing search
import { createNotification } from "@/actions/notification";

interface NotificationSenderProps {
    preSelectedStudent?: any;
    replyContext?: string;
    onSuccess?: () => void;
}

export default function NotificationSender({ preSelectedStudent, replyContext, onSuccess }: NotificationSenderProps) {
    const [studentQuery, setStudentQuery] = useState("");
    const [foundStudents, setFoundStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(preSelectedStudent || null);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<'WARNING' | 'PAYMENT' | 'INFO'>('INFO');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSuccess, setLastSuccess] = useState<string | null>(null);

    // Update selected student if prop changes (e.g., when replying to a different message)
    useEffect(() => {
        if (preSelectedStudent) {
            setSelectedStudent(preSelectedStudent);
        }
    }, [preSelectedStudent]);

    async function handleStudentSearch(query: string) {
        setStudentQuery(query);
        if (query.length > 2) {
            const results = await searchStudents(query);
            setFoundStudents(results);
        } else {
            setFoundStudents([]);
        }
    }

    function selectStudent(student: any) {
        setSelectedStudent(student);
        setFoundStudents([]);
        setStudentQuery(`${student.firstName} ${student.lastName}`);
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedStudent || !message) return;

        setIsSubmitting(true);
        const res = await createNotification({
            studentIndex: selectedStudent.indexNumber,
            message,
            type
        });

        if (res.error) {
            alert(res.error);
        } else {
            setLastSuccess(`Message sent to ${selectedStudent.firstName}`);
            setMessage("");

            // Trigger parent callback if provided
            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => setLastSuccess(null), 3000);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <AdminHeader
                title="Send Notification"
                description="Send warnings, payment reminders, or messages to students."
            />

            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleSend} className="space-y-6">

                    {/* Student Search */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Find Student</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={studentQuery}
                                onChange={(e) => handleStudentSearch(e.target.value)}
                                placeholder="Search by name or index number..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>

                        {/* Dropdown Results */}
                        {foundStudents.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl mt-2 z-50 max-h-60 overflow-y-auto">
                                {foundStudents.map(s => (
                                    <div
                                        key={s.indexNumber}
                                        onClick={() => selectStudent(s)}
                                        className="p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                                            <p className="text-xs text-slate-500 font-mono">{s.indexNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected Student Badge */}
                        {selectedStudent && (
                            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-indigo-900">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                        <User size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                                        <p className="text-xs opacity-70">{selectedStudent.indexNumber}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedStudent(null); setStudentQuery(""); }}
                                    className="text-xs font-bold text-indigo-500 hover:text-indigo-700"
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Message Type Selection */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Message Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('WARNING')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${type === 'WARNING'
                                    ? 'border-red-500 bg-red-50 text-red-600'
                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <AlertTriangle size={24} />
                                <span className="text-xs font-bold">Warning</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setType('PAYMENT')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${type === 'PAYMENT'
                                    ? 'border-amber-500 bg-amber-50 text-amber-600'
                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <CreditCard size={24} />
                                <span className="text-xs font-bold">Payment</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setType('INFO')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${type === 'INFO'
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <Info size={24} />
                                <span className="text-xs font-bold">Info</span>
                            </button>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-32 resize-none transition-all font-medium text-slate-600"
                            required
                        ></textarea>
                    </div>

                    {/* Success Message */}
                    {lastSuccess && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle size={20} />
                            <span className="font-bold">{lastSuccess}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !selectedStudent || !message}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Sending..." : (
                            <>
                                <Send size={20} />
                                <span>Send Notification</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
