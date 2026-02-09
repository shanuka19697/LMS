import { getAdminLessons } from "@/actions/lesson";
import { getAdminVideos } from "@/actions/video";
import { getExamYears } from "@/actions/examYear";
import LessonManagement from "@/components/admin/lessons/LessonManagement";

export default async function LessonsPage() {
    const [lessons, videos, examYears] = await Promise.all([
        getAdminLessons(),
        getAdminVideos(),
        getExamYears(true) // Fetch only active years
    ]);

    return (
        <LessonManagement initialLessons={lessons} allVideos={videos} activeExamYears={examYears} />
    );
}
