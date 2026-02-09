"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Trash2, BookOpen, Search, Video, Check } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdminLesson, deleteAdminLesson, updateAdminLesson } from "@/actions/lesson";
import ImageUpload from "@/components/ui/ImageUpload";

export default function LessonManagement({ initialLessons, allVideos, activeExamYears }: { initialLessons: any[], allVideos: any[], activeExamYears: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // ... existing state ...
    const [lessonToDelete, setLessonToDelete] = useState("");
    const [editingLesson, setEditingLesson] = useState<any>(null); // New state for editing

    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Multi-select state for videos
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");

    const filteredLessons = initialLessons.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.lessonPackID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ... existing handlers ...

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (editingLesson) {
            const res = await updateAdminLesson(editingLesson.id, data, selectedVideos);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
                setEditingLesson(null);
                setSelectedVideos([]);
                setImageUrl("");
            }
        } else {
            const res = await createAdminLesson(data, selectedVideos);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
                setSelectedVideos([]);
                setImageUrl("");
            }
        }
        setIsSubmitting(false);
    }

    // ... existing helpers ...

    function handleEdit(lesson: any) {
        setEditingLesson(lesson);
        // Populate selected videos
        if (lesson.videos) {
            setSelectedVideos(lesson.videos.map((v: any) => v.id));
        } else {
            setSelectedVideos([]);
        }
        setImageUrl(lesson.imageUrl || "");
        setIsModalOpen(true);
    }

    function openCreateModal() {
        setEditingLesson(null);
        setSelectedVideos([]);
        setImageUrl("");
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setLessonToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (lessonToDelete) {
            await deleteAdminLesson(lessonToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    const toggleVideo = (id: string) => {
        setSelectedVideos(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    }

    return (
        <div>
            <AdminHeader
                title="Lesson Packs"
                description="Manage course content and bundles"
                actionLabel="Create Lesson Pack"
                onAction={openCreateModal}
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search lessons..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Lesson Pack", "ID", "Type", "Videos", "Price", "Actions"]}>
                {filteredLessons.map((lesson) => (
                    <AdminTableRow key={lesson.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-9 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                                    <img src={lesson.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 line-clamp-1">{lesson.name}</p>
                                    <span className="text-xs text-slate-500">{lesson.examYear} Batch</span>
                                </div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell><span className="font-mono text-xs">{lesson.lessonPackID}</span></AdminTableCell>
                        <AdminTableCell>
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                {lesson.type}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>{lesson.videos.length} videos</AdminTableCell>
                        <AdminTableCell>LKR {lesson.price}</AdminTableCell>
                        <AdminTableCell>
                            <button onClick={() => handleEdit(lesson)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors mr-1">
                                <BookOpen size={18} />
                            </button>
                            <button onClick={() => handleDelete(lesson.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredLessons.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No lesson packs found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLesson ? "Edit Lesson Pack" : "Create Lesson Pack"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="lessonPackID" label="Pack ID (e.g., LP-2026-T1)" required defaultValue={editingLesson?.lessonPackID} />
                    <Input name="name" label="Pack Name" required defaultValue={editingLesson?.name} />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Exam Year</label>
                            <select
                                name="examYear"
                                defaultValue={editingLesson?.examYear || (activeExamYears.length > 0 ? activeExamYears[0].year : "2026")}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-medium"
                            >
                                {activeExamYears.map((year) => (
                                    <option key={year.id} value={year.year}>{year.year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                            <select name="type" defaultValue={editingLesson?.type} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white">
                                <option value="THEORY">Theory</option>
                                <option value="REVISION">Revision</option>
                                <option value="PAPER_CLASS">Paper Class</option>
                                <option value="LESSON_PACK">Lesson Pack</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="price" label="Price (LKR)" type="number" required defaultValue={editingLesson?.price} />
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Cover Image</label>
                            <ImageUpload
                                value={imageUrl ? [imageUrl] : []}
                                onChange={(url) => setImageUrl(url)}
                                onRemove={() => setImageUrl("")}
                            />
                            <input type="hidden" name="imageUrl" value={imageUrl} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                        <input name="shortDescription" defaultValue={editingLesson?.shortDescription} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Long Description</label>
                        <textarea name="longDescription" defaultValue={editingLesson?.longDescription} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-20" required></textarea>
                    </div>

                    {/* Video Selector */}
                    <div className="border-t border-slate-100 pt-4">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Videos ({selectedVideos.length})</label>
                        <div className="h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-50">
                            {allVideos.map(video => (
                                <div
                                    key={video.id}
                                    onClick={() => toggleVideo(video.id)}
                                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedVideos.includes(video.id) ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                            <Video size={14} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{video.name}</p>
                                            <p className="text-xs text-slate-500">{video.videoItemID}</p>
                                        </div>
                                    </div>
                                    {selectedVideos.includes(video.id) && <Check size={18} className="text-indigo-600" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                    >
                        {isSubmitting ? "Saving..." : (editingLesson ? "Update Lesson Pack" : "Create Lesson Pack")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Lesson Pack"
                description="Are you sure? This will not delete video files, just the pack definition."
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
