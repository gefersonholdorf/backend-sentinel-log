import type { LogRepository } from "../../repositories/log-repository";
import { LogModel, type LogDocument } from "../schemas/mongo-logs-model";

export class MongoLogRepository implements LogRepository {
    async create(data: LogDocument): Promise<void> {
        await LogModel.create(data)
    }
}