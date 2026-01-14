import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { DrizzleUserOnboardingTokenRepository } from "../../databases/drizzle/repositories/drizzle-user-onboarding-token-repository";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";
import { completeUserSchema } from "../../schemas/users-schema";
import { CompleteUserController } from "../../controllers/users/complete-user-controller";

export const completeUserRoute: FastifyPluginCallbackZod = (app) => {
    const userRepository = new DrizzleUserRepository(db)
    const clientRepository = new DrizzleClientRepository(db)
    const userOnBoardingToken = new DrizzleUserOnboardingTokenRepository(db)
    const completeUserController = new CompleteUserController(userRepository, clientRepository, userOnBoardingToken)

    app.withTypeProvider<ZodTypeProvider>().post('/users/:id', {
        schema: {
            tags: ['Users'],
            summary: 'Complete info a new User',
            body: completeUserSchema,
            response: {
                204: z.object({}),
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
    }, completeUserController.handle.bind(completeUserController))
}