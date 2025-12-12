import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { InactiveClientByIdController } from "../../controllers/clients/inactive-client-by-id-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import z4 from "zod/v4";

export const inactiveClientRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const inactiveClientController = new InactiveClientByIdController(clientRepository)

    app.withTypeProvider<ZodTypeProvider>().delete('/clients/:id', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Clients'],
            summary: 'Inactive Client by Id',
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
    }, inactiveClientController.handle.bind(inactiveClientController))
}