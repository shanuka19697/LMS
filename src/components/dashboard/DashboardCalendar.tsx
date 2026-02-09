"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardCalendar() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [displayDate, setDisplayDate] = useState<Date | null>(null);

    useEffect(() => {
        const now = new Date();
        setCurrentDate(now);
        setDisplayDate(now);
    }, []);

    if (!currentDate || !displayDate) return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
        </div>
    );

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    const numDays = getDaysInMonth(displayDate);
    const firstDay = getFirstDayOfMonth(displayDate);

    // Create arrays for blanks and days
    const blanks = Array.from({ length: firstDay }, (_, i) => null);
    const monthDays = Array.from({ length: numDays }, (_, i) => i + 1);

    // Combine to create the full grid list
    const allCells = [...blanks, ...monthDays];

    // Pad with trailing nulls to ensure exactly 42 cells (6 rows x 7 cols)
    // This keeps the calendar height stable regardless of month length
    const totalSlots = 42;
    const remainingSlots = totalSlots - allCells.length;
    const trailingPadding = Array.from({ length: remainingSlots }, () => null);

    const finalGrid = [...allCells, ...trailingPadding];

    const monthYearString = displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white p-5 lg:p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="font-bold font-heading text-gray-900 text-xl tracking-tight">{monthYearString}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-primary transition-colors border border-transparent hover:border-blue-100"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-primary transition-colors border border-transparent hover:border-blue-100"
                        aria-label="Next Month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 flex-shrink-0">
                {days.map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid - Fixed 6 rows */}
            <div className="grid grid-cols-7 grid-rows-6 gap-1 lg:gap-2 text-center h-full">
                {finalGrid.map((dayValue, index) => {
                    // If dayValue is null, render empty slot
                    if (dayValue === null) {
                        return <div key={`empty-${index}`} />;
                    }

                    const date = dayValue;
                    const isToday =
                        date === currentDate.getDate() &&
                        displayDate.getMonth() === currentDate.getMonth() &&
                        displayDate.getFullYear() === currentDate.getFullYear();

                    const hasEvent = (date % 7 === 0) || (date === 15);

                    return (
                        <div key={`day-${date}`} className="flex flex-col items-center justify-center relative group cursor-pointer h-full w-full">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200
                     ${isToday
                                    ? "bg-primary text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-100"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"}
                  `}>
                                {date}
                            </div>
                            {/* Event Dot */}
                            {hasEvent && !isToday && (
                                <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
