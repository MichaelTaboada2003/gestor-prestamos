"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, DollarSign } from "lucide-react";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { parseLocalDate } from "@/lib/utils";

interface Loan {
    id: string;
    name: string;
    principal: number;
    annualInterestRate: number;
    termMonths: number;
    startDate: string;
    status: string;
    remainingBalance: number;
}

export function LoanList({ loans }: { loans: Loan[] }) {
    const router = useRouter();

    if (loans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                <p className="text-muted-foreground font-medium">No hay préstamos registrados aún.</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Empieza creando uno nuevo arriba.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="font-semibold px-6 py-4">Referencia / Cliente</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Saldo Pendiente</TableHead>
                        <TableHead className="font-semibold">Fecha Inicio</TableHead>
                        <TableHead className="font-semibold text-center">Estado</TableHead>
                        <TableHead className="text-right px-6 font-semibold">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loans.map((loan) => (
                        <TableRow
                            key={loan.id}
                            className="group cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => router.push(`/loans/${loan.id}`)}
                        >
                            <TableCell className="px-6 py-4 font-medium">{loan.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                                    {loan.principal.toLocaleString('es-CO')}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 font-bold text-primary">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {loan.remainingBalance.toLocaleString('es-CO')}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                <div className="flex items-center gap-1.5 capitalize">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(parseLocalDate(loan.startDate), "PP", { locale: es })}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={loan.status === 'active' ? 'default' : 'secondary'} className="px-2.5 py-0.5 capitalize">
                                    {loan.status === 'active' ? 'Activo' : 'Completado'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right px-6">
                                <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
