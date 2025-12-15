import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import z4 from "zod/v4";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { InactiveApiByIdController } from "../../controllers/apis/inactive-api-by-id-controller";

export const inactiveApiRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const inactiveApiController = new InactiveApiByIdController(apiRepository)

    app.withTypeProvider<ZodTypeProvider>().delete('/apis/:id', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Apis'],
            summary: 'Inactive Api by Id',
            params: z4.object({
                id: z.coerce.number()
            }),
            response: {
                204: z.object({}),
                404: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, inactiveApiController.handle.bind(inactiveApiController))
}