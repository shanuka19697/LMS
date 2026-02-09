import { getAdminRole } from "@/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const role = await getAdminRole();

    if (role === 'PAPER_ADMIN') {
        redirect("/admin/papers");
    }

    if (role === 'MESSAGE_ADMIN') {
        redirect("/admin/messages");
    }

    // Default for SUPER_ADMIN or fallback
    redirect("/admin/students");
}
