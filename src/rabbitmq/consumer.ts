import { RabbitMQServer } from ".";
import { connectMongo } from "../databases/mongo/mongo-client";
import { MongoLogRepository } from "../databases/mongo/repositories/mongo-log-repository";
import { env } from "../env";

const logRepository = new MongoLogRepository()

async function bootstrap() {
  const rabbit = new RabbitMQServer(
    env.RABBITMQ_URL,
    "sentinel.exchange",
    "topic"
  );

  await connectMongo();

  await rabbit.start();

  await rabbit.consume(
    "logs.create",
    "*.logs",
    async (msg) => {
      const content = JSON.parse(msg.content.toString());
      console.log('CONSUMO INICIADO', content);

      await logRepository.create({...content})
    }
  );
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar worker:", err);
  process.exit(1);
});