import { genSaltSync, hashSync } from "bcrypt-ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientRepository } from "../../databases/repositories/client-repository";
import type { UserRepository } from "../../databases/repositories/user-repository";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import { ExistingEntityError } from "../../errors/existing-entity-error";
import { inviteUserSchema } from "../../schemas/users-schema";
import type { Controller } from "../controller";
import type { UserOnboardingTokenRepository } from "../../databases/repositories/user-onboarding-token";
import { env } from "../../env";

export class InviteUserController implements Controller {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository,
        private readonly userOnboardingTokenRepository: UserOnboardingTokenRepository
    ) {}

    async handle (request: FastifyRequest, reply: FastifyReply){
        const { name, email, role, clientId } = inviteUserSchema.parse(request.body)

        try {
            const existingUserWithByEmail = await this.userRepository.findByEmail(email)

            if(existingUserWithByEmail.user) {
                throw new ExistingEntityError('This email already exists.')
            }

            let existingClientId: number | null = null

            if(clientId) {
                const client = await this.clientRepository.findById(clientId)

                if (!client.client) {
                    throw new EntityNotFoundError()
                }

                existingClientId = client.client?.id
            }

            const salt = genSaltSync(10);
            const token = await crypto.randomUUID()
            const tokenHashed = hashSync(token, salt);

            const { id: userId } = await this.userRepository.create({
                email, name, role, clientId: existingClientId
            })

            const expiresAt = new Date()
            expiresAt.setMinutes(expiresAt.getMinutes() + 5)

            await this.userOnboardingTokenRepository.create({
                userId, expiresAt, token: tokenHashed
            })

            const url = `${env.URL}/onboarding/validate-token?token=${tokenHashed}`

            return reply.status(200).send({
                url
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}