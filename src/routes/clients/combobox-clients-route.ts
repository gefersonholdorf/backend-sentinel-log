import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ComboboxListController } from "../../controllers/clients/combobox-list-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";

const clientSchema = z.object({
    value: z.number(),
    label: z.string()
})

const ClientsArraySchema = z.array(clientSchema);

export const comboboxClientRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const comboboxListController = new ComboboxListController(clientRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/clients/combobox', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin', 'member'])],
        schema: {
            tags: ['Clients'],
            summary: 'Combobox Clients',
            response: {
                200: z.object({
                    data: ClientsArraySchema,
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, comboboxListController.handle.bind(comboboxListController))
}