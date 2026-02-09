import { getAdminPerformance } from "@/actions/performance";
import PerformanceManagement from "@/components/admin/performance/PerformanceManagement";

export const dynamic = 'force-dynamic';

export default async function PerformancePage() {
    const records = await getAdminPerformance();

    return (
        <PerformanceManagement initialRecords={records} />
    );
}
