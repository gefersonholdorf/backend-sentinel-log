import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from 'zod'
import { DrizzleClientRepository } from "../../databases/drizzle/repositories/drizzle-client-repository";
import { db } from "../../databases/drizzle/drizzle-client";
import { MongoLogRepository } from "../../databases/mongo/repositories/mongo-log-repository";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { DashboardController } from "../../controllers/dashboard/dashboard-controller";
import { isAuthenticate } from "../../middlewares/is-user-authenticate";

export const dashboardRoute: FastifyPluginCallbackZod = async (app) => {
    const clientRepository = new DrizzleClientRepository(db)
    const logRepository = new MongoLogRepository()
    const apiRepository = new DrizzleApiRepository(db)

    const dashboardController = new DashboardController(clientRepository, logRepository, apiRepository)

    app.get('/dashboard', {
        preHandler: [isAuthenticate(app)],
        schema: {
            summary: 'Get Dashboard Info',
            tags: ['Dashboard'],
            response: {
                200: z.object({
                    totalClients: z.number(),
                    totalApis: z.number(),
                    totalApisActive: z.number(),
                    totalApisInactive: z.number(),
                    totalLogsToday: z.number()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, dashboardController.handle.bind(dashboardController))
}