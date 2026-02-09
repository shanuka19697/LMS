
"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Trash2, Search, Edit } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { createAdminMark, deleteAdminMark, updateAdminMark } from "@/actions/mark";
import { searchStudents } from "@/actions/student";
import { getActivePapers } from "@/actions/paper";

export default function MarkManagement({ initialMarks }: { initialMarks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [markIdToDelete, setMarkIdToDelete] = useState("");
    const [editingMark, setEditingMark] = useState<any>(null); // Track editing state
    const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; desc: string; variant: "danger" | "warning" | "success" | "info" }>({
        isOpen: false,
        title: "",
        desc: "",
        variant: "warning"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data for dropdowns
    const [activePapers, setActivePapers] = useState<any[]>([]);
    const [studentQuery, setStudentQuery] = useState("");
    const [foundStudents, setFoundStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedPaperId, setSelectedPaperId] = useState("");

    useEffect(() => {
        async function loadPapers() {
            const papers = await getActivePapers();
            setActivePapers(papers);
        }
        loadPapers();
    }, []);

    // Student Search Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (studentQuery.length > 1) {
                const results = await searchStudents(studentQuery);
                setFoundStudents(results);
            } else {
                setFoundStudents([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [studentQuery]);


    const filteredMarks = initialMarks.filter(m =>
        m.studentIndex.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.paper?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleEdit(mark: any) {
        setEditingMark(mark);
        // Pre-populate form data
        setSelectedStudent({
            indexNumber: mark.studentIndex,
            firstName: mark.student?.firstName || "",
            lastName: mark.student?.lastName || ""
        });
        setSelectedPaperId(mark.paperId);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setEditingMark(null);
        setSelectedStudent(null);
        setSelectedPaperId("");
        setStudentQuery("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedStudent || !selectedPaperId) {
            alert("Please select a student and a paper.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // --- VALIDATION START ---
        const selectedPaper = activePapers.find(p => p.id === selectedPaperId);
        // Fallback to editingMark type
        const type = selectedPaper?.type || (editingMark && editingMark.paperId === selectedPaperId ? editingMark.paper?.type : undefined);

        let calculatedTotal = 0;
        if (type === 'TIMING') {
            calculatedTotal = parseFloat(data.totalMark as string || "0");
        } else {
            calculatedTotal = parseFloat(data.firstMark as string || "0") + parseFloat(data.secondMark as string || "0");
        }

        if (calculatedTotal > 100) {
            setAlertConfig({
                isOpen: true,
                title: "Invalid Total Marks",
                desc: "The total marks cannot exceed 100. Please check your inputs.",
                variant: "warning"
            });
            return;
        }
        // --- VALIDATION END ---

        setIsSubmitting(true);

        const payload = {
            ...data,
            studentIndex: selectedStudent.indexNumber,
            paperId: selectedPaperId
        };

        let res;
        if (editingMark) {
            res = await updateAdminMark(editingMark.id, payload);
        } else {
            res = await createAdminMark(payload);
        }

        if (res.error) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                desc: res.error,
                variant: "danger"
            });
        } else {
            handleCloseModal();
        }
        setIsSubmitting(false);
    }

    function handleDelete(id: string) {
        setMarkIdToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (markIdToDelete) {
            await deleteAdminMark(markIdToDelete);
            setIsDeleteModalOpen(false);
        }
    }

    return (
        <div>
            <AdminHeader
                title="Paper Marks"
                description="Track student performance"
                actionLabel="Add Marks"
                onAction={() => {
                    handleCloseModal(); // Ensure fresh state
                    setIsModalOpen(true);
                }}
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by student index or paper title..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Student", "Paper Name", "Type", "Marks", "Total", "Actions"]}>
                {filteredMarks.map((mark) => (
                    <AdminTableRow key={mark.id}>
                        <AdminTableCell>
                            <div>
                                <p className="font-bold text-slate-900">{mark.student?.firstName} {mark.student?.lastName}</p>
                                <span className="text-xs text-slate-500 font-mono">{mark.studentIndex}</span>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>{mark.paper?.title || "Unknown Paper"}</AdminTableCell>
                        <AdminTableCell>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${mark.type === 'FULL' ? 'bg-blue-50 text-blue-600' :
                                mark.type === 'TIMING' ? 'bg-orange-50 text-orange-600' :
                                    'bg-purple-50 text-purple-600'
                                }`}>
                                {mark.type}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            {mark.type === 'TIMING' ? '-' : (
                                <div className="flex flex-col text-xs text-slate-500">
                                    <span>P1: {mark.firstMark}</span>
                                    <span>P2: {mark.secondMark}</span>
                                </div>
                            )}
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className="font-black text-slate-900">{mark.totalMark}</span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(mark)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(mark.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredMarks.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No marks found.</td>
                    </tr>
                )}
            </AdminTable>

            <AdminModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMark ? "Edit Paper Marks" : "Add Paper Marks"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Student Select Logic */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Student</label>
                        {!selectedStudent ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Type index number or name..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    value={studentQuery}
                                    onChange={(e) => setStudentQuery(e.target.value)}
                                />
                                {studentQuery.length > 1 && foundStudents.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto z-50">
                                        {foundStudents.map(student => (
                                            <button
                                                key={student.indexNumber}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setStudentQuery("");
                                                    setFoundStudents([]);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex flex-col"
                                            >
                                                <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
                                                <span className="text-xs text-slate-500 font-mono">{student.indexNumber}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <div>
                                    <p className="font-bold text-indigo-900">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                                    <p className="text-xs text-indigo-600 font-mono">{selectedStudent.indexNumber}</p>
                                </div>
                                {!editingMark && ( // Only allow changing student if NOT editing (optional restriction, usually safer for editing)
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStudent(null)}
                                        className="p-1 hover:bg-indigo-100 rounded text-indigo-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Paper Select Dropdown */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Paper</label>
                        <select
                            value={selectedPaperId}
                            onChange={(e) => setSelectedPaperId(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                        >
                            <option value="">-- Choose Paper --</option>
                            {activePapers.map(paper => (
                                <option key={paper.id} value={paper.id}>
                                    {paper.title} ({paper.examYear}) - {paper.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Inputs based on Paper Type */}
                    {(() => {
                        const selectedPaper = activePapers.find(p => p.id === selectedPaperId);
                        // Fallback to editingMark type if paper not found in active list (e.g. inactive paper)
                        const type = selectedPaper?.type || (editingMark && editingMark.paperId === selectedPaperId ? editingMark.paper?.type : undefined);

                        if (!selectedPaperId) return null;

                        // Calculate defaults if editing
                        const defaultTotal = editingMark ? editingMark.totalMark : "";
                        const defaultFirst = editingMark ? editingMark.firstMark : "";
                        const defaultSecond = editingMark ? editingMark.secondMark : "";

                        if (type === 'TIMING') {
                            return (
                                <Input
                                    name="totalMark"
                                    label="Total Marks (Timing Paper)"
                                    type="number"
                                    required
                                    defaultValue={defaultTotal}
                                />
                            );
                        } else {
                            return (
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        name="firstMark"
                                        label="Paper 1 Marks"
                                        type="number"
                                        required
                                        defaultValue={defaultFirst}
                                    />
                                    <Input
                                        name="secondMark"
                                        label="Paper 2 Marks"
                                        type="number"
                                        required
                                        defaultValue={defaultSecond}
                                    />
                                </div>
                            );
                        }
                    })()}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                    >
                        {isSubmitting ? "Saving..." : (editingMark ? "Update Marks" : "Add Marks")}
                    </button>
                </form>
            </AdminModal>

            <ConfirmModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                description={alertConfig.desc}
                confirmText="Okay"
                cancelText="Close"
                variant={alertConfig.variant}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Mark"
                description="Are you sure you want to delete this mark entry?"
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
                defaultValue={defaultValue} // Added support for defaultValue
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
        </div>
    )
}

