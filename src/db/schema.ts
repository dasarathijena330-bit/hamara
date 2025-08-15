import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const loans = sqliteTable('loans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  borrowerName: text('borrower_name').notNull(),
  amount: real('amount').notNull(),
  interestRate: real('interest_rate').notNull(),
  startDate: text('start_date').notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});