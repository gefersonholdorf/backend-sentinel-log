import type { Log, LogDocument } from "../mongo/schemas/mongo-logs-model";

export interface LogPaginationParams {
    clientId: number | null
}

export interface LogRepository {
    create(data: LogDocument): Promise<void>
    findByClientId(params: LogPaginationParams): Promise<{
        data: LogDocument[]
    }>
}