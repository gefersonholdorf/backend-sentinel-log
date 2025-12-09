import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const healthRoute: FastifyPluginCallbackZod = (app) => {
    app.get('/health', {
        schema: {
            tags: ['Health'],
            summary: 'Check Health of the System',
            response: {
                200: z.object({
                    status: z.string()
                }),
                500: z.object({
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        return reply.status(200).send({status: 'UP'})
    })
}