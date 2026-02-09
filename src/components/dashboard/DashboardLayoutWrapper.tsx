"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardProtector from "@/components/dashboard/DashboardProtector";

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    studentIndex: string;
    userName: string;
    userEmail: string;
}

export default function DashboardLayoutWrapper({
    children,
    studentIndex,
    userName,
    userEmail
}: DashboardLayoutWrapperProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DashboardProtector />

            {/* Sidebar - Controlled Component */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 relative">
                <Header
                    userName={userName}
                    userEmail={userEmail}
                    studentIndex={studentIndex}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scroll-smooth">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </div>
        </div>
    );
}
