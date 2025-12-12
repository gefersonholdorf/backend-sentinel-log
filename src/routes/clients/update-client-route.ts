import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UpdateClientController } from "../../controllers/clients/update-client-by-id-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { createClientSchema } from "../../schemas/clients-schema";
import z4 from "zod/v4";

export const updateClientRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const updateClientController = new UpdateClientController(clientRepository)

    app.withTypeProvider<ZodTypeProvider>().put('/clients/:id', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Clients'],
            summary: 'Update Client by Id',
            body: createClientSchema,
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
    }, updateClientController.handle.bind(updateClientController))
}