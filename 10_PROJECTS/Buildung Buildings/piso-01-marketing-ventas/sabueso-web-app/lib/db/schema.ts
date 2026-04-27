import { pgTable, uuid, text, timestamp, integer, pgEnum, jsonb, vector } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
export const leadStatusEnum = pgEnum('lead_status', ['new', 'qualified', 'outreach', 'contacted', 'handover', 'rejected']);
export const opportunityStageEnum = pgEnum('opportunity_stage', ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost']);
export const userRoleEnum = pgEnum('user_role', ['vendedor', 'cliente', 'admin']);

// --- TABLES ---

// Companies: Central account entity
export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').unique(),
  industry: text('industry'),
  size: text('size'), // e.g. "11-50", "501-1000"
  annualRevenue: text('annual_revenue'),
  techStack: jsonb('tech_stack').default([]), // List of technologies
  metadata: jsonb('metadata').default({}), // Extra data from Apollo/Clay
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// People: Individual contacts (formerly Leads)
export const people = pgTable('people', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name').notNull(), // Aggregated name
  email: text('email').unique(),
  phone: text('phone'),
  jobTitle: text('job_title'),
  linkedinUrl: text('linkedin_url'),
  status: leadStatusEnum('status').default('new').notNull(),
  score: integer('score').default(0),
  metadata: jsonb('metadata').default({}), // Personal details, hobbies, etc.
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Opportunities: Sales deals
export const opportunities = pgTable('opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
  personId: uuid('person_id').references(() => people.id), // Primary contact for the deal
  stage: opportunityStageEnum('stage').default('discovery').notNull(),
  amount: integer('amount'), // In cents or standard units
  closeDate: timestamp('close_date'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Activities: Interaction logs (Emails, calls, notes)
export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  personId: uuid('person_id').references(() => people.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'email', 'call', 'note', 'meeting'
  description: text('description').notNull(),
  transcription: text('transcription'), // For Gong-style analysis
  sentimentScore: integer('sentiment_score'), // -100 to 100
  metadata: jsonb('metadata').default({}),
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Profiles: App users (Vendedores)
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey(), // Using Stack Auth ID
  role: userRoleEnum('role').default('vendedor').notNull(),
  fullName: text('full_name').notNull(),
  company: text('company'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- RELATIONS ---

export const companiesRelations = relations(companies, ({ many }) => ({
  people: many(people),
  opportunities: many(opportunities),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  company: one(companies, {
    fields: [people.companyId],
    references: [companies.id],
  }),
  activities: many(activities),
  opportunities: many(opportunities),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  company: one(companies, {
    fields: [opportunities.companyId],
    references: [companies.id],
  }),
  person: one(people, {
    fields: [opportunities.personId],
    references: [people.id],
  }),
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  person: one(people, {
    fields: [activities.personId],
    references: [people.id],
  }),
  company: one(companies, {
    fields: [activities.companyId],
    references: [companies.id],
  }),
  opportunity: one(opportunities, {
    fields: [activities.opportunityId],
    references: [opportunities.id],
  }),
}));

// Alias for backwards compatibility during migration (deprecated)
export const leads = people;
