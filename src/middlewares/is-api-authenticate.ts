import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function isApiAuthenticate(app: FastifyInstance) {
    return async(request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization

        if(!authHeader) {
            return reply.status(401).send({
                message: 'Token not provided.'
            })
        }

        const [, token] = authHeader.split(" ");

        try {
            const decode = await app.jwt.verify(token)

            const { clientId, apiId } = decode as { clientId: string, apiId: string }

            if(!clientId || !apiId) {
                return reply.status(401).send({
                    message: 'Token invalid.'
                })
            }

            request.api = {
                clientId: Number(clientId),
                apiId: Number(apiId)
            }

        } catch (error) {
            console.error(error)
            return reply.status(401).send({
                message: 'Token invalid.'
            })
        }
    }
}