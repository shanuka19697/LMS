import { getAdminPurchases } from "@/actions/sales";
import SalesManagement from "@/components/admin/sales/SalesManagement";

export default async function SalesPage() {
    const purchases = await getAdminPurchases();

    return (
        <SalesManagement initialPurchases={purchases} />
    );
}
