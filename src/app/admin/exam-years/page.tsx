import { getExamYears } from "@/actions/examYear";
import ExamYearManagement from "@/components/admin/exam-years/ExamYearManagement";

export const dynamic = 'force-dynamic';

export default async function ExamYearsPage() {
    const years = await getExamYears(); // Get all (both active/inactive) for admin management

    return (
        <ExamYearManagement initialYears={years} />
    );
}
