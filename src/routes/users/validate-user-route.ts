import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ValidateUserController } from "../../controllers/users/validate-user-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleUserOnboardingTokenRepository } from "../../databases/drizzle/repositories/drizzle-user-onboarding-token-repository";
import { validateUserSchema } from "../../schemas/users-schema";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";

export const validateUserRoute: FastifyPluginCallbackZod = (app) => {
    const userOnBoardingToken = new DrizzleUserOnboardingTokenRepository(db)
    const userRepository = new DrizzleUserRepository(db)
    const validateUserController = new ValidateUserController(userOnBoardingToken, userRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/onboarding/validate-token', {
        schema: {
            tags: ['Users'],
            summary: 'Validate a new User',
            querystring: validateUserSchema,
            response: {
                200: z.object({
                    user: z.object({
                        id: z.number(),
                        email: z.email(),
                        name: z.string(),
                        clientId: z.number().nullable(),
                        role: z.enum(['super_admin', 'admin', 'member'])
                    })
                }),
                404: z.object({
                    message: z.string()
                }),
                410: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, validateUserController.handle.bind(validateUserController))
}