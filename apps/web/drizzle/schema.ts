import { pgTable, pgEnum, varchar, foreignKey, bigint } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"
export const label = pgEnum("label", ['Rust', 'Golang', 'NodeJS', 'Svelte', 'Vue', 'React', 'Angular', 'Typescript', 'Javascript', 'Java', 'CSS', 'HTML', 'Python', 'Git', 'Github', 'Gitlab', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes', 'Azure', 'GCE', 'AWS'])


export const user = pgTable("user", {
	id: varchar("id").primaryKey().notNull(),
	username: varchar("username", { length: 255 }).notNull(),
});

export const userKey = pgTable("user_key", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id").references(() => user.id),
	hashedPassword: varchar("hashed_password", { length: 255 }),
});

export const userSession = pgTable("user_session", {
	id: varchar("id", { length: 127 }).primaryKey().notNull(),
	userId: varchar("user_id").references(() => user.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});