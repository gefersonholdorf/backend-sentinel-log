import { drizzle } from "drizzle-orm/mysql2"
import { env } from "../../env";
import { usersTable } from "./schemas/schema";

export const db = drizzle(env.DATABASE_URL);

db.select().from(usersTable)