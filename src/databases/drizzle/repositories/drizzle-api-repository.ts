import { desc, eq, like, count, asc, sql } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { apisTable } from "../schemas/schema";
import type { Api, ApiInsert, ApiRepository, ApisPaginationParams, ApiUpdate } from "../../repositories/api-repository";

export class DrizzleApiRepository implements ApiRepository {
    constructor(private readonly db: MySql2Database) {}

    async create(data: ApiInsert): Promise<{ id: number; }> {
        const newApi = await this.db.insert(apisTable).values(data)

        return { id: newApi[0].insertId }
    }

    async findById(id: number): Promise<{ api: Api | null; }> {
        const Api = await this.db.select().from(apisTable).where(eq(apisTable.id, id))

        if (Api.length === 0) {
            return { api: null };
        }

        return { api: Api[0] }
    }

    async findAll(pagination: ApisPaginationParams): Promise<{
        data: Api[];
        page: number;
        perPage: number;
        totalPages: number;
    }> {
        const { page = 1, perPage = 10, orderBy = 'desc', filter } = pagination;
        const offset = (page - 1) * perPage;

        const totalResult = await this.db
            .select({ total: sql<number>`COUNT(*)` })
            .from(apisTable)
            .where(filter && filter.trim() !== '' ? like(apisTable.name, `%${filter}%`) : undefined);

        const totalItems = Number(totalResult[0].total);
        console.log(totalResult)
        const totalPages = Math.ceil(totalItems / perPage);

        const Apis = await this.db
            .select()
            .from(apisTable)
            .where(filter ? like(apisTable.name, `%${filter}%`) : undefined)
            .orderBy(desc(apisTable.id))
            .limit(perPage)
            .offset(offset);

        return {
            data: Apis,
            page,
            perPage,
            totalPages
        };
    }

    async save(id: number, data: ApiUpdate): Promise<void> {
        await this.db.update(apisTable)
                    .set(data)
                    .where(eq(apisTable.id, id));
    }
}