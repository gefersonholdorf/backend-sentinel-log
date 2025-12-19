import type { LogPaginationParams, LogRepository } from "../../repositories/log-repository";
import { LogModel, type Log, type LogDocument } from "../schemas/mongo-logs-model";

export class MongoLogRepository implements LogRepository {
    async create(data: LogDocument): Promise<void> {
        await LogModel.create(data)
    }

    async findByClientId(params: LogPaginationParams): Promise<{
            data: LogDocument[]
        }> {

        const { clientId } = params

        const filter: Record<string, any> = {}

        if (clientId !== null && clientId !== undefined) {
            filter.clientId = clientId
        }

        const result = await LogModel.find(filter)

        return {
            data: result
        }
    }

    async totalCount(): Promise<number> {
        const date = new Date()
        const today = date.getDay()

        const count = await LogModel.countDocuments({ date: { $gte: new Date(date.setDate(today)) } })

        return count
    }
}