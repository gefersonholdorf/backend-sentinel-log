import { Types } from "mongoose";
import type { LogPaginationParams, LogRepository } from "../../repositories/log-repository";
import { LogModel, type Log, type LogDocument } from "../schemas/mongo-logs-model";

export class MongoLogRepository implements LogRepository {
    async create(data: LogDocument): Promise<void> {
        await LogModel.create(data)
    }

    async findByClientId(params: LogPaginationParams): Promise<{
            data: LogDocument[],
            nextCursor?: string | null
        }> {

        const {
            clientId,
            limit,
            cursor,
            filter,
            apiId,
            dateFrom,
            dateTo
        } = params

        const query: Record<string, any> = {}

        if (clientId !== undefined) query.clientId = clientId
        if (apiId !== undefined) query.apiId = apiId

        if (cursor) {
            query._id = { $lt: new Types.ObjectId(cursor) }
        }

        if (filter) {
            query.message = { $regex: filter, $options: "i" }
        }

        if (dateFrom || dateTo) {
            query.date = {}
            if (dateFrom) query.date.$gte = dateFrom
            if (dateTo) query.date.$lte = dateTo
        }

        const result = await LogModel
            .find(query)
            .sort({ _id: -1 })
            .limit(limit + 1)

        const hasNextPage = result.length > limit
        const data = hasNextPage ? result.slice(0, limit) : result

        const nextCursor = hasNextPage
            ? data[data.length - 1]._id.toString()
            : null

        return {
            data,
            nextCursor
        }
    }

    async totalCount(): Promise<number> {
        const date = new Date()
        const today = date.getDay()

        const count = await LogModel.countDocuments({ date: { $gte: new Date(date.setDate(today)) } })

        return count
    }
}