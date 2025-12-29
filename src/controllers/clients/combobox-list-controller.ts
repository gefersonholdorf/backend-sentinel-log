import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { Controller } from "../controller";

export class ComboboxListController implements Controller {
    constructor(private readonly clientRepository: ClientRepository) {}

    async handle (request: FastifyRequest, reply: FastifyReply){

        try {
            const result = await this.clientRepository.comboboxList()

            return reply.status(200).send({
                data: result,
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}