"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/ui/AdminTable";
import { Check, X, Search, Clock, Eye, Trash } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { updatePurchaseStatus, deletePurchase } from "@/actions/sales";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SalesManagement({ initialPurchases }: { initialPurchases: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Confirm Modal State
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        id: string;
        status?: string;
        type: 'STATUS' | 'DELETE';
    }>({ isOpen: false, id: '', type: 'STATUS' });

    const [rejectionReason, setRejectionReason] = useState("");

    const filteredPurchases = initialPurchases.filter(p =>
        p.student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleStatusChange(id: string, status: string) {
        setConfirmConfig({
            isOpen: true,
            id,
            status,
            type: 'STATUS'
        });
        setRejectionReason(""); // Reset reason when modal opens
    }

    function handleDelete(id: string) {
        setConfirmConfig({
            isOpen: true,
            id,
            type: 'DELETE'
        });
    }

    const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

    async function onConfirm() {
        if (confirmConfig.id) {
            if (confirmConfig.type === 'STATUS' && confirmConfig.status) {
                await updatePurchaseStatus(confirmConfig.id, confirmConfig.status, rejectionReason);
            } else if (confirmConfig.type === 'DELETE') {
                await deletePurchase(confirmConfig.id);
            }
            setConfirmConfig({ ...confirmConfig, isOpen: false });
            setRejectionReason("");
        }
    }

    return (
        <div>
            <AdminHeader
                title="Purchases"
                description="Manage lesson enrollments and payments"
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by student, index, or lesson..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminTable headers={["Student", "Lesson Pack", "Slip", "Price", "Date", "Status", "Actions"]}>
                {filteredPurchases.map((purchase) => (
                    <AdminTableRow key={purchase.id}>
                        <AdminTableCell>
                            <div>
                                <p className="font-bold text-slate-900">{purchase.student.firstName} {purchase.student.lastName}</p>
                                <span className="text-xs text-slate-500 font-mono">{purchase.student.indexNumber}</span>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <p className="font-bold text-slate-700 max-w-[200px] truncate" title={purchase.lesson.name}>{purchase.lesson.name}</p>
                        </AdminTableCell>
                        <AdminTableCell>
                            {purchase.slipUrl ? (
                                <button
                                    onClick={() => setSelectedSlip(purchase.slipUrl)}
                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 font-bold text-xs"
                                >
                                    <Eye size={14} />
                                    View Slip
                                </button>
                            ) : (
                                <span className="text-xs text-slate-400 font-medium italic">No slip</span>
                            )}
                        </AdminTableCell>
                        <AdminTableCell>LKR {purchase.totalPrice}</AdminTableCell>
                        <AdminTableCell>
                            <span className="text-xs text-slate-500">
                                {new Date(purchase.createdAt).toLocaleDateString()}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${purchase.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                                purchase.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                    'bg-amber-50 text-amber-600'
                                }`}>
                                {purchase.status === 'APPROVED' && <Check size={12} />}
                                {purchase.status === 'REJECTED' && <X size={12} />}
                                {purchase.status === 'PENDING' && <Clock size={12} />}
                                {purchase.status}
                            </span>
                        </AdminTableCell>
                        <AdminTableCell>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <select
                                        value={purchase.status}
                                        onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border-2 cursor-pointer outline-none transition-all ${purchase.status === 'APPROVED' ? 'border-green-100 bg-green-50 text-green-700 hover:border-green-200' :
                                            purchase.status === 'REJECTED' ? 'border-red-100 bg-red-50 text-red-700 hover:border-red-200' :
                                                'border-amber-100 bg-amber-50 text-amber-700 hover:border-amber-200'
                                            }`}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(purchase.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete Purchase"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                            {purchase.status === 'REJECTED' && purchase.rejectionReason && (
                                <p className="mt-1.5 text-[10px] font-medium text-rose-600 leading-tight max-w-[150px]">
                                    Reason: {purchase.rejectionReason}
                                </p>
                            )}
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
                {filteredPurchases.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No purchases found.</td>
                    </tr>
                )}
            </AdminTable>

            {/* Slip Image Preview Modal */}
            <AnimatePresence>
                {selectedSlip && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSlip(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl max-h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <Eye className="text-indigo-600" size={20} />
                                    Payment Slip Verification
                                </h3>
                                <button
                                    onClick={() => setSelectedSlip(null)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-4 md:p-8 overflow-auto max-h-[70vh] flex items-center justify-center bg-slate-50">
                                <div className="relative w-full aspect-auto min-h-[400px]">
                                    <Image
                                        src={selectedSlip}
                                        alt="Payment Slip"
                                        width={1000}
                                        height={1400}
                                        className="rounded-xl object-contain shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                                <button
                                    onClick={() => setSelectedSlip(null)}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-200"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={onConfirm}
                title={confirmConfig.type === 'DELETE' ? "Delete Purchase" : "Confirm Status Change"}
                description={confirmConfig.type === 'DELETE'
                    ? "Are you sure you want to permanently delete this purchase record? This action cannot be undone."
                    : `Are you sure you want to mark this purchase as ${confirmConfig.status}?`
                }
                confirmText={confirmConfig.type === 'DELETE' ? "Delete" : confirmConfig.status === 'APPROVED' ? "Approve" : confirmConfig.status === 'REJECTED' ? "Reject" : "Set Pending"}
                variant={confirmConfig.type === 'DELETE' || confirmConfig.status === 'REJECTED' ? "danger" : confirmConfig.status === 'APPROVED' ? "success" : "info"}
            >
                {confirmConfig.status === 'REJECTED' && (
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block text-left">
                            Rejection Reason
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejection (e.g., Invalid slip, amount mismatch...)"
                            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-700 text-sm font-medium focus:border-rose-200 outline-none transition-all placeholder:text-slate-300 min-h-[120px] resize-none"
                            autoFocus
                        />
                    </div>
                )}
            </ConfirmModal>
        </div>
    );
}
