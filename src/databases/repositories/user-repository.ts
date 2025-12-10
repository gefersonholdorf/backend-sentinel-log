import { usersTable } from "../drizzle/schemas/schema";

export type UserInsert = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type UserUpdate = Omit<typeof usersTable.$inferInsert, 'id'>;

export interface UserRepository {
    create(data: UserInsert): Promise<{ id: number }>;
    findByEmail(email: string): Promise<{user: User | null}>
    findById(id: number): Promise<{user: User | null}>
    findByCPF(cpf: string): Promise<{user: User | null}>
    save(id: number, data: UserUpdate): Promise<void>
}
