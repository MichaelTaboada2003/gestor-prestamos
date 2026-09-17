"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteLoan } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { EditLoanDialog } from "@/components/edit-loan-dialog";

function formatCurrency(value: number) {
    return "$" + value.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

export function LoanHeader({ loan }: { loan: any }) {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const payments = loan.payments || [];
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;

            // --- Header ---
            pdf.setFontSize(20);
            pdf.setFont("helvetica", "bold");
            pdf.text("Estado de Cuenta", margin, 25);

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generado: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 32);

            // --- Divider ---
            pdf.setDrawColor(220, 220, 220);
            pdf.setLineWidth(0.5);
            pdf.line(margin, 36, pageWidth - margin, 36);

            // --- Loan Info ---
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 30, 30);
            pdf.text(loan.name, margin, 46);

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(120, 120, 120);
            pdf.text(`ID: ${loan.id.split('-')[0]}  •  Estado: ${loan.status === 'active' ? 'Activo' : 'Liquidado'}  •  Creado: ${new Date(loan.createdAt).toLocaleDateString('es-CO')}`, margin, 52);

            // --- Summary cards ---
            const totalPaid = payments.reduce((s: number, p: any) => s + p.amount, 0);
            const totalInterest = payments.reduce((s: number, p: any) => s + p.interestPortion, 0);
            const totalCapital = payments.reduce((s: number, p: any) => s + p.capitalPortion, 0);
            const totalExtra = payments.reduce((s: number, p: any) => s + p.extraPrincipal, 0);

            const cardY = 58;
            const cardH = 18;
            const cardW = (pageWidth - margin * 2 - 12) / 4;

            const summaryItems = [
                { label: "Capital Inicial", value: formatCurrency(loan.principal), color: [30, 30, 30] },
                { label: "Total Pagado", value: formatCurrency(totalPaid), color: [37, 99, 235] },
                { label: "Total Intereses", value: formatCurrency(totalInterest), color: [217, 119, 6] },
                { label: "Saldo Restante", value: formatCurrency(loan.remainingBalance), color: [22, 163, 74] },
            ];

            summaryItems.forEach((item, i) => {
                const x = margin + i * (cardW + 4);
                pdf.setFillColor(248, 248, 248);
                pdf.roundedRect(x, cardY, cardW, cardH, 2, 2, 'F');

                pdf.setFontSize(7);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(140, 140, 140);
                pdf.text(item.label.toUpperCase(), x + 4, cardY + 6);

                pdf.setFontSize(11);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
                pdf.text(item.value, x + 4, cardY + 13);
            });

            // --- Payments Table ---
            if (payments.length > 0) {
                const sortedPayments = [...payments].sort(
                    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                const tableData = sortedPayments.map((p: any, idx: number) => [
                    (idx + 1).toString(),
                    new Date(p.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
                    formatCurrency(p.amount),
                    formatCurrency(p.interestPortion),
                    formatCurrency(p.capitalPortion),
                    formatCurrency(p.extraPrincipal),
                    formatCurrency(p.remainingBalanceAfter),
                ]);

                autoTable(pdf, {
                    startY: cardY + cardH + 10,
                    margin: { left: margin, right: margin },
                    head: [['#', 'Fecha', 'Monto Pagado', 'Interés', 'Capital', 'Extra Capital', 'Saldo']],
                    body: tableData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [30, 30, 30],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 8,
                        halign: 'center',
                        cellPadding: 3,
                    },
                    bodyStyles: {
                        fontSize: 8,
                        cellPadding: 2.5,
                        textColor: [50, 50, 50],
                    },
                    alternateRowStyles: {
                        fillColor: [248, 248, 250],
                    },
                    columnStyles: {
                        0: { halign: 'center', cellWidth: 10 },
                        1: { halign: 'left' },
                        2: { halign: 'right', fontStyle: 'bold' },
                        3: { halign: 'right', textColor: [217, 119, 6] },
                        4: { halign: 'right', textColor: [37, 99, 235] },
                        5: { halign: 'right', textColor: [22, 163, 74] },
                        6: { halign: 'right', fontStyle: 'bold' },
                    },
                    foot: [[
                        '', 'TOTALES',
                        formatCurrency(totalPaid),
                        formatCurrency(totalInterest),
                        formatCurrency(totalCapital),
                        formatCurrency(totalExtra),
                        formatCurrency(loan.remainingBalance),
                    ]],
                    footStyles: {
                        fillColor: [240, 240, 240],
                        textColor: [30, 30, 30],
                        fontStyle: 'bold',
                        fontSize: 8,
                        halign: 'right',
                    },
                });
            } else {
                pdf.setFontSize(11);
                pdf.setTextColor(150, 150, 150);
                pdf.text("No se han registrado pagos aún.", margin, cardY + cardH + 20);
            }

            // --- Footer ---
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(7);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(180, 180, 180);
                pdf.text(
                    `Página ${i} de ${pageCount}  •  Gestor de Préstamos`,
                    pageWidth / 2, pdf.internal.pageSize.getHeight() - 8,
                    { align: 'center' }
                );
            }

            pdf.save(`prestamo-${loan.name.replace(/\s+/g, '-')}.pdf`);
            toast.success("PDF exportado con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Error al exportar a PDF");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLoan(loan.id);
            toast.success("Préstamo eliminado");
            setIsDialogOpen(false);
            router.push("/");
        } catch (error) {
            toast.error("Error al eliminar el préstamo");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/")}
                    className="rounded-full hover:bg-muted"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{loan.name}</h1>
                        <Badge variant={loan.status === 'active' ? 'default' : 'secondary'} className="px-2.5">
                            {loan.status === 'active' ? 'Activo' : 'Liquidado'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5">ID: {loan.id.split('-')[0]} • Creado el {new Date(loan.createdAt).toLocaleDateString('es-CO')}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <EditLoanDialog loan={loan} />
                <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                    <Share2 className="mr-2 h-4 w-4" /> 
                    {isExporting ? "Exportando..." : "Exportar"}
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>¿Eliminar préstamo?</DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer. Se eliminará el préstamo "{loan.name}" y todos los pagos asociados a este.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isDeleting}>Cancelar</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Eliminando..." : "Eliminar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
