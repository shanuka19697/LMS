
import { getAdminPapers } from "@/actions/paper";
import { getExamYears } from "@/actions/examYear";
import PaperManagement from "@/components/admin/papers/PaperManagement";

export default async function PapersPage() {
    const papers = await getAdminPapers();
    const examYears = await getExamYears(true);
    return <PaperManagement initialPapers={papers} examYears={examYears} />;
}
