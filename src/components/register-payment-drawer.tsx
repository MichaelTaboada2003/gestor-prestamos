"use client";

import { useState } from "react";
import { registerPayment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function RegisterPaymentDrawer({ loanId, remainingBalance }: { loanId: string, remainingBalance: number }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    async function handlePayment() {
        if (!amount || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            await registerPayment(loanId, {
                amount: parseFloat(amount),
                date,
            });
            toast.success("Pago Exitoso", {
                description: "Proceso completado correctamente.",
            });
            setOpen(false);
            setAmount("");
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo registrar el pago.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 shadow-2xl transition-all duration-300 active:scale-95">
                    <CreditCard className="mr-3 h-4 w-4" /> Registrar Pago
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-background border-none">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="pt-8">
                        <DrawerTitle className="text-3xl font-black italic tracking-tighter text-center">Registrar Abono</DrawerTitle>
                        <DrawerDescription className="text-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                            Ingreso Manual de Recaudo
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest opacity-70">Monto del Pago ($)</Label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-bold">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="h-14 pl-8 text-xl font-black bg-foreground/5 border-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-xl transition-all"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                            </div>
                        </div>

                        <div className="space-y-3" data-vaul-no-drag>
                            <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest opacity-70">Fecha del Pago</Label>
                            <Input
                                id="date"
                                type="date"
                                className="h-12 bg-foreground/5 border-none font-bold rounded-xl relative z-50"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                data-vaul-no-drag
                            />
                        </div>

                        <div className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-4">
                            <CheckCircle2 className="h-5 w-5 text-foreground/20" />
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider leading-relaxed">
                                El sistema amortizará el capital insoluto actual: <span className="text-foreground/80">${remainingBalance.toLocaleString('es-CO')}</span>
                            </p>
                        </div>
                    </div>

                    <DrawerFooter className="p-6 pt-2">
                        <Button
                            onClick={handlePayment}
                            disabled={loading || !amount}
                            className="h-14 w-full text-sm font-black uppercase tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Ejecutar Pago"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">Cerrar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
