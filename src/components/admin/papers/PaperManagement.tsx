
"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Edit, Trash2, Power, Search, FileText } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdminPaper, deleteAdminPaper, updatePaperStatus, updateAdminPaper } from "@/actions/paper";

export default function PaperManagement({ initialPapers, examYears }: { initialPapers: any[], examYears: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPaper, setEditingPaper] = useState<any>(null);

    // Confirm Modal State
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        type: 'delete' | 'status';
        id: string;
        title: string;
        description: string;
        data?: boolean; // Holds current status for toggle
    }>({ isOpen: false, type: 'delete', id: '', title: '', description: '' });

    // Filter papers
    const filteredPapers = initialPapers.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.examYear.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleEdit(paper: any) {
        setEditingPaper(paper);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setEditingPaper(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        let res;
        if (editingPaper) {
            res = await updateAdminPaper(editingPaper.id, data);
        } else {
            res = await createAdminPaper(data);
        }

        if (res.error) {
            alert(res.error);
        } else {
            handleCloseModal();
        }
        setIsSubmitting(false);
    }

    function handleStatusToggle(id: string, currentStatus: boolean) {
        setConfirmConfig({
            isOpen: true,
            type: 'status',
            id,
            title: currentStatus ? "Deactivate Paper" : "Activate Paper",
            description: `Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this paper?`,
            data: currentStatus
        });
    }

    function handleDelete(id: string) {
        setConfirmConfig({
            isOpen: true,
            type: 'delete',
            id,
            title: "Delete Paper",
            description: "Are you sure you want to delete this paper? This action cannot be undone."
        });
    }

    async function onConfirmAction() {
        if (confirmConfig.type === 'status') {
            await updatePaperStatus(confirmConfig.id, !confirmConfig.data);
        } else {
            await deleteAdminPaper(confirmConfig.id);
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
    }

    return (
        <div>
            <AdminHeader
                title="Papers"
                description="Manage exam papers and their status"
                actionLabel="Create Paper"
                onAction={() => {
                    handleCloseModal();
                    setIsModalOpen(true);
                }}
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by title or year..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Title", "Exam Year", "Status", "Marks Count", "Actions"]}>
                {filteredPapers.map((paper) => (
                    <AdminTableRow key={paper.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <FileText size={16} />
                                </div>
                                <span className="font-bold text-slate-900">{paper.title}</span>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>{paper.examYear}</AdminTableCell>
                        <AdminTableCell>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${paper.type === 'FULL' ? 'bg-blue-50 text-blue-600' :
                                paper.type === 'TIMING' ? 'bg-orange-50 text-orange-600' :
                                    'bg-purple-50 text-purple-600'
                                }`}>
                                {paper.type}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${paper.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {paper.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded-md text-xs">
                                {paper._count?.marks || 0}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(paper)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                                    title="Edit Details"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleStatusToggle(paper.id, paper.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${paper.isActive ? 'hover:bg-red-50 text-emerald-600 hover:text-red-500' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'}`}
                                    title={paper.isActive ? "Deactivate" : "Activate"}
                                >
                                    <Power size={18} />
                                </button>
                                <button onClick={() => handleDelete(paper.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredPapers.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No papers found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingPaper ? "Edit Paper" : "Create New Paper"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Paper Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={editingPaper?.title || ""}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            placeholder="e.g. General English 2025 - Term 1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Exam Year</label>
                            <select
                                name="examYear"
                                required
                                defaultValue={editingPaper?.examYear || (examYears.length > 0 ? examYears[0].year : "")}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                            >
                                {examYears.length > 0 ? (
                                    examYears.map((year) => (
                                        <option key={year.id} value={year.year}>
                                            {year.year}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No Active Exam Years</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                            <select
                                name="isActive"
                                defaultValue={editingPaper ? String(editingPaper.isActive) : "true"}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Paper Type</label>
                            <select
                                name="type"
                                defaultValue={editingPaper?.type || "FULL"}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                            >
                                <option value="FULL">Full (P1 + P2)</option>
                                <option value="TIMING">Timing</option>
                                <option value="FINAL">Final</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : (editingPaper ? "Update Paper" : "Create Paper")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={onConfirmAction}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmText={confirmConfig.type === 'delete' ? 'Delete Paper' : (confirmConfig.data ? 'Deactivate' : 'Activate')}
                variant={confirmConfig.type === 'delete' ? 'danger' : (confirmConfig.data ? 'warning' : 'success')}
            />
        </div>
    );
}
