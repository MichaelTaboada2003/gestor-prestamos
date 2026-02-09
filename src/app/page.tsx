import { getLoans } from "@/app/actions";
import { LoanList } from "@/components/loan-list";
import { CreateLoanDialog } from "@/components/create-loan-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, TrendingUp, Wallet } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardPage() {
  const loans = await getLoans();
  const totalBalance = loans.reduce((acc, loan) => acc + loan.remainingBalance, 0);
  const activeLoans = loans.filter(l => l.status === 'active').length;

  return (
    <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Gestor de Préstamos</h1>
          <p className="text-muted-foreground mt-1">Monitorea y gestiona tu cartera de préstamos bancarios.</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CreateLoanDialog />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBalance.toLocaleString('es-CO')}</div>
            <p className="text-xs text-muted-foreground mt-1">Capital pendiente por cobrar</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Préstamos Activos</CardTitle>
            <Landmark className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">Contratos vigentes hoy</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Rendimiento Estimado</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Margen promedio anual</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Tus Préstamos</h2>
        </div>
        <LoanList loans={loans} />
      </section>
    </div>
  );
}
