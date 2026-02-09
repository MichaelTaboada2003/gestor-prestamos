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
import { CreditCard, Loader2, Sparkles } from "lucide-react";
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
                description: "El pago se ha procesado y el saldo ha sido recalculado.",
            });
            setOpen(false);
            setAmount("");
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un problema al registrar el pago.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                    <CreditCard className="mr-2 h-5 w-5" /> Registrar Pago
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl font-bold text-center">Registrar Abono</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Ingresa el monto total recibido. El sistema distribuirá el abono a capital automáticamente.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Monto del Pago ($)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7 text-lg font-semibold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Fecha del Pago</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-lg flex items-start gap-3 border border-secondary/30">
                            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                            <div className="text-xs space-y-1">
                                <p className="font-semibold text-secondary-foreground uppercase">Smart Recalculation</p>
                                <p className="text-muted-foreground leading-tight">
                                    Cualquier excedente sobre el capital de la cuota impactará directamente al saldo insoluto (${remainingBalance.toLocaleString('es-CO')}), reduciendo tus intereses futuros.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="pt-6">
                        <Button onClick={handlePayment} disabled={loading || !amount} className="h-12 text-lg">
                            {loading ? <Loader2 className="animate-spin" /> : "Confirmar Pago"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
