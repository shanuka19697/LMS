import { getAdminStudents } from "@/actions/student";
import { getExamYears } from "@/actions/examYear";
import StudentManagement from "@/components/admin/students/StudentManagement";

export default async function StudentsPage() {
    const [students, examYears] = await Promise.all([
        getAdminStudents(),
        getExamYears(true)
    ]);

    return (
        <StudentManagement initialStudents={students} activeExamYears={examYears} />
    );
}
