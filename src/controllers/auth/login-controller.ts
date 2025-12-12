import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { compareSync } from "bcrypt-ts";
import { loginSchema, type LoginSchema } from "../../schemas/users-schema";
import type { Controller } from "../controller";
import type { UserRepository } from "../../databases/repositories/user-repository";
import { CredentialInvalidError } from "../../errors/credential-invalid-error";

export class LoginController implements Controller {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly app: FastifyInstance
    ) { }

    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = loginSchema.parse(request.body)

        try {
            const existingUser = await this.userRepository.findByEmail(email)

            if (!existingUser.user) {
                throw new CredentialInvalidError()
            }

            const isPasswordValid = compareSync(password, existingUser.user.password)

            if (!isPasswordValid) {
                throw new CredentialInvalidError()
            }

            const token = await this.app.jwt.sign({
                sub: existingUser.user.id,
                role: existingUser.user.role
            }, {
                expiresIn: '10m'
            })

            return reply.status(200).send({
                token
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}