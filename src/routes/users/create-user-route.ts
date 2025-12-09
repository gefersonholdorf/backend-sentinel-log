import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
    app.post('/users', {
        schema: {
            tags: ['Users'],
            summary: 'Create a new User'
        }
    }, async (request, reply) => {
        return reply.status(201).send({message: 'OK'})
    })
}