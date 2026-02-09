import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";
import { getSession } from "@/actions/auth";
import { getStudentProfile } from "@/actions/student";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const studentIndex = await getSession();
    let profile = null;

    if (studentIndex) {
        profile = await getStudentProfile(studentIndex);
    }

    return (
        <DashboardLayoutWrapper
            studentIndex={studentIndex || ""}
            userName={`${profile?.firstName || "Student"} ${profile?.lastName || ""}`}
            userEmail={profile?.email || ""}
        >
            {children}
        </DashboardLayoutWrapper>
    );
}
