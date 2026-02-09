import { getLessonPacks } from "@/actions/lesson";
import { getStudentProfile } from "@/actions/student";
import LessonStoreClient from "@/components/dashboard/LessonStoreClient";
import { Sparkles } from "lucide-react";

import { getSession } from "@/actions/auth";

export default async function LessonStorePage() {
    const studentIndex = await getSession();
    const student = studentIndex ? await getStudentProfile(studentIndex) : null;
    const examYear = student?.examYear;

    const lessons = await getLessonPacks(examYear);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Premium Education</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 leading-tight">
                        Lesson <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Store</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium mt-2">
                        Unlock premium content tailored for your exam year {examYear ? <span className="text-indigo-600 font-bold">({examYear})</span> : ''}.
                    </p>
                </div>
            </div>

            <LessonStoreClient initialLessons={lessons} />
        </div>
    );
}
