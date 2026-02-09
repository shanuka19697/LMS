import { getAdminZoomMeetings } from "@/actions/zoom";
import { getExamYears } from "@/actions/examYear";
import ZoomManagement from "@/components/admin/zoom/ZoomManagement";

export const dynamic = 'force-dynamic';

export default async function ZoomPage() {
    const [meetings, examYears] = await Promise.all([
        getAdminZoomMeetings(),
        getExamYears(true)
    ]);

    return (
        <ZoomManagement initialMeetings={meetings} examYears={examYears} />
    );
}
