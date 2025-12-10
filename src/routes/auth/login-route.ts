import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginSchema } from "../../schemas/users-schema";
import { DrizzleUserRepository } from "../../databases/drizzle/repositories/drizzle-user-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { LoginController } from "../../controllers/auth/login-controller";

export const loginRoute: FastifyPluginCallbackZod = (app) => {
    const userRepository = new DrizzleUserRepository(db)
    const loginController = new LoginController(userRepository, app)

    app.withTypeProvider<ZodTypeProvider>().post('/auth/login', {
        schema: {
            tags: ['Auth'],
            summary: 'Login',
            body: loginSchema,
            response: {
                200: z.object({
                    token: z.string()
                }),
                401: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, loginController.handle.bind(loginController))
}