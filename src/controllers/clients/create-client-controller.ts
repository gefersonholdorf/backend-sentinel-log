import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import { createClientSchema, CreateClientSchema } from "../../schemas/clients-schema";
import type { Controller } from "../controller";

export class CreateClientController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { name, description, isActive } = createClientSchema.parse(request.body)

        try {
            const result = await this.clientRepository.create({
                name, description, isActive 
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