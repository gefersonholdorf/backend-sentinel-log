import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import { renewTokenApiSchema } from "../../schemas/apis-schema";

export class RenewTokenApiByIdController implements Controller {
    constructor(
        private readonly apiRepository: ApiRepository,
        private readonly app: FastifyInstance
    ) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { id } = request.params as { id: number }
        const { expiresIn } = renewTokenApiSchema.parse(request.body)

        try {
            const api = await this.apiRepository.findById(id)
            
            if(!api.api) {
                throw new EntityNotFoundError()
            }

            const token = await this.app.jwt.sign({
                clientId: api.api.clientId,
                apiId: id
            })

            api.api.expiresIn = expiresIn
            api.api.token = token
            api.api.isActive = true
                        
            await this.apiRepository.save(id, api.api)

            return reply.status(204).send()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}