import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { createUserRoute } from "./users/create-user-route";
import { healthRoute } from "./health/health-route";
import { loginRoute } from "./auth/login-route";

export const routes: FastifyPluginCallbackZod = (app) => {
    app.register(healthRoute)

    app.register(loginRoute)
    
    app.register(createUserRoute)
}