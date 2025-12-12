import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";
import type { UserRepository } from "../../databases/repositories/user-repository";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import { authProfileSchema } from "../../schemas/auth-profile-schema";

export class MeController implements Controller {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { id, role } = authProfileSchema.parse(request.profile)

        try {
            const user = await this.userRepository.findById(id)

            if(!user.user) {
                throw new EntityNotFoundError()
            }

            const { cpf, email, name, isActive, clientId, createdAt, updatedAt} = user.user

            return {
                user: {
                    id, name, cpf, email, role, isActive, clientId, createdAt, updatedAt
                }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}