"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Share2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoanHeader({ loan }: { loan: any }) {
    const router = useRouter();

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
                <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" /> Exportar
                </Button>
                <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
