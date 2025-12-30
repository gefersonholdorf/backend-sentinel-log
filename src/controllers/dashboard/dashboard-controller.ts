import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { LogRepository } from "../../databases/repositories/log-repository";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import { authProfileSchema } from "../../schemas/auth-profile-schema";
import { dashboardQueryParams } from "../../routes/dashboard/dashboard-route";

export class DashboardController implements Controller {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly logRepository: LogRepository,
        private readonly apiRepository: ApiRepository
    ) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { clientId: authClientId } = authProfileSchema.parse(request.profile)

        const { clientId: queryClientId } = dashboardQueryParams.parse(request.query)

        const clientId = authClientId !== null ? authClientId : queryClientId || null

        const totalClients = !clientId ? await this.clientRepository.totalCount() : 1
        const { total: totalApis, totalActive: totalApisActive, totalInactive: totalApisInactive } = await this.apiRepository.totalCount(clientId)
        const totalLogsToday = await this.logRepository.totalCount(clientId)
        const volumeLogsTodayData = await this.logRepository.volumeLogsToday(clientId)

        return reply.status(200).send({
            totalClients,
            totalApis,
            totalApisActive,
            totalApisInactive,
            totalLogsToday,
            volumeLogsTodayData
        })
    }
}