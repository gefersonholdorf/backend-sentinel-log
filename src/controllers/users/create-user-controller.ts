import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import type { Controller } from "../controller";
import type { CreateUserSchema } from "../../schemas/users-schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import type { UserRepository } from "../../databases/repositories/user-repository";
import { ExistingEntityError } from "../../errors/existing-entity-error";

export class CreateUserController implements Controller {
    constructor(private readonly userRepository: UserRepository) {}

    async handle (request: FastifyRequest<{ Body: CreateUserSchema }>, reply: FastifyReply){
        const { name, password, email, cpf, role } = request.body

        try {
            const existingUserWithByEmail = await this.userRepository.findByEmail(email)

            if(existingUserWithByEmail.user) {
                throw new ExistingEntityError('This email already exists.')
            }

            const existingUserWithByCPF = await this.userRepository.findByCPF(cpf)

            if(existingUserWithByCPF.user) {
                throw new ExistingEntityError('This cpf already exists.')
            }

            const salt = genSaltSync(10);
            const passwordHashed = hashSync(password, salt);

            const result = await this.userRepository.create({
                cpf, email, name, role, password: passwordHashed, 
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