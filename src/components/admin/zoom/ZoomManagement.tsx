"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Trash2, Video, Calendar, Link as LinkIcon, Edit, Eye, EyeOff } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdminZoomMeeting, deleteAdminZoomMeeting, updateAdminZoomMeeting, toggleZoomMeetingStatus } from "@/actions/zoom";
import { format } from "date-fns";

export default function ZoomManagement({ initialMeetings, examYears }: { initialMeetings: any[], examYears: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [meetingToDelete, setMeetingToDelete] = useState("");
    const [editingMeeting, setEditingMeeting] = useState<any>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helpers
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (editingMeeting) {
            const res = await updateAdminZoomMeeting(editingMeeting.id, data);
            if (res.error) alert(res.error);
            else {
                setIsModalOpen(false);
                setEditingMeeting(null);
            }
        } else {
            const res = await createAdminZoomMeeting(data);
            if (res.error) alert(res.error);
            else setIsModalOpen(false);
        }
        setIsSubmitting(false);
    }

    function handleEdit(meeting: any) {
        setEditingMeeting(meeting);
        setIsModalOpen(true);
    }

    function openCreateModal() {
        setEditingMeeting(null);
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setMeetingToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (meetingToDelete) {
            await deleteAdminZoomMeeting(meetingToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    async function toggleStatus(id: string, currentStatus: boolean) {
        await toggleZoomMeetingStatus(id, !currentStatus);
    }

    return (
        <div>
            <AdminHeader
                title="Zoom Meetings"
                description="Manage your live classes"
                actionLabel="Schedule Meeting"
                onAction={openCreateModal}
            />

            <AdminTable headers={["Meeting", "Batch", "Zoom Details", "Schedule", "Status", "Actions"]}>
                {initialMeetings.map((meeting) => (
                    <AdminTableRow key={meeting.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Video size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{meeting.name}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{meeting.shortDescription}</p>
                                </div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                                {meeting.examYear}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="space-y-1">
                                <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">ID: {meeting.meetingId || "Auto"}</p>
                                <a href={meeting.zoomLink} target="_blank" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                    <LinkIcon size={12} /> Open Link
                                </a>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Calendar size={14} />
                                {format(new Date(meeting.startTime), "PP p")}
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <button
                                onClick={() => toggleStatus(meeting.id, meeting.isActive)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${meeting.isActive
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    }`}
                            >
                                {meeting.isActive ? "Active" : "Inactive"}
                            </button>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(meeting)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(meeting.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {initialMeetings.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No scheduled meetings found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMeeting ? "Edit Zoom Meeting" : "Schedule Zoom Meeting"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="zoomMeetingItemID" label="Ref ID (e.g., ZM-001)" required defaultValue={editingMeeting?.zoomMeetingItemID} />
                    <Input name="name" label="Meeting Title" required defaultValue={editingMeeting?.name} />

                    <Input name="zoomLink" label="Zoom Join URL" required defaultValue={editingMeeting?.zoomLink} />
                    <p className="text-xs text-slate-500 -mt-3">System will auto-extract Meeting ID & Password from link.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            name="startTime"
                            label="Start Date & Time"
                            type="datetime-local"
                            required
                            defaultValue={editingMeeting?.startTime ? new Date(editingMeeting.startTime).toISOString().slice(0, 16) : ""}
                        />
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Exam Year</label>
                            <select name="examYear" defaultValue={editingMeeting?.examYear || "2025"} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white">
                                {examYears.map(year => (
                                    <option key={year.id} value={year.year}>{year.year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                            <select name="isActive" defaultValue={editingMeeting?.isActive ?? true} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                        <textarea
                            name="shortDescription"
                            defaultValue={editingMeeting?.shortDescription}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-20"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                    >
                        {isSubmitting ? "Saving..." : (editingMeeting ? "Update Meeting" : "Schedule Meeting")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Cancel Meeting"
                description="Are you sure? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}

function Input({ label, name, type = "text", required = false, defaultValue }: any) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                name={name}
                type={type}
                required={required}
                defaultValue={defaultValue}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
        </div>
    )
}
