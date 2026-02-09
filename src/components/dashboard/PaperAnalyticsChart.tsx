"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

interface PaperAnalyticsChartProps {
    data: { name: string; full: number; final: number; timing: number }[];
}

type FilterType = "ALL" | "FULL" | "FINAL" | "TIMING";

export default function PaperAnalyticsChart({ data }: PaperAnalyticsChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

    // Strict Data Filtering logic
    const displayData = useMemo(() => {
        if (activeFilter === "ALL") return data;
        if (activeFilter === "FULL") return data.filter(d => d.full > 0);
        if (activeFilter === "FINAL") return data.filter(d => d.final > 0);
        if (activeFilter === "TIMING") return data.filter(d => d.timing > 0);
        return data;
    }, [data, activeFilter]);

    // Dynamic max value calculation for accuracy
    const maxVal = useMemo(() => {
        if (!displayData || displayData.length === 0) return 100;
        const relevantValues = displayData.flatMap(d => {
            if (activeFilter === "FULL") return [d.full];
            if (activeFilter === "FINAL") return [d.final];
            if (activeFilter === "TIMING") return [d.timing];
            return [d.full, d.final, d.timing];
        });
        const highestMark = Math.max(...relevantValues);
        // Round up to nearest 50 for a clean grid, minimum 100
        return Math.max(100, Math.ceil(highestMark / 50) * 50);
    }, [displayData, activeFilter]);

    // SVG sizing
    const width = 800;
    const height = 350;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Coordinate mapping
    const getX = (i: number) => {
        if (displayData.length <= 1) return padding + chartWidth / 2;
        return padding + (i * (chartWidth / (displayData.length - 1 || 1)));
    };

    const getY = (val: number) => {
        return height - padding - (val / maxVal) * chartHeight;
    };

    // Paths generation
    const { fullPath, finalPath, timingPath, fullArea, finalArea, timingArea } = useMemo(() => {
        if (!displayData || displayData.length === 0) return { fullPath: "", finalPath: "", timingPath: "", fullArea: "", finalArea: "", timingArea: "" };

        const fPath = displayData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.full)}`).join(' ');
        const fiPath = displayData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.final)}`).join(' ');
        const tPath = displayData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.timing)}`).join(' ');

        return {
            fullPath: fPath,
            finalPath: fiPath,
            timingPath: tPath,
            fullArea: `${fPath} L ${getX(displayData.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`,
            finalArea: `${fiPath} L ${getX(displayData.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`,
            timingArea: `${tPath} L ${getX(displayData.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`
        };
    }, [displayData, maxVal]);

    // Grid steps
    const steps = 4;
    const gridLines = Array.from({ length: steps + 1 }, (_, i) => (maxVal / steps) * i);

    const isFullVisible = activeFilter === "ALL" || activeFilter === "FULL";
    const isFinalVisible = activeFilter === "ALL" || activeFilter === "FINAL";
    const isTimingVisible = activeFilter === "ALL" || activeFilter === "TIMING";

    return (
        <div className="bg-white/95 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] group/chart overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black font-heading text-gray-900 tracking-tight">Performance Analysis</h3>
                    <p className="text-gray-500 font-semibold text-sm flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        Focused timeline for {activeFilter === "ALL" ? "comprehensive" : activeFilter.toLowerCase()} performance
                    </p>
                </div>

                {/* Premium Toggles */}
                <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50 self-start">
                    {(["ALL", "FULL", "TIMING", "FINAL"] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setActiveFilter(type);
                                setHoveredIdx(null); // Reset hover on filter change
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeFilter === type
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {type === "ALL" ? "Compare All" : `${type}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full aspect-[16/8] md:aspect-[16/7]">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Y-Axis Grid Lines & Labels */}
                    {gridLines.map((val) => (
                        <g key={val}>
                            <line
                                x1={padding}
                                y1={getY(val)}
                                x2={width - padding}
                                y2={getY(val)}
                                className="stroke-gray-100 stroke-[1.5]"
                                strokeDasharray="6 6"
                            />
                            <text
                                x={padding - 15}
                                y={getY(val) + 5}
                                className="fill-gray-400 text-sm font-black text-right"
                                textAnchor="end"
                            >
                                {val}
                            </text>
                        </g>
                    ))}

                    {/* Hover Guide Line */}
                    {hoveredIdx !== null && displayData[hoveredIdx] && (
                        <motion.line
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            x1={getX(hoveredIdx)}
                            y1={padding}
                            x2={getX(hoveredIdx)}
                            y2={height - padding}
                            className="stroke-gray-200 stroke-[2]"
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* Area Fills with Dynamic Isolation */}
                    <AnimatePresence mode="wait">
                        <motion.g
                            key={activeFilter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {isFullVisible && (
                                <path
                                    d={fullArea}
                                    className="fill-indigo-600 opacity-[0.05]"
                                />
                            )}
                            {isFinalVisible && (
                                <path
                                    d={finalArea}
                                    className="fill-rose-500 opacity-[0.05]"
                                />
                            )}
                            {isTimingVisible && (
                                <path
                                    d={timingArea}
                                    className="fill-emerald-500 opacity-[0.05]"
                                />
                            )}
                        </motion.g>
                    </AnimatePresence>

                    {/* Main Trend Lines */}
                    <motion.path
                        animate={{
                            opacity: isFullVisible ? 1 : 0,
                            strokeWidth: activeFilter === "FULL" ? 5 : 3,
                            d: fullPath
                        }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="stroke-indigo-600 fill-none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <motion.path
                        animate={{
                            opacity: isFinalVisible ? 1 : 0,
                            strokeWidth: activeFilter === "FINAL" ? 5 : 3,
                            d: finalPath
                        }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="stroke-rose-500 fill-none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <motion.path
                        animate={{
                            opacity: isTimingVisible ? 1 : 0,
                            strokeWidth: activeFilter === "TIMING" ? 5 : 3,
                            d: timingPath
                        }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="stroke-emerald-500 fill-none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Interactive Data Points */}
                    {displayData.map((d, i) => (
                        <g
                            key={`${d.name}-${i}`}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className="cursor-pointer group"
                        >
                            <rect
                                x={getX(i) - 30}
                                y={padding}
                                width={60}
                                height={chartHeight}
                                className="fill-transparent"
                            />

                            {/* Full Point */}
                            {isFullVisible && (
                                <motion.circle
                                    animate={{
                                        cx: getX(i),
                                        cy: getY(d.full),
                                        r: hoveredIdx === i ? 9 : 6,
                                        opacity: isFullVisible ? 1 : 0
                                    }}
                                    className="fill-white stroke-indigo-600 stroke-[4] transition-all duration-300"
                                />
                            )}

                            {/* Final Point */}
                            {isFinalVisible && (
                                <motion.circle
                                    animate={{
                                        cx: getX(i),
                                        cy: getY(d.final),
                                        r: hoveredIdx === i ? 9 : 6,
                                        opacity: isFinalVisible ? 1 : 0
                                    }}
                                    className="fill-white stroke-rose-500 stroke-[4] transition-all duration-300"
                                />
                            )}
                            {/* Timing Point */}
                            {isTimingVisible && (
                                <motion.circle
                                    animate={{
                                        cx: getX(i),
                                        cy: getY(d.timing),
                                        r: hoveredIdx === i ? 9 : 6,
                                        opacity: isTimingVisible ? 1 : 0
                                    }}
                                    className="fill-white stroke-emerald-500 stroke-[4] transition-all duration-300"
                                />
                            )}

                            {/* X-Axis Labels */}
                            <text
                                x={getX(i)}
                                y={height - 15}
                                className={`text-[12px] font-black uppercase tracking-tight transition-all duration-300 ${hoveredIdx === i ? 'fill-gray-900' : 'fill-gray-400'
                                    }`}
                                textAnchor="middle"
                            >
                                {d.name && d.name.length > 12 ? d.name.substring(0, 10) + '..' : (d.name || "")}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Accuracy Tooltip */}
                <AnimatePresence>
                    {hoveredIdx !== null && displayData[hoveredIdx] && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 15 }}
                            className="absolute z-50 pointer-events-none"
                            style={{
                                left: `${(getX(hoveredIdx) / width) * 100}%`,
                                top: `${(Math.min(
                                    isFullVisible ? getY(displayData[hoveredIdx].full) : 1000,
                                    isFinalVisible ? getY(displayData[hoveredIdx].final) : 1000,
                                    isTimingVisible ? getY(displayData[hoveredIdx].timing) : 1000
                                ) / height) * 100}%`,
                                transform: 'translate(-50%, -130%)'
                            }}
                        >
                            <div className="bg-gray-900/95 backdrop-blur-xl text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 min-w-[200px] space-y-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-white/10 pb-3">
                                    {displayData[hoveredIdx].name}
                                </div>
                                <div className="space-y-3">
                                    {isFullVisible && (
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                                                <span className="text-[13px] font-bold text-gray-300">Full Mark</span>
                                            </div>
                                            <span className="text-base font-black text-indigo-400 tracking-tight">{displayData[hoveredIdx].full}</span>
                                        </div>
                                    )}
                                    {isFinalVisible && (
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
                                                <span className="text-[13px] font-bold text-gray-300">Final Mark</span>
                                            </div>
                                            <span className="text-base font-black text-rose-400 tracking-tight">{displayData[hoveredIdx].final}</span>
                                        </div>
                                    )}
                                    {isTimingVisible && (
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[13px] font-bold text-gray-300">Timing</span>
                                            </div>
                                            <span className="text-base font-black text-emerald-400 tracking-tight">{displayData[hoveredIdx].timing}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
