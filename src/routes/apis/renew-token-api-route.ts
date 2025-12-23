import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import z4 from "zod/v4";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { renewTokenApiSchema } from "../../schemas/apis-schema";
import { db } from "../../databases/drizzle/drizzle-client";
import { RenewTokenApiByIdController } from "../../controllers/apis/renew-token-api-controller";

export const renewTokenApiRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const renewTokenApiController = new RenewTokenApiByIdController(apiRepository, app)

    app.withTypeProvider<ZodTypeProvider>().post('/apis/:id/renew', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Apis'],
            summary: 'Renew Token Api by Id',
            body: renewTokenApiSchema,
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
    }, renewTokenApiController.handle.bind(renewTokenApiController))
}