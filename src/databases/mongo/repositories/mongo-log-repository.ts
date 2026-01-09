import { Types } from "mongoose";
import type { LogPaginationParams, LogRepository, VolumeLogsAggregation, VolumeLogsTodayResult } from "../../repositories/log-repository";
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

    async totalCountToday(clientId: number | null): Promise<number> {

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)


    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const filter: {
        date: { $gte: Date; $lte: Date }
        clientId?: number
    } = {
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }

    if (clientId !== null) {
        filter.clientId = clientId
    }

    return LogModel.countDocuments(filter)
}

    async volumeLogsToday(
    clientId: number | null
): Promise<VolumeLogsTodayResult[]> {

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const match: {
        date: { $gte: Date; $lte: Date }
        clientId?: number
    } = {
        date: { $gte: startOfDay, $lte: endOfDay }
    }

    if (clientId !== null) {
        match.clientId = clientId
    }

    const aggregation = await LogModel.aggregate<VolumeLogsAggregation>([
        { $match: match },
        {
            $group: {
                _id: {
                    hour: {
                        $hour: {
                            date: "$date",
                            timezone: "-03:00"
                        }
                    }
                },
                quantity: { $sum: 1 }
            }
        }
    ])

    const quantityByHour = new Map<number, number>(
        aggregation.map(item => [item._id.hour, item.quantity])
    )

    const result: VolumeLogsTodayResult[] = Array.from(
        { length: 24 },
        (_, hour): VolumeLogsTodayResult => ({
            hour: `${hour.toString().padStart(2, "0")}:00`,
            quantity: quantityByHour.get(hour) ?? 0
        })
    )

    return result
}

    async totalCount(clientId?: number): Promise<number> {
        const filter: { clientId?: number } = {}

        if (typeof clientId === 'number') {
            filter.clientId = clientId
        }

        return LogModel.countDocuments(filter)
    }

    async totalCountByAPI(apiId: number): Promise<number> {
        const filter: { apiId?: number } = {}

        if (typeof apiId === 'number') {
            filter.apiId = apiId
        }

        return LogModel.countDocuments(filter)
    }
}
