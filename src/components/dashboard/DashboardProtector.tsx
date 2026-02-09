"use client";

import { useEffect } from "react";

export default function DashboardProtector() {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12
            if (e.key === "F12") {
                e.preventDefault();
            }
            // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element / Console)
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) {
                e.preventDefault();
            }
            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
