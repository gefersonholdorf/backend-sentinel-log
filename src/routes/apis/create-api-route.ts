import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { CreateApiController } from "../../controllers/apis/create-api-controller";
import { createApiSchema } from "../../schemas/apis-schema";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";

export const createApiRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const clientRepository = new DrizzleClientRepository(db)
    const createApiController = new CreateApiController(apiRepository, clientRepository, app)

    app.withTypeProvider<ZodTypeProvider>().post('/apis', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Apis'],
            summary: 'Create a new Api',
            body: createApiSchema,
            response: {
                201: z.object({
                    id: z.number()
                }),
                404: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, createApiController.handle.bind(createApiController))
}