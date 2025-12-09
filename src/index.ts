import { env } from "./env";
import { server } from "./server";

const port = env.PORT

server.listen({
    port,
    host: '0.0.0.0'
}).then(() => {
    console.log(`SentinelLog API is running in port ${port}`)
    console.log(`SentinelLog Documentation is running in http://localhost:${port}/docs`)
})