import type { LogDocument } from "../mongo/schemas/mongo-logs-model";

export interface LogRepository {
    create(data: LogDocument): Promise<void>
}