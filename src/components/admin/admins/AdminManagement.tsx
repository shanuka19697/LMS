"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Trash2, Shield, User, Mail, Edit, Key } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdmin, deleteAdmin, updateAdmin } from "@/actions/admin";

export default function AdminManagement({ initialAdmins }: { initialAdmins: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState("");
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (editingAdmin) {
            const res = await updateAdmin(editingAdmin.id, data);
            if (res.error) alert(res.error);
            else {
                setIsModalOpen(false);
                setEditingAdmin(null);
            }
        } else {
            const res = await createAdmin(data);
            if (res.error) alert(res.error);
            else setIsModalOpen(false);
        }
        setIsSubmitting(false);
    }

    function handleEdit(admin: any) {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    }

    function openCreateModal() {
        setEditingAdmin(null);
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setAdminToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (adminToDelete) {
            await deleteAdmin(adminToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Super Admin</span>;
            case 'PAPER_ADMIN':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Paper Admin</span>;
            case 'MESSAGE_ADMIN':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Message Admin</span>;
            default:
                return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{role}</span>;
        }
    };

    return (
        <div>
            <AdminHeader
                title="Administrator Management"
                description="Manage system administrators and their specific access roles"
                actionLabel="Create Admin"
                onAction={openCreateModal}
            />

            <AdminTable headers={["Admin User", "Email", "Role", "Actions"]}>
                {initialAdmins.map((admin) => (
                    <AdminTableRow key={admin.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    <User size={24} />
                                </div>
                                <p className="font-bold text-slate-900">{admin.username}</p>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Mail size={14} />
                                {admin.email}
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            {getRoleBadge(admin.role)}
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(admin)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(admin.id)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                    disabled={initialAdmins.length <= 1}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAdmin ? "Edit Administrator" : "Create New Administrator"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="username" label="Username" required defaultValue={editingAdmin?.username} />
                        <Input name="email" label="Email Address" type="email" required defaultValue={editingAdmin?.email} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Access Role</label>
                            <select
                                name="role"
                                defaultValue={editingAdmin?.role || "SUPER_ADMIN"}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white transition-all"
                            >
                                <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                                <option value="PAPER_ADMIN">Paper Admin (Papers & Marks Only)</option>
                                <option value="MESSAGE_ADMIN">Message Admin (Messages Only)</option>
                            </select>
                        </div>
                        <Input
                            name="password"
                            label={editingAdmin ? "Change Password (optional)" : "Password"}
                            type="password"
                            required={!editingAdmin}
                        />
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl flex items-start gap-2">
                        <Shield size={14} className="mt-0.5" />
                        New administrators will be able to login immediately with these credentials. Ensure the role matches their responsibilities.
                    </p>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4 shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing..." : (editingAdmin ? "Update Administrator" : "Create Administrator")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Remove Administrator"
                description="Are you sure you want to remove this administrator? They will lose all access to the admin panel immediately."
                confirmText="Delete Admin"
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
