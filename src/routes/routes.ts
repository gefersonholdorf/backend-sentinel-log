import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { createUserRoute } from "./users/create-user-route";
import { healthRoute } from "./health/health-route";
import { loginRoute } from "./auth/login-route";
import { meRoute } from "./auth/me-route";
import { createClientRoute } from "./clients/create-client-route";
import { updateClientRoute } from "./clients/update-client-route";
import { inactiveClientRoute } from "./clients/inactive-client-route";
import { fetchClientsRoute } from "./clients/fetch-clients-route";

export const routes: FastifyPluginCallbackZod = (app) => {
    app.register(healthRoute)

    app.register(loginRoute)
    app.register(meRoute)
    
    app.register(createUserRoute)

    app.register(createClientRoute)
    app.register(updateClientRoute)
    app.register(inactiveClientRoute)
    app.register(fetchClientsRoute)
}