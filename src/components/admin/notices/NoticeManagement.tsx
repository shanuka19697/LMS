"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Edit, Trash2, Plus, MessageSquare, ExternalLink, ImageIcon } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createNotice, deleteNotice, updateNotice } from "@/actions/notice";
import { format } from "date-fns";
import ImageUpload from "@/components/ui/ImageUpload";

export default function NoticeManagement({ initialNotices, examYears }: { initialNotices: any[], examYears: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<any>(null);
    const [noticeToDelete, setNoticeToDelete] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    function openCreateModal() {
        setCurrentNotice(null);
        setImageUrl("");
        setIsModalOpen(true);
    }

    function openEditModal(notice: any) {
        setCurrentNotice(notice);
        setImageUrl(notice.imageUrl || "");
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setNoticeToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (noticeToDelete) {
            await deleteNotice(noticeToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (currentNotice) {
            await updateNotice(currentNotice.id, data);
        } else {
            await createNotice(data);
        }

        setIsModalOpen(false);
        setIsSubmitting(false);
    }

    return (
        <div>
            <AdminHeader
                title="Notice Board"
                description="Manage announcements for students"
                actionLabel="Add Notice"
                onAction={openCreateModal}
            />

            <AdminTable headers={["Title", "Exam Year", "Status", "Date", "Actions"]}>
                {initialNotices.map((notice) => (
                    <AdminTableRow key={notice.id}>
                        <AdminTableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{notice.title}</span>
                                <span className="text-xs text-slate-500 truncate max-w-xs">{notice.description}</span>
                                {notice.link && (
                                    <a href={notice.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-500 mt-1 hover:underline">
                                        <ExternalLink size={10} /> Link attached
                                    </a>
                                )}
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                {notice.examYear}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${notice.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {notice.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="text-sm text-slate-500">
                                {format(new Date(notice.createdAt), "MMM d, yyyy")}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(notice)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(notice.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {initialNotices.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No notices found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentNotice ? "Edit Notice" : "Add New Notice"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={currentNotice?.title}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            placeholder="e.g. Exam Timetable Released"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            defaultValue={currentNotice?.description}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-32"
                            placeholder="Detailed announcement..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Exam Year</label>
                            <select
                                name="examYear"
                                required
                                defaultValue={currentNotice?.examYear || (examYears.length > 0 ? examYears[0].year : "")}
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
                                defaultValue={currentNotice?.isActive?.toString() || "true"}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Notice Image</label>
                        <ImageUpload
                            value={imageUrl ? [imageUrl] : []}
                            onChange={(url) => setImageUrl(url)}
                            onRemove={() => setImageUrl("")}
                        />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">External Link (Optional)</label>
                        <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="link"
                                type="text"
                                defaultValue={currentNotice?.link}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                placeholder="Telegram/WhatsApp Group Link..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                    >
                        {isSubmitting ? "Saving..." : (currentNotice ? "Update Notice" : "Post Notice")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Notice"
                description="Are you sure you want to delete this notice? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
