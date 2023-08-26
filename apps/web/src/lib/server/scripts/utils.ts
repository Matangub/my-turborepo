import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
dotenv.config();

const sql = postgres(process.env.POSTGRES_CONNECTION_STRING!, { max: 1 });
export const seedingDb = drizzle(sql);
