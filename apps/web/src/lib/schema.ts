import { relations } from 'drizzle-orm';
import { bigint, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const user = pgTable('user', {
  id: varchar('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull()
});

export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);

export const userKey = pgTable('user_key', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: varchar('user_id').references(() => user.id),
  hashed_password: varchar('hashed_password', { length: 255 })
});

export const userSessions = pgTable('user_session', {
  id: varchar('id', { length: 127 }).primaryKey(),
  user_id: varchar('user_id').references(() => user.id),
  active_expires: bigint('active_expires', { mode: 'number' }).notNull(),
  idle_expires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: varchar('user_id')
    .unique()
    .notNull()
    .references(() => user.id),
  title: varchar('title', { length: 15 }).notNull(),
  description: varchar('description').notNull(),
  company: varchar('company').notNull(),
  linkedin: varchar('linkedin').notNull(),
  role: varchar('role', {
    enum: ['Software Engineer', 'Product Manager', 'SRE Engineer', 'Prompt Engineer']
  }).notNull()
});

export const jobsRelations = relations(jobs, ({ many }) => ({
  badges: many(badges)
}));

// it seems the drizzle enum type is very restrictive so it has to be defined here and cannot be defined as a variable
export const labelEnum = pgEnum('label', [
  'AWS',
  'GCE',
  'Azure',
  'Kubernetes',
  'Docker',
  'Terraform',
  'Jenkins',
  'Gitlab',
  'Github',
  'Git',
  'Python',
  'HTML',
  'CSS',
  'Java',
  'Javascript',
  'Typescript',
  'Angular',
  'React',
  'Vue',
  'Svelte',
  'NodeJS',
  'Golang',
  'Rust'
]);

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  jobs_id: uuid('jobs_id')
    .references(() => jobs.id, { onDelete: 'cascade' })
    .notNull(),
  label: labelEnum('label').notNull()
});

export const badgesRelations = relations(badges, ({ one }) => ({
  job: one(jobs, {
    fields: [badges.jobs_id],
    references: [jobs.id]
  })
}));

export const insertBadgeSchema = createInsertSchema(badges);

export const insertJobSchema = createInsertSchema(jobs, {
  description: z.string().min(10).max(255),
  title: z.string().min(10).max(30),
  company: z.string().min(3).max(30),
  linkedin: z.string().url().startsWith('https://www.linkedin.com/')
});

export const selectJobSchema = createSelectSchema(jobs);

export const deleteJobSchema = selectJobSchema.pick({ id: true });

export const insertJobWithBadges = insertJobSchema.extend({
  badges: z.array(insertBadgeSchema.shape.label).min(1).max(3)
});
