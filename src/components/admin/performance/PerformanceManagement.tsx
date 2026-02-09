"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { BarChart2, Edit, Trash2, Search, User } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createDailyPerformance, deleteDailyPerformance, searchStudents, updateDailyPerformance } from "@/actions/performance";
import { format } from "date-fns";

export default function PerformanceManagement({ initialRecords }: { initialRecords: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // State
    const [recordToDelete, setRecordToDelete] = useState("");
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Student State
    const [studentQuery, setStudentQuery] = useState("");
    const [foundStudents, setFoundStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Filter Table State
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRecords = initialRecords.filter(r =>
        r.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
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
        setStudentQuery(`${student.firstName} ${student.lastName} (${student.indexNumber})`);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (editingRecord) {
            const res = await updateDailyPerformance(editingRecord.id, data);
            if (res.error) alert(res.error);
            else {
                setIsModalOpen(false);
                setEditingRecord(null);
            }
        } else {
            if (!selectedStudent) {
                alert("Please select a student.");
                setIsSubmitting(false);
                return;
            }
            const payload = { ...data, studentIndex: selectedStudent.indexNumber };
            const res = await createDailyPerformance(payload);
            if (res.error) alert(res.error);
            else {
                setIsModalOpen(false);
                setSelectedStudent(null);
                setStudentQuery("");
            }
        }
        setIsSubmitting(false);
    }

    function openCreateModal() {
        setEditingRecord(null);
        setSelectedStudent(null);
        setStudentQuery("");
        setIsModalOpen(true);
    }

    function handleEdit(record: any) {
        setEditingRecord(record);
        setSelectedStudent(record.student);
        setStudentQuery(`${record.student.firstName} ${record.student.lastName}`);
        setIsModalOpen(true);
    }

    function handleDelete(id: string) {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (recordToDelete) {
            await deleteDailyPerformance(recordToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    // Chart Helper
    function calculateTotal(record: any) {
        return (record.monday + record.tuesday + record.wednesday + record.thursday + record.friday + record.saturday + record.sunday).toFixed(1);
    }

    return (
        <div>
            <AdminHeader
                title="Daily Performance"
                description="Track student study hours"
                actionLabel="Add Record"
                onAction={openCreateModal}
            />

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by student name or index..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Student", "Week Starting", "Performance Graph", "Total Hours", "Actions"]}>
                {filteredRecords.map((record) => (
                    <AdminTableRow key={record.id}>
                        <AdminTableCell>
                            <div>
                                <p className="font-bold text-slate-900">{record.student.firstName} {record.student.lastName}</p>
                                <p className="text-xs text-slate-500 font-mono">{record.student.indexNumber}</p>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="font-bold text-slate-700">{format(new Date(record.weekStartDate), "MMM d, yyyy")}</span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-end gap-1 h-12 w-32 border-b border-slate-200 pb-1">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                    const h = (record as any)[day] || 0;
                                    const height = Math.min(100, (h / 12) * 100); // 12 hours max scale
                                    return (
                                        <div key={day} className="flex-1 bg-indigo-500 rounded-t-sm hover:opacity-80 transition-opacity relative group" style={{ height: `${height}%` }}>
                                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                {day.slice(0, 3)}: {h}h
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                {calculateTotal(record)}h
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(record)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(record.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredRecords.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No performance records found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRecord ? "Edit Performance" : "Add Daily Performance"}
            >
                <div>
                    {/* Student Search (Only show if creating) */}
                    {!editingRecord && (
                        <div className="mb-6 relative">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Find Student</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={studentQuery}
                                    onChange={(e) => handleStudentSearch(e.target.value)}
                                    placeholder="Search by name or index..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </div>
                            {foundStudents.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl mt-1 z-50 max-h-40 overflow-y-auto">
                                    {foundStudents.map(s => (
                                        <div
                                            key={s.indexNumber}
                                            onClick={() => selectStudent(s)}
                                            className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                                                <p className="text-xs text-slate-500">{s.indexNumber}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedStudent && (
                                <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-sm text-green-700">
                                    <User size={16} />
                                    <span className="font-bold">Selected: {selectedStudent.firstName} {selectedStudent.lastName}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {editingRecord && (
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 text-sm text-slate-700 mb-4">
                                <User size={16} />
                                <span className="font-bold">Student: {editingRecord.student.firstName} {editingRecord.student.lastName}</span>
                            </div>
                        )}

                        <Input
                            name="weekStartDate"
                            label="Week Start Date"
                            type="date"
                            required
                            defaultValue={editingRecord?.weekStartDate ? new Date(editingRecord.weekStartDate).toISOString().slice(0, 10) : ""}
                            readOnly={!!editingRecord} // Don't allow changing date on edit to keep it simple
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <Input name="monday" label="Monday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.monday} />
                            <Input name="tuesday" label="Tuesday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.tuesday} />
                            <Input name="wednesday" label="Wednesday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.wednesday} />
                            <Input name="thursday" label="Thursday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.thursday} />
                            <Input name="friday" label="Friday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.friday} />
                            <Input name="saturday" label="Saturday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.saturday} />
                            <Input name="sunday" label="Sunday (hrs)" type="number" step="0.1" defaultValue={editingRecord?.sunday} />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            {isSubmitting ? "Saving..." : (editingRecord ? "Update Performance" : "Save Record")}
                        </button>
                    </form>
                </div>
            </AdminModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Record"
                description="Are you sure? This will remove the performance data for this week."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}

function Input({ label, name, type = "text", required = false, defaultValue, step, readOnly }: any) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                name={name}
                type={type}
                step={step}
                required={required}
                defaultValue={defaultValue}
                readOnly={readOnly}
                className={`w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${readOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
            />
        </div>
    )
}
