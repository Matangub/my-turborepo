import { pgTable, foreignKey, unique, pgEnum, uuid, varchar, bigint } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"
export const label = pgEnum("label", ['Rust', 'Golang', 'NodeJS', 'Svelte', 'Vue', 'React', 'Angular', 'Typescript', 'Javascript', 'Java', 'CSS', 'HTML', 'Python', 'Git', 'Github', 'Gitlab', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes', 'Azure', 'GCE', 'AWS'])


export const jobs = pgTable("jobs", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id").notNull().references(() => user.id),
	title: varchar("title", { length: 15 }).notNull(),
	description: varchar("description").notNull(),
	company: varchar("company").notNull(),
	role: varchar("role").notNull(),
	linkedin: varchar("linkedin").notNull(),
},
(table) => {
	return {
		jobsUserIdUnique: unique("jobs_user_id_unique").on(table.userId),
	}
});

export const badges = pgTable("badges", {
	jobsId: uuid("jobs_id").notNull().references(() => jobs.id, { onDelete: "cascade" } ),
	label: label("label").notNull(),
	id: uuid("id").defaultRandom().primaryKey().notNull(),
});

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