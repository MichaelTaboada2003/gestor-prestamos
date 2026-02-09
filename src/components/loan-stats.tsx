"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LoanStatsProps {
    principal: number;
    remaining: number;
    totalPaid: number;
    interestPaid: number;
}

export function LoanStats({ principal, remaining, totalPaid, interestPaid }: LoanStatsProps) {
    const paidPrincipal = principal - remaining;
    const progressPercent = (paidPrincipal / principal) * 100;

    const chartData = [
        { name: 'Pagado', value: paidPrincipal, color: 'hsl(var(--primary))' },
        { name: 'Pendiente', value: remaining, color: 'hsl(var(--muted))' },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 overflow-hidden border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Progreso de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-[180px] w-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-bold">${paidPrincipal.toLocaleString('es-CO')}</p>
                                    <p className="text-sm text-muted-foreground">de ${principal.toLocaleString('es-CO')} amortizados</p>
                                </div>
                                <p className="text-2xl font-bold text-primary">{Math.round(progressPercent)}%</p>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Intereses Pagados</p>
                                    <p className="text-lg font-semibold text-amber-500">${interestPaid.toLocaleString('es-CO')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Total Desembolsado</p>
                                    <p className="text-lg font-semibold">${totalPaid.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase opacity-80">Saldo Actual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-bold tracking-tighter">
                        ${remaining.toLocaleString('es-CO')}
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Este es el capital insoluto que resta por cancelar. Cualquier abono extra reducirá este monto directamente.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
