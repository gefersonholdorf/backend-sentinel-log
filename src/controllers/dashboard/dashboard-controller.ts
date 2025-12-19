import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { LogRepository } from "../../databases/repositories/log-repository";
import type { ApiRepository } from "../../databases/repositories/api-repository";

export class DashboardController implements Controller {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly logRepository: LogRepository,
        private readonly apiRepository: ApiRepository
    ) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const totalClients = await this.clientRepository.totalCount()
        const { total: totalApis, totalActive: totalApisActive, totalInactive: totalApisInactive } = await this.apiRepository.totalCount()
        const totalLogsToday = await this.logRepository.totalCount()

        return reply.status(200).send({
            totalClients,
            totalApis,
            totalApisActive,
            totalApisInactive,
            totalLogsToday
        })
    }
}