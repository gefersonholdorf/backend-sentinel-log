
import type { MySql2Database } from "drizzle-orm/mysql2";
import { clientsTable } from "../schemas/schema";
import { eq } from "drizzle-orm";
import type { Client, ClientInsert, ClientRepository, ClientUpdate } from "../../repositories/client-repository";

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

    async findAll(): Promise<{ data: Client[]; }> {
        const clients = await this.db.select().from(clientsTable)

        return {
            data: clients
        }
    }

    async save(id: number, data: ClientUpdate): Promise<void> {
        await this.db.update(clientsTable)
                    .set(data)
                    .where(eq(clientsTable.id, id));
    }
}