import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import { apisPaginationParams } from "../../schemas/apis-schema";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import { authProfileSchema } from "../../schemas/auth-profile-schema";

export class FetchApisController implements Controller {
    constructor(private readonly apiRepository: ApiRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        let clientId: number | undefined

        const { page, perPage, filter, orderBy, clientId: paginationClientId } = apisPaginationParams.parse(request.query)
        const { clientId: authClientId } = authProfileSchema.parse(request.profile)

        clientId = authClientId ? authClientId : paginationClientId

        try {
            const result = await this.apiRepository.findAll({page, perPage, filter, orderBy, clientId})

            return reply.status(200).send({
                data: result.data,
                page: result.page,
                perPage: result.perPage,
                totalPages: result.totalPages
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}