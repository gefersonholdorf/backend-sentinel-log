import { desc, eq, like, count, asc, sql, inArray } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Client, ClientInsert, ClientRepository, ClientsPaginationParams, ClientUpdate } from "../../repositories/client-repository";
import { apisTable, clientsTable } from "../schemas/schema";

export class DrizzleClientRepository implements ClientRepository {
    constructor(private readonly db: MySql2Database) {}

    async create(data: ClientInsert): Promise<{ id: number; }> {
        const newClient = await this.db.insert(clientsTable).values(data)

        return { id: newClient[0].insertId }
    }

    async findById(id: number): Promise<{ client: Client | null; }> {
        const client = await this.db.select().from(clientsTable).where(eq(clientsTable.id, id))

        if (client.length === 0) {
            return { client: null };
        }

        return { client: client[0] }
    }

    async findAll(pagination: ClientsPaginationParams): Promise<{
        data: Client[];
        page: number;
        perPage: number;
        totalPages: number;
    }> {
        const { page = 1, perPage = 10, orderBy = 'desc', filter } = pagination;
        const offset = (page - 1) * perPage;

        const totalResult = await this.db
            .select({ total: sql<number>`COUNT(*)` })
            .from(clientsTable)
            .where(filter && filter.trim() !== '' ? like(clientsTable.name, `%${filter}%`) : undefined);

        const totalItems = Number(totalResult[0].total);

        const totalPages = Math.ceil(totalItems / perPage);

        const clients = await this.db
    .select({
            id: clientsTable.id,
            name: clientsTable.name,
            description: clientsTable.description,
            isActive: clientsTable.isActive,
            apis: sql<number>`COUNT(${apisTable.id})`,
            createdAt: clientsTable.createdAt,
            updatedAt: clientsTable.updatedAt,
        })
        .from(clientsTable)
        .leftJoin(
            apisTable,
            eq(apisTable.clientId, clientsTable.id)
        )
        .where(
            filter ? like(clientsTable.name, `%${filter}%`) : undefined
        )
        .groupBy(
            clientsTable.id,
            clientsTable.name,
            clientsTable.description,
            clientsTable.isActive,
            clientsTable.createdAt,
            clientsTable.updatedAt
        )
        .orderBy(desc(clientsTable.id))
        .limit(perPage)
        .offset(offset);

        return {
            data: clients,
            page,
            perPage,
            totalPages
        };
    }

    async save(id: number, data: ClientUpdate): Promise<void> {
        await this.db.update(clientsTable)
                    .set(data)
                    .where(eq(clientsTable.id, id));
    }

    async findByIds(ids: number[]) {
        return await this.db
            .select({
                id: clientsTable.id,
                name: clientsTable.name
            })
            .from(clientsTable)
            .where(inArray(clientsTable.id, ids))
    }

    async totalCount(): Promise<number> {
        const result = await this.db
            .select({ total: sql<number>`COUNT(*)` })
            .from(clientsTable);

        return Number(result[0].total)
    }

    async comboboxList(): Promise<{ value: number; label: string; }[]> {
        const result =  await this.db
            .select({
                id: clientsTable.id,
                name: clientsTable.name
            })
            .from(clientsTable)
            .orderBy(asc(clientsTable.name))

        return result.map(item => ({ value: item.id, label: item.name }))
    }
}