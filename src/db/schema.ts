import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const loans = sqliteTable('loans', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  principal: real('principal').notNull(),
  annualInterestRate: real('annual_interest_rate').notNull(),
  termMonths: integer('term_months').notNull(),
  startDate: text('start_date').notNull(),
  status: text('status', { enum: ['active', 'completed'] }).default('active').notNull(),
  remainingBalance: real('remaining_balance').notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  loanId: text('loan_id').notNull().references(() => loans.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  interestPortion: real('interest_portion').notNull(),
  capitalPortion: real('capital_portion').notNull(),
  extraPrincipal: real('extra_principal').notNull(),
  remainingBalanceAfter: real('remaining_balance_after').notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});
