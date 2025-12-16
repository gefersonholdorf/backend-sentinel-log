import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { FetchClientController } from "../../controllers/clients/fetch-clients-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { clientsPaginationParams } from "../../schemas/clients-schema";

const clientSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    apis: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const UsersArraySchema = z.array(clientSchema);

export const fetchClientsRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const fetchClientController = new FetchClientController(clientRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/clients', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin', 'member'])],
        schema: {
            tags: ['Clients'],
            summary: 'Fetch Clients',
            querystring: clientsPaginationParams,
            response: {
                200: z.object({
                    data: UsersArraySchema,
                    page: z.number(),
                    perPage: z.number(),
                    totalPages: z.number(),
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, fetchClientController.handle.bind(fetchClientController))
}