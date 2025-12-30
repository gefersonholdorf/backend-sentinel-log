import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { Controller } from "../controller";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";

export class GetClientByIdController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        try {
            const result = await this.clientRepository.findFullClientById(3)

            if(!result.client) {
                throw new EntityNotFoundError()
            }

            console.log(result.client)

            return reply.status(200).send({
                client: result.client
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}