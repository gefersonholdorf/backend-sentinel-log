import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { MeController } from "../../controllers/auth/me-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";

export const meRoute: FastifyPluginCallbackZod = (app) => {
    const userRepository = new DrizzleUserRepository(db)
    const meController = new MeController(userRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/auth/me', {
        preHandler: [isAuthenticate(app)],
        schema: {
            tags: ['Auth'],
            summary: 'User data',
            response: {
                200: z.object({
                    user: z.object({
                        id: z.coerce.number(),
                        name: z.string(),
                        email: z.string(),
                        role: z.enum(['super_admin', 'admin', 'member']),
                        isActive: z.boolean(),
                        clientId: z.number().nullable(),
                        createdAt: z.date(),
                        updatedAt: z.date()
                    })
                }),
                404: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, meController.handle.bind(meController))
}