import { FastifyInstance } from 'fastify';
import { ExistingEntityError } from '../errors/existing-entity-error';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {

    console.log(error instanceof ExistingEntityError)

    if (error instanceof ExistingEntityError) {
        reply.status(409).send({ message: error.message });
    }

    reply.status(500).send({ message: 'Internal server error.' });
    });
}
