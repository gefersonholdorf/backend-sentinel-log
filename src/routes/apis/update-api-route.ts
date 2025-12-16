import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import z4 from "zod/v4";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { UpdateApiController } from "../../controllers/apis/update-api-by-id-controller";
import { updateApiSchema } from "../../schemas/apis-schema";
import { db } from "../../databases/drizzle/drizzle-client";

export const updateApiRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const updateApiController = new UpdateApiController(apiRepository)

    app.withTypeProvider<ZodTypeProvider>().put('/apis/:id', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Apis'],
            summary: 'Update Api by Id',
            body: updateApiSchema,
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
    }, updateApiController.handle.bind(updateApiController))
}