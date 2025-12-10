import type { FastifyRequest, FastifyReply } from "fastify";

export interface Controller<TRequest extends FastifyRequest = FastifyRequest> {
  handle(request: TRequest, reply: FastifyReply): Promise<any>;
}