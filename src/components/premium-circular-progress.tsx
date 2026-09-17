"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PremiumCircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showValue?: boolean;
}

export function PremiumCircularProgress({
    value,
    size = 200,
    strokeWidth = 14,
    className,
    showValue = true,
}: PremiumCircularProgressProps) {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setProgress(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div
            className={cn("relative flex items-center justify-center group", className)}
            style={{ width: size, height: size }}
        >
            {/* Orbital Circles (Gray/Black) */}
            <div
                className="absolute inset-2 rounded-full border border-foreground/5 animate-[spin_20s_linear_infinite] opacity-50"
            />
            <div
                className="absolute inset-4 rounded-full border border-dashed border-foreground/5 animate-[spin_30s_linear_infinite_reverse] opacity-30"
            />

            {/* Central Neutral Glow */}
            <div
                className="absolute inset-0 rounded-full bg-foreground/5 blur-3xl group-hover:bg-foreground/10 transition-colors duration-700"
            />

            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 z-10"
            >
                <defs>
                    <linearGradient id="monochromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" className="text-foreground" />
                        <stop offset="100%" stopColor="currentColor" className="text-foreground/40" />
                    </linearGradient>

                    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Track (Subtle Gray) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-foreground/5"
                />

                {/* Main Progress Stroke (Black/White) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#monochromeGradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
                    style={{ filter: "url(#subtleGlow)" }}
                />
            </svg>

            {/* Internal Content (B&W Typography) */}
            {showValue && (
                <div className="absolute flex flex-col items-center justify-center z-20 select-none">
                    <div className="relative">
                        <span className="text-5xl font-black italic tracking-tighter text-foreground decoration-foreground/20">
                            {Math.round(progress)}
                            <span className="text-2xl not-italic ml-0.5 opacity-40">%</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1 h-1 rounded-full bg-foreground animate-pulse" />
                        <span className="text-[9px] uppercase font-black tracking-[0.3em] text-foreground/60">
                            Amortizado
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
