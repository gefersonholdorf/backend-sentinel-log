import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { createUserRoute } from "./users/create-user-route";
import { healthRoute } from "./health/health-route";

export const routes: FastifyPluginCallbackZod = (app) => {
    app.register(healthRoute)
    
    app.register(createUserRoute)
}