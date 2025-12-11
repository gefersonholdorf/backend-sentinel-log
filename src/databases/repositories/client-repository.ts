import { clientsTable } from "../drizzle/schemas/schema";

export type ClientInsert = typeof clientsTable.$inferInsert;
export type Client = typeof clientsTable.$inferSelect;
export type ClientUpdate = Omit<typeof clientsTable.$inferInsert, 'id'>;

export interface ClientRepository {
    create(data: ClientInsert): Promise<{ id: number }>;
    findById(id: number): Promise<{client: Client | null}>
    findAll(): Promise<{data: Client[]}>
    save(id: number, data: ClientUpdate): Promise<void>
}
