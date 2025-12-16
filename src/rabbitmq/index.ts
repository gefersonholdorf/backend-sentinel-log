import { connect, type Connection, type Channel, type Message } from "amqplib";

export class RabbitMQServer {
  private conn!: Connection;
  private channel!: Channel;

  constructor(
    private readonly uri: string,
    private readonly exchange: string,
    private readonly exchangeType: "direct" | "topic" | "fanout" | "headers"
  ) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();

    await this.channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    console.log(`RabbitMQ is running and exchange "${this.exchange}" is ready`);
  }

  /**
   * Publica uma mensagem no exchange configurado
   */
  async publish<T extends object>(
    routingKey: string,
    data: T
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized. Call start() first.");
    }

    const ok = this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
        mandatory: true,
      }
    );

    if (!ok) {
      console.warn(
        `RabbitMQ publish buffer full for routingKey=${routingKey}`
      );
    }
  }

  /**
   * Cria fila, binding e começa o consumo
   */
  async consume(
    queue: string,
    routingKey: string,
    callback: (msg: Message) => Promise<void>
  ) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized. Call start() first.");
    }

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    await this.channel.bindQueue(queue, this.exchange, routingKey);

    return this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        await callback(msg);
        this.channel.ack(msg);
      } catch (error) {
        console.error("Error processing message from queue:", error);
        this.channel.nack(msg, false, false);
      }
    });
  }

  async close() {
    await this.channel?.close();
    await this.conn?.close();
  }
}