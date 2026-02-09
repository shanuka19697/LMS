import { getAdmins } from "@/actions/admin";
import AdminManagement from "@/components/admin/admins/AdminManagement";

export const dynamic = 'force-dynamic';

export default async function AdminsPage() {
    const admins = await getAdmins();

    return (
        <AdminManagement initialAdmins={admins} />
    );
}
