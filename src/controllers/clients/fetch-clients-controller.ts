import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import { clientsPaginationParams } from "../../schemas/clients-schema";
import type { Controller } from "../controller";

export class FetchClientController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        const { page, perPage, filter, orderBy } = clientsPaginationParams.parse(request.query)

        try {
            const result = await this.clientRepository.findAll({page, perPage, filter, orderBy})

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