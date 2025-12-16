import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { routes } from "./routes/routes";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import { registerErrorHandler } from "./middlewares/error-handler";
import { RabbitMQServer } from "./rabbitmq";

export const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

registerErrorHandler(server)

server.register(fastifyCors, {
    origin: true
})

server.register(fastifySwagger, {
	openapi: {
		openapi: "3.0.0",
		info: {
			title: "Sentinel Log",
			description: "Official documentation for the Sentinel Log application.",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter your token.",
				},
			},
		},
		security: [],
	},
	transform: jsonSchemaTransform,
	transformObject: jsonSchemaTransformObject,
});

server.register(fastifyApiReference, {
	routePrefix: "/docs",
});

server.register(fastifyJwt, {
	secret: env.JWT_API_KEY,
})

export const rabbitMQClient = new RabbitMQServer(env.RABBITMQ_URL, 'sentinel.exchange', 'topic')

server.addHook("onReady", async() => {
	await rabbitMQClient.start()
})

server.register(routes, {prefix: 'api/v1/'})

