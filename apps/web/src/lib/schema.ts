import { bigint, pgTable, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: varchar('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull()
});

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
