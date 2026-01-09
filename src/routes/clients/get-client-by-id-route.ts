import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { FetchClientController } from "../../controllers/clients/fetch-clients-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { getClientByIdParam } from "../../schemas/clients-schema";
import { GetClientByIdController } from "../../controllers/clients/get-client-by-id-controller";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { MongoLogRepository } from "../../databases/mongo/repositories/mongo-log-repository";

const getClientByIdSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    apis: z.array(z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        clientId: z.number(),
        token: z.string().nullable(),
        expiresIn: z.date(),
        urlCallbackStatus: z.string(),
    }))
})

const GetClientByIdSchema = z.array(getClientByIdSchema);

export const getClientByIdRoute: FastifyPluginCallbackZod = (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const apiRepository = new DrizzleApiRepository(db)
    const logRepository = new MongoLogRepository()
    const getClientIdController = new GetClientByIdController(clientRepository, apiRepository, logRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/clients/:id', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin', 'member'])],
        schema: {
            tags: ['Clients'],
            summary: 'Get Client By Id',
            params: getClientByIdParam,
            response: {
                200: z.object({
                    client: getClientByIdSchema,
                    totalApis: z.number(),
                    totalApisActive: z.number(),
                    totalApisInactive: z.number(),
                    totalLogs: z.number(),
                    volumeLogsTodayData: z.array(z.object({
                        hour: z.string(),
                        quantity: z.number()
                    })),
                    logsByApi: z.array(z.object({
                        apis: z.string(),
                        quantity: z.number()
                    }))
                }),
                404: z.object({
                    message: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, getClientIdController.handle.bind(getClientIdController))
}