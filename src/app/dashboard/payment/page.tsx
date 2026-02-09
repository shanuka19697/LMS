import { getStudentPurchases } from "@/actions/lesson";
import PaymentHistoryClient from "@/components/dashboard/PaymentHistoryClient";
import { CreditCard } from "lucide-react";

export default async function PaymentPage() {
    const purchases = await getStudentPurchases();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Billing & Enrollment</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 leading-tight">
                    Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">History</span>
                </h1>
                <p className="text-gray-500 text-lg font-medium mt-2">Track your learning investments and enrollment status.</p>
            </div>

            <PaymentHistoryClient initialPurchases={purchases} />
        </div>
    );
}
