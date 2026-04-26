import { pgTable, uuid, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const leadStatusEnum = pgEnum('lead_status', ['new', 'qualified', 'outreach', 'contacted', 'handover', 'rejected']);

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  website: text('website'),
  email: text('email'),
  status: leadStatusEnum('status').default('new').notNull(),
  score: integer('score').default(0),
  qualificationReason: text('qualification_reason'),
  personalTouch: text('personal_touch'),
  draftEmail: text('draft_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // 'status_change', 'email_drafted', 'contacted', etc.
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
