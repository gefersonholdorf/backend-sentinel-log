import type { FastifyReply, FastifyRequest } from "fastify";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import { createApiSchema } from "../../schemas/apis-schema";
import type { Controller } from "../controller";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";

export class CreateApiController implements Controller {
    constructor(
        private readonly apiRepository: ApiRepository,
        private readonly clientRepository: ClientRepository
    ) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { name, description, isActive, clientId, token, urlCallbackStatus } = createApiSchema.parse(request.body)

        try {

            const client = await this.clientRepository.findById(clientId)

            if(!client.client) {
                throw new EntityNotFoundError()
            }

            const expiresIn = new Date()
            expiresIn.setMonth(expiresIn.getMonth() + 3)

            const result = await this.apiRepository.create({
                name, description, isActive, clientId, expiresIn, token, urlCallbackStatus,  
            })

            return reply.status(201).send({
                id: result.id
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}