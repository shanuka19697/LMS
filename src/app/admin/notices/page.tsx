
import { getAdminNotices } from "@/actions/notice";
import { getExamYears } from "@/actions/examYear";
import NoticeManagement from "@/components/admin/notices/NoticeManagement";

export const dynamic = 'force-dynamic';

export default async function NoticesPage() {
    const notices = await getAdminNotices();
    const examYears = await getExamYears(true);

    return <NoticeManagement initialNotices={notices} examYears={examYears} />;
}
