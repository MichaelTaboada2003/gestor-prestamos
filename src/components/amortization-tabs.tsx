"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateAmortizationSchedule } from "@/lib/finances";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";

interface AmortizationTabsProps {
    loanId: string;
    principal: number;
    rate: number;
    monthsRemaining: number;
    startDate: string;
    payments: any[];
}

export function AmortizationTabs({
    principal,
    rate,
    monthsRemaining,
    startDate,
    payments
}: AmortizationTabsProps) {

    const projection = useMemo(() => {
        if (principal <= 0 || monthsRemaining <= 0) return [];
        // The projection starts from the next payment date
        // For simplicity, we assume monthly from today or last payment
        const lastPaymentDate = payments.length > 0
            ? new Date(payments[0].date)
            : new Date(startDate);

        return generateAmortizationSchedule(principal, rate, monthsRemaining, lastPaymentDate);
    }, [principal, rate, monthsRemaining, startDate, payments]);

    return (
        <Card className="border-none shadow-none bg-transparent">
            <Tabs defaultValue="projection" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="projection">Proyección Futura</TabsTrigger>
                    <TabsTrigger value="legal">Información Base</TabsTrigger>
                </TabsList>
                <TabsContent value="projection" className="pt-4 animate-in fade-in duration-500">
                    <div className="rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Cuota</TableHead>
                                    <TableHead>Fecha Estimada</TableHead>
                                    <TableHead>Monto Cuota</TableHead>
                                    <TableHead>Interés</TableHead>
                                    <TableHead>Capital</TableHead>
                                    <TableHead className="text-right">Saldo Restante</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projection.map((row) => (
                                    <TableRow key={row.installmentNumber}>
                                        <TableCell className="font-medium">#{row.installmentNumber}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(row.date, "PP", { locale: es })}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${row.installmentAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-amber-600">
                                            ${row.interestPortion.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-blue-600">
                                            ${row.capitalPortion.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            ${row.remainingBalance.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projection.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No hay cuotas pendientes. El préstamo está liquidado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="legal" className="pt-4">
                    <div className="p-6 border rounded-xl bg-card">
                        <h3 className="text-lg font-semibold mb-4">Condiciones del Crédito</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Tasa de Interés Nominal Anual</p>
                                <p className="text-xl font-bold">{rate}% E.A.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Sistema de Amortización</p>
                                <p className="text-xl font-bold">Francés (Cuota Fija)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Frecuencia de Pagos</p>
                                <p className="text-xl font-bold">Mensual</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Seguros y Otros</p>
                                <p className="text-xl font-bold text-green-600">$0.00</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
}

import { Card } from "@/components/ui/card";
