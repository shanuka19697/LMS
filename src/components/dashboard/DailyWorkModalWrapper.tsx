"use client";

import { useState } from "react";
import DailyWorkModal from "./DailyWorkModal";

interface Props {
    studentIndex: string;
}

export default function DailyWorkModalWrapper({ studentIndex }: Props) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <DailyWorkModal
            studentIndex={studentIndex}
            onClose={() => setIsOpen(false)}
        />
    );
}
