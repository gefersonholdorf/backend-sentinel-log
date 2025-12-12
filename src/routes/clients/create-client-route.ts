import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { CreateClientController } from "../../controllers/clients/create-client-controller";
import { createClientSchema } from "../../schemas/clients-schema";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";

export const createClientRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const createClientController = new CreateClientController(clientRepository)

    app.withTypeProvider<ZodTypeProvider>().post('/clients', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin'])],
        schema: {
            tags: ['Clients'],
            summary: 'Create a new Client',
            body: createClientSchema,
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
    }, createClientController.handle.bind(createClientController))
}