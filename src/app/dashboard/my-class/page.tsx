import { getEnrolledLessons } from "@/actions/lesson";
import EnrolledLessonCard from "@/components/dashboard/EnrolledLessonCard";
import { BookOpen } from "lucide-react";

// ... imports
import { getActiveZoomMeetings } from "@/actions/zoom";
import ZoomMeetingCard from "@/components/dashboard/ZoomMeetingCard";
import { getSession } from "@/actions/auth";
import { getStudentProfile } from "@/actions/student";

export default async function MyClassPage() {
    const studentIndex = await getSession();
    const profile = studentIndex ? await getStudentProfile(studentIndex) : null;

    const lessons = await getEnrolledLessons();
    const activeMeetings = await getActiveZoomMeetings(profile?.examYear);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Learning Workspace</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 leading-tight">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Classes</span>
                </h1>
                <p className="text-gray-500 text-lg font-medium mt-2">Access your enrolled courses and continue your learning journey.</p>
            </div>

            {/* Live Classes Section */}
            {activeMeetings.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <h2 className="text-2xl font-black font-heading text-slate-900">Live Classes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeMeetings.map((meeting: any) => (
                            <ZoomMeetingCard key={meeting.id} meeting={meeting} />
                        ))}
                    </div>
                </div>
            )}

            {/* Lessons Grid */}
            {lessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((lesson: any) => (
                        <EnrolledLessonCard key={lesson.id} lesson={lesson} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="inline-flex p-8 bg-white rounded-[2.5rem] shadow-sm text-gray-300 mb-6">
                        <BookOpen size={48} />
                    </div>
                    <h3 className="text-2xl font-black font-heading text-gray-900 mb-2">No Enrolled Lessons Found</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto">
                        You haven't been enrolled in any lessons yet or your requests are still pending.
                    </p>
                    <a
                        href="/dashboard/lesson-store"
                        className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Browse Lesson Store
                    </a>
                </div>
            )}
        </div>
    );
}
