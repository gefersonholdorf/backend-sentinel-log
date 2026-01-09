import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { Controller } from "../controller";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import { getClientByIdParam } from "../../schemas/clients-schema";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import type { LogRepository } from "../../databases/repositories/log-repository";

export class GetClientByIdController implements Controller {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly apiRepository: ApiRepository,
        private readonly logRepository: LogRepository
    ) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        const { id } = getClientByIdParam.parse(request.params)

        try {
            const result = await this.clientRepository.findFullClientById(id)

            const { total: totalApis, totalActive: totalApisActive, totalInactive: totalApisInactive } = await this.apiRepository.totalCount(id)
            const totalLogs = await this.logRepository.totalCount(id)
            const volumeLogsTodayData = await this.logRepository.volumeLogsToday(id)

            if(!result.client) {
                throw new EntityNotFoundError()
            }

            let logsByApi: {
                apis: string;
                quantity: number;
            }[] = []

            if (result.client.apis.length > 0) {
                logsByApi = await Promise.all(
                    result.client.apis.map(async (api) => {
                        const quantity = await this.logRepository.totalCountByAPI(api.id)

                        return {
                            apis: api.name,
                            quantity
                        }
                    })
                )
            }

            return reply.status(200).send({
                client: result.client,
                totalApis,
                totalApisActive,
                totalApisInactive,
                totalLogs,
                volumeLogsTodayData,
                logsByApi
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}