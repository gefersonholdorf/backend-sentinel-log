import { apisTable } from "../drizzle/schemas/schema";

export type ApiInsert = typeof apisTable.$inferInsert;
export type Api = typeof apisTable.$inferSelect;
export type ApiUpdate = Omit<typeof apisTable.$inferInsert, 'id' | 'clientId'>;

export interface ApisPaginationParams {
    page?: number
    perPage?: number
    orderBy?: 'asc' | 'desc'
    filter?: string
    clientId?: number
}

export interface ApiRepository {
    create(data: ApiInsert): Promise<{ id: number }>;
    findById(id: number): Promise<{api: Api | null}>
    findAll(pagination: ApisPaginationParams): Promise<{
        data: Api[];
        page: number;
        perPage: number;
        totalPages: number;
    }>
    save(id: number, data: ApiUpdate): Promise<void>
    findByIds(ids: number[]): Promise<{
        id: number;
        name: string;
    }[]>
    totalCount(): Promise<{ 
        total: number
        totalActive: number
        totalInactive: number
    }>
}
