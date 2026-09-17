"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { EditPaymentDialog } from "@/components/edit-payment-dialog";
import {
    History,
    Calendar,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    CalendarDays,
    Search,
    DollarSign,
    Layers,
    Receipt,
    Wallet
} from "lucide-react";
import { cn, parseLocalDate } from "@/lib/utils";

interface PaymentHistoryProps {
    payments: any[];
}

function formatCOP(val: number) {
    return "$" + Math.round(val).toLocaleString('es-CO');
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
    // View mode: "recent" (latest 4), "by-year" (collapsible year groups), "all" (paginated full list)
    const [viewMode, setViewMode] = useState<"recent" | "by-year" | "all">("recent");
    const [page, setPage] = useState(1);
    const pageSize = 4;

    // Full history modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalPage, setModalPage] = useState(1);
    const modalPageSize = 8;

    // Group payments by year
    const paymentsByYear = useMemo(() => {
        const groups: {
            [year: string]: {
                payments: any[];
                totalAmount: number;
                totalCapital: number;
                totalInterest: number;
            };
        } = {};

        payments.forEach((p) => {
            const d = parseLocalDate(p.date);
            const year = d.getFullYear().toString();
            if (!groups[year]) {
                groups[year] = { payments: [], totalAmount: 0, totalCapital: 0, totalInterest: 0 };
            }
            groups[year].payments.push(p);
            groups[year].totalAmount += p.amount;
            groups[year].totalCapital += p.capitalPortion + (p.extraPrincipal || 0);
            groups[year].totalInterest += p.interestPortion;
        });

        return groups;
    }, [payments]);

    const sortedYears = useMemo(() => {
        return Object.keys(paymentsByYear).sort((a, b) => Number(b) - Number(a));
    }, [paymentsByYear]);

    // Accordion state for year grouping (most recent year open by default)
    const [expandedYears, setExpandedYears] = useState<{ [year: string]: boolean }>(() => {
        const initial: { [year: string]: boolean } = {};
        if (sortedYears.length > 0) {
            initial[sortedYears[0]] = true;
        }
        return initial;
    });

    const toggleYear = (year: string) => {
        setExpandedYears((prev) => ({
            ...prev,
            [year]: !prev[year],
        }));
    };

    // Pagination for "all" mode
    const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
    const paginatedPayments = useMemo(() => {
        const start = (page - 1) * pageSize;
        return payments.slice(start, start + pageSize);
    }, [payments, page]);

    // Filtered payments for modal
    const filteredModalPayments = useMemo(() => {
        if (!searchTerm.trim()) return payments;
        const q = searchTerm.toLowerCase();
        return payments.filter((p) => {
            const formattedDate = formatDate(parseLocalDate(p.date), "dd MMM, yyyy", { locale: es }).toLowerCase();
            const amountStr = Math.round(p.amount).toString();
            return formattedDate.includes(q) || amountStr.includes(q);
        });
    }, [payments, searchTerm]);

    const totalModalPages = Math.max(1, Math.ceil(filteredModalPayments.length / modalPageSize));
    const paginatedModalPayments = useMemo(() => {
        const start = (modalPage - 1) * modalPageSize;
        return filteredModalPayments.slice(start, start + modalPageSize);
    }, [filteredModalPayments, modalPage]);

    // Totals for modal KPI summary
    const summary = useMemo(() => {
        return payments.reduce(
            (acc, p) => ({
                amount: acc.amount + p.amount,
                capital: acc.capital + p.capitalPortion + (p.extraPrincipal || 0),
                interest: acc.interest + p.interestPortion,
            }),
            { amount: 0, capital: 0, interest: 0 }
        );
    }, [payments]);

    // Helper to render an individual timeline payment item
    const renderPaymentItem = (payment: any, idx: number) => (
        <div
            key={payment.id}
            className="relative pl-9 py-1 animate-in fade-in duration-200"
            style={{ animationDelay: `${idx * 40}ms` }}
        >
            <div className="absolute left-2 top-2.5 h-3.5 w-3.5 rounded-full border-2 border-foreground bg-background shadow-xs" />
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <span className="font-black text-sm sm:text-base tabular-nums text-foreground">
                            {formatCOP(payment.amount)}
                        </span>
                        <div className="text-xs text-muted-foreground capitalize">
                            {formatDate(parseLocalDate(payment.date), "dd MMM, yyyy", { locale: es })}
                        </div>
                    </div>
                    <EditPaymentDialog payment={payment} />
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2.5 tabular-nums">
                    <span>Cap: {formatCOP(payment.capitalPortion)}</span>
                    <span>•</span>
                    <span>Int: {formatCOP(payment.interestPortion)}</span>
                    {payment.extraPrincipal > 0 && (
                        <>
                            <span>•</span>
                            <span className="text-green-600 dark:text-green-400 font-bold underline">
                                Abono: {formatCOP(payment.extraPrincipal)}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black flex items-center gap-2 tracking-tight">
                        <History className="h-5 w-5 text-foreground" />
                        Historial de Pagos
                        {payments.length > 0 && (
                            <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5 rounded-full">
                                {payments.length}
                            </Badge>
                        )}
                    </CardTitle>

                    {/* Dialog trigger for full history view */}
                    {payments.length > 0 && (
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2.5 text-xs font-bold text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
                                    title="Ver historial completo en ventana modal"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Ver Todo</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
                                <DialogHeader>
                                    <div className="flex items-center gap-2">
                                        <History className="h-5 w-5 text-foreground" />
                                        <DialogTitle className="text-2xl font-black tracking-tight">
                                            Historial Completo de Pagos
                                        </DialogTitle>
                                    </div>
                                    <DialogDescription className="text-xs text-muted-foreground">
                                        Detalle de todas las cuotas y abonos registrados en el crédito.
                                    </DialogDescription>
                                </DialogHeader>

                                {/* KPI summary cards inside modal */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
                                    <div className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Recaudado</p>
                                        <p className="text-lg font-black tabular-nums">{formatCOP(summary.amount)}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Capital Retornado</p>
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">{formatCOP(summary.capital)}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Interés Cobrado</p>
                                        <p className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">{formatCOP(summary.interest)}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">N° de Cuotas</p>
                                        <p className="text-lg font-black tabular-nums">{payments.length}</p>
                                    </div>
                                </div>

                                {/* Search bar */}
                                <div className="relative my-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por fecha (ej: enero, 2026) o monto..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setModalPage(1);
                                        }}
                                        className="pl-9 h-10 text-sm bg-muted/30"
                                    />
                                </div>

                                {/* Table inside modal */}
                                <div className="flex-1 overflow-y-auto rounded-xl border border-foreground/10 min-h-0">
                                    <Table>
                                        <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-xs">
                                            <TableRow>
                                                <TableHead className="w-12 text-center font-bold">#</TableHead>
                                                <TableHead className="font-bold">Fecha</TableHead>
                                                <TableHead className="font-bold">Monto</TableHead>
                                                <TableHead className="font-bold">Capital</TableHead>
                                                <TableHead className="font-bold">Interés</TableHead>
                                                <TableHead className="font-bold">Abono Extra</TableHead>
                                                <TableHead className="text-right font-bold w-14">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedModalPayments.map((p, idx) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="text-center font-medium text-xs text-muted-foreground">
                                                        {(modalPage - 1) * modalPageSize + idx + 1}
                                                    </TableCell>
                                                    <TableCell className="capitalize font-medium text-xs">
                                                        {formatDate(parseLocalDate(p.date), "dd MMM, yyyy", { locale: es })}
                                                    </TableCell>
                                                    <TableCell className="font-black text-sm tabular-nums">
                                                        {formatCOP(p.amount)}
                                                    </TableCell>
                                                    <TableCell className="text-blue-600 dark:text-blue-400 font-semibold text-xs tabular-nums">
                                                        {formatCOP(p.capitalPortion)}
                                                    </TableCell>
                                                    <TableCell className="text-amber-600 dark:text-amber-400 font-semibold text-xs tabular-nums">
                                                        {formatCOP(p.interestPortion)}
                                                    </TableCell>
                                                    <TableCell className="text-green-600 dark:text-green-400 font-semibold text-xs tabular-nums">
                                                        {p.extraPrincipal > 0 ? formatCOP(p.extraPrincipal) : "$0"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <EditPaymentDialog payment={p} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {paginatedModalPayments.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                                                        No se encontraron pagos con el criterio de búsqueda.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Modal pagination */}
                                {totalModalPages > 1 && (
                                    <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground border-t border-foreground/10">
                                        <span>
                                            Mostrando {(modalPage - 1) * modalPageSize + 1} a{" "}
                                            {Math.min(modalPage * modalPageSize, filteredModalPayments.length)} de{" "}
                                            {filteredModalPayments.length} pagos
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={modalPage === 1}
                                                onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                                            >
                                                <ChevronLeft className="h-3.5 w-3.5" />
                                            </Button>
                                            <span className="font-bold px-1.5">
                                                {modalPage} / {totalModalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={modalPage === totalModalPages}
                                                onClick={() => setModalPage((p) => Math.min(totalModalPages, p + 1))}
                                            >
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* View Mode Segmented Control (only when payments exist) */}
                {payments.length > 0 && (
                    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl text-xs mt-2 border border-foreground/5">
                        <button
                            type="button"
                            onClick={() => setViewMode("recent")}
                            className={cn(
                                "flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center",
                                viewMode === "recent"
                                    ? "bg-background shadow-xs text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Recientes
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("by-year")}
                            className={cn(
                                "flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1",
                                viewMode === "by-year"
                                    ? "bg-background shadow-xs text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <CalendarDays className="h-3 w-3" />
                            Por Año
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("all")}
                            className={cn(
                                "flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center",
                                viewMode === "all"
                                    ? "bg-background shadow-xs text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Paginado
                        </button>
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-0 pt-1">
                {/* 1. Empty state */}
                {payments.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-foreground/10 rounded-2xl text-center space-y-2 bg-foreground/[0.01]">
                        <Wallet className="h-6 w-6 mx-auto text-muted-foreground/60" />
                        <p className="text-sm font-bold text-muted-foreground">No hay pagos registrados</p>
                        <p className="text-xs text-muted-foreground/60">
                            Registra el primer abono usando el botón superior.
                        </p>
                    </div>
                )}

                {/* 2. Mode: "recent" (latest 4 payments with expandable toggle) */}
                {viewMode === "recent" && payments.length > 0 && (
                    <div className="space-y-4">
                        <div className="relative space-y-3">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted" />
                            {payments.slice(0, 4).map((payment, idx) => renderPaymentItem(payment, idx))}
                        </div>

                        {payments.length > 4 && (
                            <div className="pt-1 flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs font-bold h-9 border-dashed hover:bg-muted/50 rounded-xl"
                                    onClick={() => setViewMode("all")}
                                >
                                    <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                                    Ver los {payments.length - 4} pagos anteriores
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Mode: "by-year" (Groupable accordions by Year) */}
                {viewMode === "by-year" && payments.length > 0 && (
                    <div className="space-y-3">
                        {sortedYears.map((year) => {
                            const group = paymentsByYear[year];
                            const isExpanded = !!expandedYears[year];

                            return (
                                <div
                                    key={year}
                                    className="rounded-2xl border border-foreground/10 bg-background overflow-hidden transition-all duration-300"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleYear(year)}
                                        className="w-full p-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-lg bg-foreground/5 text-foreground font-black text-xs">
                                                {year}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-foreground">
                                                    {group.payments.length} {group.payments.length === 1 ? "pago" : "pagos"}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground tabular-nums">
                                                    {formatCOP(group.totalAmount)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
                                                {formatCOP(group.totalAmount)}
                                            </Badge>
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="p-3 pt-1 border-t border-foreground/5 bg-muted/10 space-y-2">
                                            <div className="relative space-y-2.5">
                                                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted" />
                                                {group.payments.map((p, idx) => renderPaymentItem(p, idx))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 4. Mode: "all" (Paginated full list) */}
                {viewMode === "all" && payments.length > 0 && (
                    <div className="space-y-4">
                        <div className="relative space-y-3">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted" />
                            {paginatedPayments.map((payment, idx) => renderPaymentItem(payment, idx))}
                        </div>

                        {/* Pagination footer */}
                        <div className="pt-2 flex items-center justify-between border-t border-foreground/10 text-xs text-muted-foreground">
                            <span>
                                Página <strong className="text-foreground">{page}</strong> de {totalPages}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-lg"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-lg"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
