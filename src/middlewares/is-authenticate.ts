import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function isAuthenticate(app: FastifyInstance) {
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

            const { id, role } = decode as { id: string, role: string}

            request.profile = {
                id: Number(id),
                role: role as 'super_admin' | 'admin' | 'member'
            }
            
        } catch (error) {
            console.error(error)
            return reply.status(401).send({
                message: 'Token invalid.'
            })
        }
    }
}