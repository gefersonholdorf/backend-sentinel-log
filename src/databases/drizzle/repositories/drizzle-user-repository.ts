import type { User, UserInsert, UserRepository, UserUpdate } from "../../repositories/user-repository";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { usersTable } from "../schemas/schema";
import { eq, sql } from "drizzle-orm";

export class DrizzleUserRepository implements UserRepository {
    constructor(private readonly db: MySql2Database) {}

    async create(data: UserInsert): Promise<{ id: number; }> {
        const newUser = await this.db.insert(usersTable).values(data)

        return { id: newUser[0].insertId }
    }

    async findByEmail(email: string): Promise<{ user: User | null; }> {
        const user = await this.db.select().from(usersTable).where(eq(usersTable.email, email))

        if(!user) {
            return {
                user: null
            }
        }

        return { user: user[0] }
    }

    async findById(id: number): Promise<{ user: User | null; }> {
        const user = await this.db.select().from(usersTable).where(eq(usersTable.id, id))

        if (user.length === 0) {
            return { user: null };
        }

        return { user: user[0] }
    }

    async findByCPF(cpf: string): Promise<{ user: User | null; }> {
        const user = await this.db.select().from(usersTable).where(eq(usersTable.cpf, cpf))

        if (user.length === 0) {
            return { user: null };
        }

        return { user: user[0] }
    }

    async save(id: number, data: UserUpdate): Promise<void> {
        await this.db.update(usersTable)
                    .set(data)
                    .where(eq(usersTable.id, id));
    }
}