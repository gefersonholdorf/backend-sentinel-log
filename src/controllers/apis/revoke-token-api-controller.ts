import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import type { ApiRepository } from "../../databases/repositories/api-repository";

export class RevokeTokenApiByIdController implements Controller {
    constructor(private readonly apiRepository: ApiRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { id } = request.params as { id: number }

        try {
            const api = await this.apiRepository.findById(id)
            
            if(!api.api) {
                throw new EntityNotFoundError()
            }

            api.api.isActive = false
            api.api.token = null
            api.api.expiresIn = new Date()
                        
            await this.apiRepository.save(id, api.api)

            return reply.status(204).send()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}