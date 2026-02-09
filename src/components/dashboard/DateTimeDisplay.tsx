"use client";

import { useState, useEffect } from "react";

export default function DateTimeDisplay() {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!date) return (
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-center md:text-right hidden sm:block min-w-[200px] animate-pulse">
            <div className="h-6 bg-gray-100 rounded mb-1"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 ml-auto"></div>
        </div>
    );

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    const dayOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', // Added seconds for "realtime" feel
    };

    return (
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-center md:text-right hidden sm:block">
            <p className="font-bold text-gray-900 text-lg">
                {date.toLocaleDateString('en-US', dateOptions)}
            </p>
            <div className="text-gray-500 text-sm font-medium flex items-center justify-end gap-2">
                <span>{date.toLocaleDateString('en-US', dayOptions)}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="tabular-nums font-mono text-blue-600 font-bold">
                    {date.toLocaleTimeString('en-US', timeOptions)}
                </span>
            </div>
        </div>
    );
}
