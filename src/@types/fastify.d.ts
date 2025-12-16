import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		profile: {
			id: number;
			role: 'super_admin' | 'admin' | 'member';
			clientId: number | null;
		};
	}
}