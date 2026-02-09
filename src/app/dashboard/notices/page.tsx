
import { getStudentNotices } from "@/actions/notice";
import { getStudentProfile } from "@/actions/student";
import { getSession } from "@/actions/auth";
import NoticeBoard from "@/components/dashboard/NoticeBoard";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StudentNoticesPage() {
    const studentIndex = await getSession();
    if (!studentIndex) redirect("/");

    const profile = await getStudentProfile(studentIndex);
    if (!profile) redirect("/");

    const notices = await getStudentNotices(profile.examYear);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 font-heading">Notice Board</h1>
                <p className="text-slate-500">Latest announcements for {profile.examYear} batch</p>
            </div>

            <NoticeBoard notices={notices} />
        </div>
    );
}
