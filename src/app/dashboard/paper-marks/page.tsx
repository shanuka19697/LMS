import { getPaperMarks } from "@/actions/student";
import { getSession } from "@/actions/auth";
import PaperMarksClient from "@/components/dashboard/PaperMarksClient";
import { redirect } from "next/navigation";

export default async function PaperMarksPage() {
    const index = await getSession();

    if (!index) {
        redirect("/login");
    }

    const papers = await getPaperMarks(index);

    return <PaperMarksClient papers={papers || []} />;
}
