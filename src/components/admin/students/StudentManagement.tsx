"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Edit, Trash2, Eye, Search } from "lucide-react";

// ... existing imports
import { createAdminStudent, deleteAdminStudent, updateAdminStudent } from "@/actions/student";

export default function StudentManagement({ initialStudents, activeExamYears }: { initialStudents: any[], activeExamYears: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState(false); // If true, only viewing profile

    // Filter students
    const filteredStudents = initialStudents.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.indexNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!selectedStudent || !selectedStudent.id) {
            // Create Mode
            const res = await createAdminStudent(data);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
            }
        } else {
            // Edit Mode
            const res = await updateAdminStudent(selectedStudent.indexNumber, data);
            if (res.error) {
                alert(res.error);
            } else {
                setIsModalOpen(false);
            }
        }
        setIsSubmitting(false);
    }

    function handleDelete(indexNumber: string) {
        setStudentToDelete(indexNumber);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (studentToDelete) {
            await deleteAdminStudent(studentToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    function openCreate() {
        setSelectedStudent(null);
        setViewMode(false);
        setIsModalOpen(true);
    }

    function openEdit(student: any) {
        setSelectedStudent(student);
        setViewMode(false);
        setIsModalOpen(true);
    }

    function openView(student: any) {
        setSelectedStudent(student);
        setViewMode(true);
        setIsModalOpen(true);
    }

    return (
        <div>
            <AdminHeader
                title="Students"
                description="Manage your student database"
                actionLabel="Add Student"
                onAction={openCreate}
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or index number..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Name", "Index Number", "Exam Year", "District", "Actions"]}>
                {filteredStudents.map((student) => (
                    <AdminTableRow key={student.id}>
                        <AdminTableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                    {student.firstName[0]}{student.lastName[0]}
                                </div>
                                <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>{student.indexNumber}</AdminTableCell>
                        <AdminTableCell>{student.examYear}</AdminTableCell>
                        <AdminTableCell>{student.district}</AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openView(student)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors" title="View Profile">
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => openEdit(student)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-amber-600 transition-colors" title="Edit Student">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(student.indexNumber)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors" title="Delete Student">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredStudents.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No students found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={viewMode ? "Student Details" : (selectedStudent ? "Edit Student" : "Add New Student")}
            >
                {viewMode && selectedStudent ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-400 uppercase">First Name</label><p className="font-medium">{selectedStudent.firstName}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Last Name</label><p className="font-medium">{selectedStudent.lastName}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Index Number</label><p className="font-medium font-mono">{selectedStudent.indexNumber}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Email</label><p className="font-medium">{selectedStudent.email}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Phone</label><p className="font-medium">{selectedStudent.phoneNumber}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label><p className="font-medium">{selectedStudent.whatsappNumber}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">NIC</label><p className="font-medium">{selectedStudent.nic}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">District</label><p className="font-medium">{selectedStudent.district}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">School</label><p className="font-medium">{selectedStudent.school}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Institute</label><p className="font-medium">{selectedStudent.institute}</p></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase">Stream</label><p className="font-medium">{selectedStudent.stream}</p></div>
                            <div className="col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Address</label><p className="font-medium">{selectedStudent.address}</p></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="firstName" label="First Name" required defaultValue={selectedStudent?.firstName} />
                            <Input name="lastName" label="Last Name" required defaultValue={selectedStudent?.lastName} />
                        </div>
                        {selectedStudent ? (
                            // Index Number is read-only in Edit Mode to act as identifier
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Index Number</label>
                                <input
                                    disabled
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
                                    value={selectedStudent.indexNumber}
                                />
                            </div>
                        ) : (
                            <Input name="indexNumber" label="Index Number" required />
                        )}

                        <Input name="email" label="Email" type="email" required defaultValue={selectedStudent?.email} />

                        <div className="grid grid-cols-2 gap-4">
                            <Input name="phoneNumber" label="Phone Number" defaultValue={selectedStudent?.phoneNumber} />
                            <Input name="whatsappNumber" label="WhatsApp Number" defaultValue={selectedStudent?.whatsappNumber} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input name="nic" label="NIC" defaultValue={selectedStudent?.nic} />
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Exam Year</label>
                                <select
                                    name="examYear"
                                    defaultValue={selectedStudent?.examYear || (activeExamYears.length > 0 ? activeExamYears[0].year : "")}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-medium"
                                >
                                    {activeExamYears.map((year) => (
                                        <option key={year.id} value={year.year}>{year.year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input name="district" label="District" defaultValue={selectedStudent?.district} />
                            <Input name="institute" label="Institute" defaultValue={selectedStudent?.institute} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input name="school" label="School" defaultValue={selectedStudent?.school} />
                            <Input name="stream" label="Stream" defaultValue={selectedStudent?.stream} />
                        </div>

                        <Input name="address" label="Address" defaultValue={selectedStudent?.address} />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : (selectedStudent ? "Update Student" : "Create Student")}
                        </button>
                    </form>
                )}
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Student"
                description="Are you sure you want to delete this student? This action cannot be undone."
                confirmText="Delete Student"
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
