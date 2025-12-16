import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { FetchApisController } from "../../controllers/apis/fetch-apis-controller";
import { db } from "../../databases/drizzle/drizzle-client";
import { DrizzleApiRepository } from "../../databases/drizzle/repositories/drizzle-api-repository";
import { isAuthenticate } from "../../middlewares/is-authenticate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { apisPaginationParams } from "../../schemas/apis-schema";

const apiSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    clientId: z.number(),
    token: z.string(),
    expiresIn: z.date(),
    urlCallbackStatus: z.string()
})

const ApiArraySchema = z.array(apiSchema);

export const fetchApisRoute: FastifyPluginCallbackZod = (app) => {
    const apiRepository = new DrizzleApiRepository(db)
    const fetchClientController = new FetchApisController(apiRepository)

    app.withTypeProvider<ZodTypeProvider>().get('/apis', {
        preHandler: [isAuthenticate(app), isAuthorized(['super_admin', 'admin', 'member'])],
        schema: {
            tags: ['Api'],
            summary: 'Fetch Apis',
            querystring: apisPaginationParams,
            response: {
                200: z.object({
                    data: ApiArraySchema,
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