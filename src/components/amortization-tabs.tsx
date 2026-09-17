"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { parseLocalDate } from "@/lib/utils";

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

    return (
        <Card className="border-none shadow-none bg-transparent">
            <Tabs defaultValue="payments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="payments">Pagos Realizados</TabsTrigger>
                    <TabsTrigger value="legal">Información Base</TabsTrigger>
                </TabsList>
                <TabsContent value="payments" className="pt-4 animate-in fade-in duration-500">
                    <div id="export-content" className="rounded-xl border overflow-hidden bg-background">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Monto Pagado</TableHead>
                                    <TableHead>Interés</TableHead>
                                    <TableHead>Capital Base</TableHead>
                                    <TableHead>Extra Capital</TableHead>
                                    <TableHead className="text-right">Saldo Restante</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="text-muted-foreground capitalize">
                                            {formatDate(parseLocalDate(row.date), "PP", { locale: es })}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${row.amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-amber-600">
                                            ${row.interestPortion.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-blue-600">
                                            ${row.capitalPortion.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-green-600 font-medium">
                                            ${row.extraPrincipal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            ${row.remainingBalanceAfter.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {payments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No se han registrado pagos aún.
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
                                <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                                <p className="text-xl font-bold capitalize">
                                    {startDate ? formatDate(parseLocalDate(startDate), "PP", { locale: es }) : "No definida"}
                                </p>
                            </div>
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
