import { clientsTable, apisTable } from "../drizzle/schemas/schema";

export type ClientInsert = typeof clientsTable.$inferInsert;
export type Client = typeof clientsTable.$inferSelect;
export type ClientUpdate = Omit<typeof clientsTable.$inferInsert, 'id'>;

export type Api = typeof apisTable.$inferSelect;

export type ClientFull = Client & {
    apis: Api[];
};

export interface ClientsPaginationParams {
    page?: number
    perPage?: number
    orderBy?: 'asc' | 'desc'
    filter?: string
}

export interface ClientRepository {
    create(data: ClientInsert): Promise<{ id: number }>;
    findById(id: number): Promise<{client: Client | null}>
    findFullClientById(id: number): Promise<{client: ClientFull | null}>
    findAll(pagination: ClientsPaginationParams, clientId: number | undefined): Promise<{
        data: Client[];
        page: number;
        perPage: number;
        totalPages: number;
    }>
    save(id: number, data: ClientUpdate): Promise<void>
    findByIds(ids: number[]): Promise<{
        id: number;
        name: string;
    }[]>
    totalCount(): Promise<number>
    comboboxList(): Promise<{ value: number; label: string; }[]>
}
