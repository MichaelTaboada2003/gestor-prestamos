"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateLoan } from "@/app/actions";
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
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    principal: z.coerce.number().positive({
        message: "El capital debe ser un número positivo.",
    }),
    annualRate: z.coerce.number().positive({
        message: "La tasa debe ser mayor a 0.",
    }),
    months: z.coerce.number().int().positive({
        message: "El plazo debe ser de al menos 1 mes.",
    }),
    startDate: z.string().min(1, {
        message: "La fecha de inicio es requerida.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLoanDialogProps {
    loan: {
        id: string;
        name: string;
        principal: number;
        annualInterestRate: number;
        termMonths: number;
        startDate: string;
    };
    trigger?: React.ReactNode;
}

export function EditLoanDialog({ loan, trigger }: EditLoanDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: loan.name,
            principal: loan.principal,
            annualRate: loan.annualInterestRate,
            months: loan.termMonths,
            startDate: loan.startDate.includes("T") ? loan.startDate.split("T")[0] : loan.startDate,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await updateLoan(loan.id, values);
            toast.success("Préstamo Actualizado", {
                description: `Se han actualizado los datos del préstamo correctamente.`,
            });
            setOpen(false);
        } catch (error) {
            toast.error("Error", {
                description: "No se pudieron actualizar los datos del préstamo.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Editar Préstamo</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del préstamo, incluida la fecha de inicio. Los saldos y pagos se recalcularán automáticamente.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Cliente / Referencia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Juan Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="principal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capital ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="annualRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tasa Anual (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="months"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plazo (Meses)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Inicio</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                    </>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
