"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { EditPaymentDialog } from "@/components/edit-payment-dialog";
import { History } from "lucide-react";

export function PaymentHistory({ payments }: { payments: any[] }) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                    <History className="h-5 w-5" /> Historial de Pagos
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="relative space-y-4">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-muted" />
                    {payments.map((payment, idx) => (
                        <div key={payment.id} className="relative pl-10 animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm" />
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <span className="font-bold text-base">${payment.amount.toLocaleString('es-CO')}</span>
                                        <div className="text-xs text-muted-foreground">{formatDate(new Date(payment.date), "dd MMM, yyyy", { locale: es })}</div>
                                    </div>
                                    <EditPaymentDialog payment={payment} />
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                                    <span>Cap: ${payment.capitalPortion.toLocaleString('es-CO')}</span>
                                    <span>Int: ${payment.interestPortion.toLocaleString('es-CO')}</span>
                                    {payment.extraPrincipal > 0 && (
                                        <span className="text-green-600 font-semibold underline">Abono: ${payment.extraPrincipal.toLocaleString('es-CO')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {payments.length === 0 && (
                        <div className="pl-10 text-sm text-muted-foreground">
                            No se han registrado pagos aún.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
