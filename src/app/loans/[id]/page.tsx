import { getLoanDetails } from "@/app/actions";
import { notFound } from "next/navigation";
import { LoanHeader } from "@/components/loan-header";
import { LoanStats } from "@/components/loan-stats";
import { AmortizationTabs } from "@/components/amortization-tabs";
import { PaymentHistory } from "@/components/payment-history";
import { RegisterPaymentDrawer } from "@/components/register-payment-drawer";

export default async function LoanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const loan = await getLoanDetails(id);

    if (!loan || !loan.id) {
        notFound();
    }

    const principal = loan.principal || 0;
    const remainingBalance = loan.remainingBalance || 0;
    const annualInterestRate = loan.annualInterestRate || 0;
    const termMonths = loan.termMonths || 0;
    const startDate = loan.startDate || "";
    const payments = loan.payments || [];

    // Calculate some insights
    const totalPaid = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const totalInterestPaid = payments.reduce((sum: number, p: any) => sum + p.interestPortion, 0);
    const totalPrincipalPaid = payments.reduce((sum: number, p: any) => sum + (p.capitalPortion + p.extraPrincipal), 0);

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <LoanHeader loan={loan} />

            <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-3 space-y-6">
                    <LoanStats
                        principal={principal}
                        remaining={remainingBalance}
                        totalPaid={totalPaid}
                        interestPaid={totalInterestPaid}
                    />

                    <AmortizationTabs
                        loanId={loan.id}
                        principal={remainingBalance}
                        rate={annualInterestRate}
                        monthsRemaining={termMonths - payments.length}
                        startDate={startDate}
                        payments={payments}
                    />
                </div>

                <div className="space-y-6">
                    <RegisterPaymentDrawer loanId={loan.id} remainingBalance={remainingBalance} />
                    <PaymentHistory payments={payments} />
                </div>
            </div>
        </div>
    );
}
