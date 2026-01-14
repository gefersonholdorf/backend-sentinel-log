import { genSaltSync, hashSync } from "bcrypt-ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { UserOnboardingTokenRepository } from "../../databases/repositories/user-onboarding-token";
import type { UserRepository } from "../../databases/repositories/user-repository";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import { completeUserSchema } from "../../schemas/users-schema";
import type { Controller } from "../controller";

export class CompleteUserController implements Controller {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository,
        private readonly userOnboardingTokenRepository: UserOnboardingTokenRepository
    ) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { name, email, cpf, password } = completeUserSchema.parse(request.body)
        const { id } = request.params as { id: number }

        try {
            const existingUserWithById = await this.userRepository.findById(id)

            if(!existingUserWithById.user) {
                throw new EntityNotFoundError()
            }

            const salt = genSaltSync(10);
            const passwordHashed = hashSync(password, salt);

            existingUserWithById.user.name = name
            existingUserWithById.user.email = email
            existingUserWithById.user.cpf = cpf
            existingUserWithById.user.password = passwordHashed
            existingUserWithById.user.isActive = true

            await this.userRepository.save(id, existingUserWithById.user)

            return reply.status(204).send()
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}