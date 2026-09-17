"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePayment, deletePayment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    amount: z.coerce.number().positive({
        message: "El monto debe ser positivo.",
    }),
    date: z.string().min(1, {
        message: "La fecha del pago es requerida.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPaymentDialogProps {
    payment: {
        id: string;
        loanId: string;
        amount: number;
        date: string;
    };
}

export function EditPaymentDialog({ payment }: EditPaymentDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formattedDate = payment.date.includes("T") ? payment.date.split("T")[0] : payment.date;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: payment.amount,
            date: formattedDate,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await updatePayment(payment.id, payment.loanId, values);
            toast.success("Pago Actualizado", {
                description: "La fecha y monto del pago fueron actualizados correctamente.",
            });
            setOpen(false);
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo actualizar el pago.",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deletePayment(payment.id, payment.loanId);
            toast.success("Pago Eliminado");
            setOpen(false);
        } catch (error) {
            toast.error("Error al eliminar el pago");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Editar Pago</DialogTitle>
                    <DialogDescription>
                        Modifica la fecha o monto de este pago.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monto del Pago ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha del Pago</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4 flex justify-between gap-2 sm:justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={loading || isDeleting}
                            >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                                Eliminar
                            </Button>
                            <Button type="submit" size="sm" disabled={loading || isDeleting}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
