"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumCircularProgress } from "./premium-circular-progress";
import { Wallet } from "lucide-react";

interface LoanStatsProps {
    principal: number;
    remaining: number;
    totalPaid: number;
    interestPaid: number;
    children?: React.ReactNode;
}

function formatCOP(val: number) {
    return "$" + Math.round(val).toLocaleString('es-CO');
}

export function LoanStats({ principal, remaining, totalPaid, interestPaid, children }: LoanStatsProps) {
    const paidPrincipal = Math.max(0, principal - remaining);
    const progressPercent = Math.min(100, Math.max(0, (paidPrincipal / principal) * 100));

    return (
        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            <Card className="lg:col-span-2 overflow-hidden border-foreground/10 shadow-2xl bg-white dark:bg-black/40 backdrop-blur-xl relative group flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-30" />

                <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">
                            Estado del Capital Amortizado
                        </CardTitle>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-foreground/10" />
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 pt-2 flex-1 flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-10">
                        <div className="relative isolate shrink-0">
                            <PremiumCircularProgress
                                value={progressPercent}
                                size={190}
                                strokeWidth={15}
                            />
                        </div>

                        <div className="flex-1 min-w-0 space-y-6 w-full">
                            <div className="flex flex-wrap items-baseline justify-between gap-2 min-w-0">
                                <div className="space-y-0.5 min-w-0">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Recuperado</p>
                                    <p className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground truncate" title={formatCOP(paidPrincipal)}>
                                        {formatCOP(paidPrincipal)}
                                    </p>
                                </div>
                                <div className="space-y-0.5 text-right min-w-0">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Inversión Base</p>
                                    <p className="text-base sm:text-lg font-bold text-foreground/40 italic truncate" title={formatCOP(principal)}>
                                        {formatCOP(principal)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-0.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Progresión Futura</span>
                                    </div>
                                    <span className="text-sm font-black italic text-foreground">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="relative h-2 w-full bg-foreground/5 rounded-full overflow-hidden p-0">
                                    <div
                                        className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                                <div className="p-3.5 sm:p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 min-w-0 overflow-hidden flex flex-col justify-between">
                                    <p className="text-[9px] sm:text-[10px] text-foreground/60 font-black uppercase tracking-wider truncate mb-1">
                                        Interés Retornado
                                    </p>
                                    <p className="text-lg sm:text-xl xl:text-2xl font-black text-foreground/80 tracking-tight tabular-nums truncate" title={formatCOP(interestPaid)}>
                                        {formatCOP(interestPaid)}
                                    </p>
                                </div>

                                <div className="p-3.5 sm:p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 min-w-0 overflow-hidden flex flex-col justify-between">
                                    <p className="text-[9px] sm:text-[10px] text-foreground/60 font-black uppercase tracking-wider truncate mb-1">
                                        Flujo Total
                                    </p>
                                    <p className="text-lg sm:text-xl xl:text-2xl font-black text-foreground/80 tracking-tight tabular-nums truncate" title={formatCOP(totalPaid)}>
                                        {formatCOP(totalPaid)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-5 justify-between">
                <Card className="bg-foreground text-background shadow-2xl border-none relative overflow-hidden flex-1 profile-stats-card p-2 flex flex-col justify-center min-h-[160px]">
                    <CardHeader className="pb-2 pt-6 px-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Saldo Pendiente</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-1 relative z-10">
                        <div className="text-3xl sm:text-4xl font-black tracking-tighter italic leading-none truncate" title={formatCOP(remaining)}>
                            {formatCOP(remaining)}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Area: Registrar Pago */}
                <div className="flex flex-col gap-3">
                    {children}

                    <div className="p-4 rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02] flex items-center gap-3 group/box">
                        <div className="p-2 rounded-full bg-foreground/5 shrink-0">
                            <Wallet className="h-4 w-4 text-foreground/40" />
                        </div>
                        <p className="text-[11px] font-medium text-foreground/60 leading-tight">
                            El registro de pagos impactará el saldo actual mediante lógica francesa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
