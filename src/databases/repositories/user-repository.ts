import { usersTable } from "../drizzle/schemas/schema";

export type UserInsert = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;

export interface UserRepository {
    create(data: UserInsert): Promise<{ id: number }>;
    findByEmail(email: string): Promise<{user: User | null}>
    findById(id: number): Promise<{user: User | null}>
    findByCPF(cpf: string): Promise<{user: User | null}>
}
