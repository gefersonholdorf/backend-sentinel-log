import { desc, eq, like, count, asc, sql, and } from "drizzle-orm";
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
        const api = await this.db.select().from(apisTable).where(eq(apisTable.id, id))

        if (api.length === 0) {
            return { api: null };
        }

        return { api: api[0] }
    }

    async findAll(pagination: ApisPaginationParams): Promise<{
        data: Api[];
        page: number;
        perPage: number;
        totalPages: number;
    }> {
        const { page = 1, perPage = 10, orderBy = 'desc', filter, clientId } = pagination;
        const offset = (page - 1) * perPage;


        const whereClause = and(
        filter && filter.trim() !== ''
            ? like(apisTable.name, `%${filter}%`)
            : undefined,
        clientId
            ? eq(apisTable.clientId, clientId)
            : undefined
    );

        const totalResult = await this.db
            .select({ total: sql<number>`COUNT(*)` })
            .from(apisTable)
            .where(whereClause);

        const totalItems = Number(totalResult[0].total);

        const totalPages = Math.ceil(totalItems / perPage);

        const apis = await this.db
            .select()
            .from(apisTable)
            .where(whereClause)
            .orderBy(desc(apisTable.id))
            .limit(perPage)
            .offset(offset);

        return {
            data: apis,
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