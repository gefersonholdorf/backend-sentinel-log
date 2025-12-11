import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { createUserRoute } from "./users/create-user-route";
import { healthRoute } from "./health/health-route";
import { loginRoute } from "./auth/login-route";
import { meRoute } from "./auth/me-route";

export const routes: FastifyPluginCallbackZod = (app) => {
    app.register(healthRoute)

    app.register(loginRoute)
    app.register(meRoute)
    
    app.register(createUserRoute)
}