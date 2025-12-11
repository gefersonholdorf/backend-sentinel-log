import { FastifyInstance } from 'fastify';
import { ExistingEntityError } from '../errors/existing-entity-error';
import { CredentialInvalidError } from '../errors/credential-invalid-error';
import { EntityNotFoundError } from '../errors/entity-not-found-error';

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error, request, reply) => {

        if (error instanceof ExistingEntityError) {
            reply.status(409).send({ message: error.message });
        }

        if (error instanceof CredentialInvalidError) {
            reply.status(401).send({ message: error.message });
        }

        if (error instanceof EntityNotFoundError) {
            reply.status(404).send({ message: error.message });
        }

        reply.status(500).send({ message: 'Internal server error.' });
    });
}
