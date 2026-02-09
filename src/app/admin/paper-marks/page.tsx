import { getAdminMarks } from "@/actions/mark";
import MarkManagement from "@/components/admin/marks/MarkManagement";

export default async function MarksPage() {
    const marks = await getAdminMarks();

    return (
        <MarkManagement initialMarks={marks} />
    );
}
