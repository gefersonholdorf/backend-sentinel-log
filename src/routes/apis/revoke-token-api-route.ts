import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import z4 from "zod/v4";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { RevokeTokenApiByIdController } from "../../controllers/apis/revoke-token-api-controller";

export const revokeTokenApiRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const revokeTokenApiController = new RevokeTokenApiByIdController(apiRepository)

    app.withTypeProvider<ZodTypeProvider>().delete('/apis/:id/revoke', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Apis'],
            summary: 'Revoke Token Api by Id',
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
    }, revokeTokenApiController.handle.bind(revokeTokenApiController))
}