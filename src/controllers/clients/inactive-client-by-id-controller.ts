import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";

export class InactiveClientByIdController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { id } = request.params as { id: number }

        try {
            const client = await this.clientRepository.findById(id)
            
            if(!client.client) {
                throw new EntityNotFoundError()
            }

            client.client.isActive = false

            const { name, description, isActive } = client.client
                        
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