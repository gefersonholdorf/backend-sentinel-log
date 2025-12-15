import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import type { ApiRepository } from "../../databases/repositories/api-repository";
import { updateApiSchema } from "../../schemas/apis-schema";


export class UpdateApiController implements Controller {
    constructor(private readonly apiRepository: ApiRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        const { name, isActive, description, urlCallbackStatus } = updateApiSchema.parse(request.body)
        const { id } = request.params as { id: number }

        try {
            const api = await this.apiRepository.findById(id)

            if(!api.api) {
                throw new EntityNotFoundError()
            }

            await this.apiRepository.save(id, {
                ...api.api, name, isActive, description, urlCallbackStatus
            })

            return reply.status(204).send()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}