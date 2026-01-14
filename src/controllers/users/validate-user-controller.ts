import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserOnboardingTokenRepository } from "../../databases/repositories/user-onboarding-token";
import { EntityNotFoundError } from "../../errors/entity-not-found-error";
import { GoneError } from "../../errors/gone-error";
import { validateUserSchema } from "../../schemas/users-schema";
import type { Controller } from "../controller";
import type { UserRepository } from "../../databases/repositories/user-repository";

export class ValidateUserController implements Controller {
    constructor(
        private readonly userOnboardingTokenRepository: UserOnboardingTokenRepository,
        private readonly userRepository: UserRepository
    ) {}

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { token } = validateUserSchema.parse(request.query)

        if(!token) {
            throw new EntityNotFoundError()
        }

        try {
            const { userOnBoardingToken } = await this.userOnboardingTokenRepository.findByToken(token)
            
            if(!userOnBoardingToken) {
                throw new EntityNotFoundError()
            }

            const now = new Date()

            const isValid =
                userOnBoardingToken.usedAt === null &&
                new Date(userOnBoardingToken.expiresAt).getTime() > now.getTime()

            if(!isValid) {
                throw new GoneError()
            }

            const { user } = await this.userRepository.findById(userOnBoardingToken.userId)

            if(!user) {
                throw new EntityNotFoundError()
            }

            const { id, email, name, clientId, role} = user

            return {
                user: {
                    id,
                    email,
                    name,
                    clientId,
                    role
                }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}