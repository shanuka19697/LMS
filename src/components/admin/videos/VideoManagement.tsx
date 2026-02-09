"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Trash2, Play, Search, Video } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdminVideo, deleteAdminVideo, updateAdminVideo } from "@/actions/video";
import ImageUpload from "@/components/ui/ImageUpload";

export default function VideoManagement({ initialVideos }: { initialVideos: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState("");
    const [editingVideo, setEditingVideo] = useState<any>(null); // New state for editing

    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const filteredVideos = initialVideos.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.videoItemID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Auto-generate random ID if not provided (optional, but let's stick to manual ID for now as per schema)
        // Actually schema says videoItemID is unique string.

        if (editingVideo) {
            const res = await updateAdminVideo(editingVideo.id, data);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
                setEditingVideo(null);
                setImageUrl("");
            }
        } else {
            const res = await createAdminVideo(data);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
                setImageUrl("");
            }
        }
        setIsSubmitting(false);
    }

    function handleEdit(video: any) {
        setEditingVideo(video);
        setImageUrl(video.imageUrl || "");
        setIsModalOpen(true);
    }

    function openCreateModal() {
        setEditingVideo(null);
        setImageUrl("");
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setVideoToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (videoToDelete) {
            await deleteAdminVideo(videoToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    return (
        <div>
            <AdminHeader
                title="Video Items"
                description="Manage your video library"
                actionLabel="Add Video"
                onAction={openCreateModal}
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search videos..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Video", "ID", "Duration", "Linked Lessons", "Actions"]}>
                {filteredVideos.map((video) => (
                    <AdminTableRow key={video.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-9 rounded-lg bg-slate-100 overflow-hidden relative group shrink-0">
                                    <img src={video.imageUrl} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={12} className="text-white fill-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 line-clamp-1">{video.name}</p>
                                    <a href={video.videoUrl} target="_blank" className="text-xs text-indigo-500 hover:underline truncate block max-w-[200px]">{video.videoUrl}</a>
                                </div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell><span className="font-mono text-xs">{video.videoItemID}</span></AdminTableCell>
                        <AdminTableCell>{video.duration}</AdminTableCell>
                        <AdminTableCell>
                            <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 text-xs font-bold">
                                {video._count.lessonPacks} Packs
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <button onClick={() => handleEdit(video)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors mr-1">
                                <Video size={18} />
                            </button>
                            <button onClick={() => handleDelete(video.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredVideos.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No videos found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVideo ? "Edit Video Item" : "Add Video Item"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="videoItemID" label="Video ID (e.g., VID-001)" required defaultValue={editingVideo?.videoItemID} />
                    <Input name="name" label="Video Title" required defaultValue={editingVideo?.name} />
                    <Input name="videoUrl" label="YouTube URL" required defaultValue={editingVideo?.videoUrl} />
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Thumbnail Image</label>
                        <ImageUpload
                            value={imageUrl ? [imageUrl] : []}
                            onChange={(url) => setImageUrl(url)}
                            onRemove={() => setImageUrl("")}
                        />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="duration" label="Duration (e.g., 45:00)" defaultValue={editingVideo?.duration} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            name="shortDescription"
                            defaultValue={editingVideo?.shortDescription}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                    >
                        {isSubmitting ? "Saving..." : (editingVideo ? "Update Video" : "Create Video")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Video"
                description="Are you sure you want to delete this video? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}

function Input({ label, name, required = false, defaultValue }: any) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                name={name}
                required={required}
                defaultValue={defaultValue}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
        </div>
    )
}
