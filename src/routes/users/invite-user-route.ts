import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { inviteUserSchema } from "../../schemas/users-schema";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { DrizzleUserOnboardingTokenRepository } from "../../databases/drizzle/repositories/drizzle-user-onboarding-token-repository";
import { InviteUserController } from "../../controllers/users/invite-user-controller";

export const inviteUserRoute: FastifyPluginCallbackZod = (app) => {
    const userRepository = new DrizzleUserRepository(db)
    const clientRepository = new DrizzleClientRepository(db)
    const userOnBoardingToken = new DrizzleUserOnboardingTokenRepository(db)
    const inviteUserController = new InviteUserController(userRepository, clientRepository, userOnBoardingToken)

    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['Users'],
            summary: 'Invite a new User',
            body: inviteUserSchema,
            response: {
                200: z.object({
                    url: z.url()
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
    }, inviteUserController.handle.bind(inviteUserController))
}