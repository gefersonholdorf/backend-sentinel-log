import { clientsTable } from "../drizzle/schemas/schema";

export type ClientInsert = typeof clientsTable.$inferInsert;
export type Client = typeof clientsTable.$inferSelect;
export type ClientUpdate = Omit<typeof clientsTable.$inferInsert, 'id'>;

export interface ClientsPaginationParams {
    page?: number
    perPage?: number
    orderBy?: 'asc' | 'desc'
    filter?: string
}

export interface ClientRepository {
    create(data: ClientInsert): Promise<{ id: number }>;
    findById(id: number): Promise<{client: Client | null}>
    findAll(pagination: ClientsPaginationParams): Promise<{
        data: Client[];
        page: number;
        perPage: number;
        totalPages: number;
    }>
    save(id: number, data: ClientUpdate): Promise<void>
}
