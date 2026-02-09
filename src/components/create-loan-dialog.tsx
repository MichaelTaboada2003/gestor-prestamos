"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createLoan } from "@/app/actions";
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
import { Plus, Loader2 } from "lucide-react";
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

export function CreateLoanDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            principal: 1000000,
            annualRate: 12,
            months: 12,
            startDate: new Date().toISOString().split("T")[0],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await createLoan(values);
            toast.success("Préstamo Creado", {
                description: `Se ha registrado el préstamo "${values.name}" correctamente.`,
            });
            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo crear el préstamo. Revisa los datos.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Préstamo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Crear Préstamo</DialogTitle>
                    <DialogDescription>
                        Ingresa los parámetros financieros para generar el nuevo contrato de préstamo.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Cliente / Referencia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Juan Pérez - Libre Inversión" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="principal"
                                render={({ field }: { field: any }) => (
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
                                render={({ field }: { field: any }) => (
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
                                render={({ field }: { field: any }) => (
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
                                render={({ field }: { field: any }) => (
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
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                                    </>
                                ) : (
                                    "Generar Préstamo"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
