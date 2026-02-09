import DailyActivityGraph from "@/components/dashboard/DailyActivityGraph";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import { Trophy, Fingerprint, Building2, CalendarRange, Flame, Award } from "lucide-react";
import { getDailyWorkActivity, getStudentProfile, hasLoggedToday } from "@/actions/student";
import { getStudentNotices } from "@/actions/notice";
import { getSession } from "@/actions/auth";
import NoticeBoard from "@/components/dashboard/NoticeBoard";
import DailyWorkModalWrapper from "@/components/dashboard/DailyWorkModalWrapper";
import StudentInfoCard from "@/components/dashboard/StudentInfoCard";
import DateTimeDisplay from "@/components/dashboard/DateTimeDisplay";

export default async function Dashboard() {
    const studentIndex = await getSession();
    if (!studentIndex) return null;

    const [profile, activityDataRaw, loggedToday] = await Promise.all([
        getStudentProfile(studentIndex),
        getDailyWorkActivity(studentIndex),
        hasLoggedToday(studentIndex)
    ]);

    const notices = profile ? await getStudentNotices(profile.examYear) : [];

    // Calculate Average
    const totalHours = activityDataRaw.reduce((acc, curr) => acc + curr.hours, 0);
    const averageHours = (totalHours / 7).toFixed(1);

    // Function to calculate bar height (max 12 hours for 100%)
    const calculateHeight = (hours: number) => {
        const percentage = Math.min((hours / 12) * 100, 100);
        return `${percentage}%`;
    };

    const activityData = activityDataRaw.map(item => ({
        ...item,
        height: calculateHeight(item.hours)
    }));

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Modal for daily work logging */}
            {!loggedToday && <DailyWorkModalWrapper studentIndex={studentIndex} />}

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-heading text-slate-900 leading-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 animate-gradient">{profile?.firstName || "Student"}</span>! 👋
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 font-medium">Your learning journey is on fire. Stay consistent! 🔥</p>
                </div>
                <DateTimeDisplay />
            </div>

            {/* Dashboard Main Content Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">

                {/* Left/Main Column: Info Cards & Performance */}
                <div className="w-full lg:col-span-3 space-y-6 md:space-y-8 order-1">
                    {/* Student Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        <StudentInfoCard
                            label="Index Number"
                            value={profile?.indexNumber || "idx-000000"}
                            icon={<Fingerprint className="w-5 h-5 lg:w-6 lg:h-6" />}
                            color="bg-purple-500"
                        />
                        <StudentInfoCard
                            label="Institute"
                            value={profile?.institute || "Horizon Tech"}
                            subtext="University Center"
                            icon={<Building2 className="w-5 h-5 lg:w-6 lg:h-6" />}
                            color="bg-blue-500"
                        />
                        <StudentInfoCard
                            label="Exam Year"
                            value={profile?.examYear || "2024"}
                            icon={<CalendarRange className="w-5 h-5 lg:w-6 lg:h-6" />}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Mobile Only: Notice & Calendar (Placed right after Info Cards as requested) */}
                    <div className="lg:hidden space-y-6">
                        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                            <NoticeBoard notices={notices} compact={true} />
                        </div>
                        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                            <DashboardCalendar />
                        </div>
                    </div>

                    {/* Engagement Strip (Mobile Only) */}
                    <div className="grid grid-cols-2 lg:hidden gap-4">
                        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-4 rounded-[2rem] text-white shadow-xl shadow-orange-100 flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none mb-1">Streak</p>
                                <h3 className="text-lg font-black leading-none">{profile?.currentStreak || 0} Days</h3>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-4 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none mb-1">Avg</p>
                                <h3 className="text-lg font-black leading-none">{averageHours}h / D</h3>
                            </div>
                        </div>
                    </div>

                    {/* Performance Row: Graph & Achievement */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] p-1 overflow-hidden h-[350px] md:h-[400px]">
                                <DailyActivityGraph data={activityData} averageHours={averageHours} totalHours={totalHours} />
                            </div>
                        </div>

                        <div className="md:col-span-1 space-y-6">
                            {/* Achievement Stack */}
                            {profile?.badges && profile.badges.length > 0 && (
                                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-100/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <Award size={18} className="text-amber-500" /> Achievements
                                        </h4>
                                    </div>
                                    <div className="flex -space-x-3">
                                        {profile.badges.map((badge: any, idx: number) => (
                                            <div
                                                key={idx}
                                                title={badge.description}
                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center shadow-lg hover:-translate-y-2 transition-all cursor-help"
                                            >
                                                <div className="w-9 h-9 bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-black">
                                                    {badge.name.charAt(0)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Keep up the great work! 🎉</p>
                                </div>
                            )}

                            {/* Secondary Desktop Stats */}
                            <div className="hidden lg:block bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                            <Flame className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Main Streak</p>
                                            <h3 className="text-2xl font-black font-heading leading-tight">{profile?.currentStreak || 0} Days</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                            <Trophy className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Daily Average</p>
                                            <h3 className="text-2xl font-black font-heading leading-tight">{averageHours}h / Day</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Notice & Calendar (Desktop Only) */}
                <div className="hidden lg:flex w-full lg:col-span-1 flex-col space-y-6 lg:order-2">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                        <NoticeBoard notices={notices} compact={true} />
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                        <DashboardCalendar />
                    </div>
                </div>
            </div>
        </div>
    );
}
