import { connectMongo } from "./databases/mongo/mongo-client";
import { env } from "./env";
import { server } from "./server";

const port = env.PORT

async function bootstrap() {
    await connectMongo();
    server.listen({
        port,
        host: '0.0.0.0'
}).then(() => {
    console.log(`SentinelLog API is running in port ${port}`)
    console.log(`SentinelLog Documentation is running in http://localhost:${port}/docs`)
})
}

bootstrap()

