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

export interface LogRepository {
    create(data: LogDocument): Promise<void>
    findByClientId(params: LogPaginationParams): Promise<{
        data: LogDocument[]
        nextCursor?: string | null
    }>
    totalCount(): Promise<number>
}