"use server";

import { db } from "@/db";
import { loans, payments as paymentsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateMonthlyInstallment, generateAmortizationSchedule, processPayment } from "@/lib/finances";
import { revalidatePath } from "next/cache";

export async function createLoan(formData: {
    name: string;
    principal: number;
    annualRate: number;
    months: number;
    startDate: string;
}) {
    const { name, principal, annualRate, months, startDate } = formData;

    const [newLoan] = await db.insert(loans).values({
        name,
        principal,
        annualInterestRate: annualRate,
        termMonths: months,
        startDate,
        remainingBalance: principal,
        status: 'active',
    }).returning();

    revalidatePath("/");
    return newLoan;
}

export async function getLoans() {
    return await db.query.loans.findMany({
        orderBy: [desc(loans.createdAt)],
    });
}

export async function getLoanDetails(id: string) {
    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, id),
        with: {
            // We'll need to define relations in schema if we want to use 'with'
        },
    });

    const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.loanId, id)).orderBy(desc(paymentsTable.date));

    return { ...loan, payments };
}

export async function registerPayment(loanId: string, paymentData: {
    amount: number;
    date: string;
}) {
    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) throw new Error("Loan not found");

    const lastPayment = await db.query.payments.findFirst({
        where: eq(paymentsTable.loanId, loanId),
        orderBy: [desc(paymentsTable.date)],
    });

    const lastDate = lastPayment ? new Date(lastPayment.date) : new Date(loan.startDate);

    // Calculate expected installment based on current balance and remaining months
    // If no payments made yet, it's the initial installment.
    // After an extra payment, the installment is recalculated.
    const paymentsMade = await db.select().from(paymentsTable).where(eq(paymentsTable.loanId, loanId));
    const monthsRemaining = loan.termMonths - paymentsMade.length;

    const expectedInstallment = calculateMonthlyInstallment(
        loan.remainingBalance,
        loan.annualInterestRate,
        Math.max(1, monthsRemaining)
    );

    const impact = processPayment(
        loan.remainingBalance,
        loan.annualInterestRate,
        paymentData.amount,
        expectedInstallment,
        lastDate,
        new Date(paymentData.date)
    );

    // Insert payment record
    await db.insert(paymentsTable).values({
        loanId,
        amount: paymentData.amount,
        date: paymentData.date,
        interestPortion: impact.paidInterest,
        capitalPortion: impact.paidNormalCapital,
        extraPrincipal: impact.extraPrincipal,
        remainingBalanceAfter: impact.newBalance,
    });

    // Update loan balance
    await db.update(loans)
        .set({
            remainingBalance: impact.newBalance,
            status: impact.newBalance <= 0 ? 'completed' : 'active'
        })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/");

    return { success: true };
}
