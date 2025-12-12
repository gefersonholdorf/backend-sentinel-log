import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { CreateUserController } from "../../controllers/users/create-user-controller";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserSchema } from "../../schemas/users-schema";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
    const userRepository = new DrizzleUserRepository(db)
    const clientRepository = new DrizzleClientRepository(db)
    const createUserController = new CreateUserController(userRepository, clientRepository)

    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['Users'],
            summary: 'Create a new User',
            body: createUserSchema,
            response: {
                201: z.object({
                    id: z.number()
                }),
                404: z.object({
                    message: z.string()
                }),
                409: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, createUserController.handle.bind(createUserController))
}