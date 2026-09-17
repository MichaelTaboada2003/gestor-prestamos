"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PremiumCircularProgress } from "./premium-circular-progress";
import { TrendingUp, ShieldCheck, Wallet } from "lucide-react";

interface LoanStatsProps {
    principal: number;
    remaining: number;
    totalPaid: number;
    interestPaid: number;
    children?: React.ReactNode;
}

export function LoanStats({ principal, remaining, totalPaid, interestPaid, children }: LoanStatsProps) {
    const paidPrincipal = principal - remaining;
    const progressPercent = (paidPrincipal / principal) * 100;

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 overflow-hidden border-foreground/10 shadow-2xl bg-white dark:bg-black/40 backdrop-blur-xl relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-30" />

                <CardHeader className="pb-0 pt-6 px-8">
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

                <CardContent className="p-8 pt-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="relative isolate">
                            <PremiumCircularProgress
                                value={progressPercent}
                                size={220}
                                strokeWidth={16}
                            />
                        </div>

                        <div className="flex-1 space-y-8 w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Recuperado</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground decoration-2 underline-offset-4 decoration-foreground/5">
                                        ${paidPrincipal.toLocaleString('es-CO')}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Inversión Base</p>
                                    <p className="text-xl font-bold text-foreground/30 italic">
                                        ${principal.toLocaleString('es-CO')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
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

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-[9px] text-foreground/60 font-black uppercase tracking-widest">Interés Retornado</p>
                                    </div>
                                    <p className="text-2xl font-black text-foreground/80">${interestPaid.toLocaleString('es-CO')}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-[9px] text-foreground/60 font-black uppercase tracking-widest">Flujo Total</p>
                                    </div>
                                    <p className="text-2xl font-black text-foreground/80">${totalPaid.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
                <Card className="bg-foreground text-background shadow-2xl border-none relative overflow-hidden flex-1 profile-stats-card p-2">
                    <CardHeader className="pb-2 pt-6 px-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Saldo Pendiente</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-8 space-y-1 relative z-10">
                        <div className="text-4xl font-black tracking-tighter italic leading-none truncate">
                            ${remaining.toLocaleString('es-CO')}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Area: Registrar Pago moved here */}
                <div className="flex-1 flex flex-col gap-4">
                    {children}

                    <div className="p-5 rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02] flex items-center gap-4 group/box translate-y-2">
                        <div className="p-2 rounded-full bg-foreground/5">
                            <Wallet className="h-4 w-4 text-foreground/40" />
                        </div>
                        <p className="text-[11px] font-bold text-foreground/50 leading-tight">
                            El registro de pagos impactará el saldo actual mediante lógica francesa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
