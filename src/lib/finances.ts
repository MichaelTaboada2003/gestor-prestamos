import { addMonths, differenceInDays, parseISO } from 'date-fns';

export interface AmortizationRow {
    installmentNumber: number;
    date: Date;
    installmentAmount: number;
    interestPortion: number;
    capitalPortion: number;
    remainingBalance: number;
}

/**
 * Calculates the fixed monthly installment using the French Amortization System.
 * C = (P * i) / (1 - (1 + i)^-n)
 */
export function calculateMonthlyInstallment(
    principal: number,
    annualRate: number,
    months: number
): number {
    if (months === 0) return 0;
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / months;

    const installment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return installment;
}

/**
 * Generates the full amortization schedule.
 */
export function generateAmortizationSchedule(
    principal: number,
    annualRate: number,
    months: number,
    startDate: Date
): AmortizationRow[] {
    const schedule: AmortizationRow[] = [];
    const monthlyRate = annualRate / 12 / 100;
    const installmentAmount = calculateMonthlyInstallment(principal, annualRate, months);

    let currentBalance = principal;

    for (let i = 1; i <= months; i++) {
        const interestPortion = currentBalance * monthlyRate;
        const capitalPortion = installmentAmount - interestPortion;
        currentBalance -= capitalPortion;

        schedule.push({
            installmentNumber: i,
            date: addMonths(startDate, i),
            installmentAmount,
            interestPortion,
            capitalPortion,
            remainingBalance: Math.max(0, currentBalance),
        });
    }

    return schedule;
}

/**
 * Handles the logic for a payment, including extra capital (abono a capital).
 */
export function processPayment(
    currentBalance: number,
    annualRate: number,
    paymentAmount: number,
    expectedInstallment: number,
    lastPaymentDate: Date,
    currentPaymentDate: Date
) {
    const monthlyRate = annualRate / 12 / 100;

    // Real interest accrued roughly (pro-rated if needed, but usually monthly in simplified systems)
    // For simplicity and standard banking in French system, we assume interest is calculated on monthly balance
    const interestPortion = currentBalance * monthlyRate;

    // What should have been paid
    const normalCapitalPortion = expectedInstallment - interestPortion;

    // What is actually being paid
    let remainingPayment = paymentAmount;

    // 1. Pay interest first
    const paidInterest = Math.min(interestPortion, remainingPayment);
    remainingPayment -= paidInterest;

    // 2. Pay scheduled capital
    const paidNormalCapital = Math.min(normalCapitalPortion, remainingPayment);
    remainingPayment -= paidNormalCapital;

    // 3. Excess goes to capital (Abono a capital)
    const extraPrincipal = remainingPayment;

    const totalPrincipalReduction = paidNormalCapital + extraPrincipal;
    const newBalance = Math.max(0, currentBalance - totalPrincipalReduction);

    return {
        paidInterest,
        paidNormalCapital,
        extraPrincipal,
        totalPrincipalReduction,
        newBalance,
    };
}
