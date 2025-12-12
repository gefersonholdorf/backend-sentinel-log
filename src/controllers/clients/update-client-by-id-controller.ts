import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { Controller } from "../controller";
import { updateClientSchema } from "../../schemas/clients-schema";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";


export class UpdateClientController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        const { name, isActive, description } = updateClientSchema.parse(request.body)
        const { id } = request.params as { id: number }

        try {
            const client = await this.clientRepository.findById(id)

            if(!client.client) {
                throw new EntityNotFoundError()
            }

            await this.clientRepository.save(id, {
                name, description, isActive 
            })

            return reply.status(204).send()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}