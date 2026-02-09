import { getLessonPackById } from "@/actions/lesson";
import LessonDetailClient from "@/components/dashboard/LessonDetailClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LessonPackDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lesson = await getLessonPackById(id);

    if (!lesson) {
        return notFound();
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Breadcrumb / Back */}
            <Link
                href="/dashboard/lesson-store"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors group"
            >
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-all">
                    <ChevronLeft size={16} />
                </div>
                <span>Back to Store</span>
            </Link>

            <LessonDetailClient lesson={lesson} />
        </div>
    );
}
