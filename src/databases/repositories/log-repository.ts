import type { Log, LogDocument } from "../mongo/schemas/mongo-logs-model";

export interface LogPaginationParams {
    clientId?: number
    limit: number
    cursor?: string
    filter?: string
    apiId?: number
    dateFrom?: Date
    dateTo?: Date
}

export interface VolumeLogsAggregation {
    _id: {
        hour: number
    }
    quantity: number
}

export interface VolumeLogsTodayResult {
    hour: string
    quantity: number
}

export interface LogRepository {
    create(data: LogDocument): Promise<void>
    findByClientId(params: LogPaginationParams): Promise<{
        data: LogDocument[]
        nextCursor?: string | null
    }>
    totalCountToday(clientId: number | null): Promise<number>
    volumeLogsToday(clientId: number | null): Promise<VolumeLogsTodayResult[]>
    totalCount(clientId: number): Promise<number>
    totalCountByAPI(apiId: number): Promise<number>
}