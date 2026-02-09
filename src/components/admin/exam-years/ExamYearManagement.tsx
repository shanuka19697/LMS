"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { createExamYear, toggleExamYear, deleteExamYear } from "@/actions/examYear";
import { useToast } from "@/components/ui/ToastProvider";

interface ExamYear {
    id: string;
    year: string;
    isActive: boolean;
    createdAt: Date;
}

interface ExamYearManagementProps {
    initialYears: ExamYear[];
}

export default function ExamYearManagement({ initialYears }: ExamYearManagementProps) {
    const { showToast } = useToast();
    const [years, setYears] = useState(initialYears);
    const [newYear, setNewYear] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleAddYear = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newYear.trim()) return;

        setIsAdding(true);
        const res = await createExamYear(newYear);
        setIsAdding(false);

        if (res.success) {
            showToast("Exam Year added successfully", "success");
            setNewYear("");
            // Ideally re-fetch or optimistically update. For simplicity here we rely on page refresh or simple append if we returned the obj.
            // But server actions with revalidatePath usually need router.refresh().
            // For deeper interactivity, we might want to return the new obj from action.
            // Let's assume revalidatePath does the heavy lifting on next nav/refresh, 
            // but for instant feedback we might need to manually update state if possible or refresh router.
            window.location.reload();
        } else {
            showToast(res.error || "Failed to add year", "error");
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const res = await toggleExamYear(id, !currentStatus);
        if (res.success) {
            setYears(years.map(y => y.id === id ? { ...y, isActive: !currentStatus } : y));
            showToast(`Year ${currentStatus ? 'deactivated' : 'activated'}`, "success");
        } else {
            showToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this year?")) return;

        setIsDeleting(id);
        const res = await deleteExamYear(id);
        setIsDeleting(null);

        if (res.success) {
            setYears(years.filter(y => y.id !== id));
            showToast("Exam Year deleted", "success");
        } else {
            showToast("Failed to delete year", "error");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-slate-900">Exam Years</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage active academic years for student registration.</p>
                </div>
            </div>

            {/* Add New Year Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 max-w-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" />
                    Add New Year
                </h3>
                <form onSubmit={handleAddYear} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="e.g. 2026"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newYear}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {years.map((year) => (
                        <motion.div
                            key={year.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`p-6 rounded-[2rem] border transition-all ${year.isActive ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-75'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${year.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <Calendar size={24} />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${year.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                    {year.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <h3 className={`text-3xl font-black font-heading mb-6 ${year.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {year.year}
                            </h3>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggle(year.id, year.isActive)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${year.isActive
                                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                >
                                    {year.isActive ? (
                                        <>
                                            <XCircle size={16} /> Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={16} /> Activate
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(year.id)}
                                    disabled={isDeleting === year.id}
                                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {isDeleting === year.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
