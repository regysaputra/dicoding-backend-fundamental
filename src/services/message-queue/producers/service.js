import amqp from "amqplib";

function getAmqpUrl() {
  if (process.env.AMQP_URL) {
    return process.env.AMQP_URL;
  }

  const host = process.env.RABBITMQ_HOST;
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER;
  const password = process.env.RABBITMQ_PASSWORD;

  if (!host) {
    throw new Error("RABBITMQ_HOST is not defined");
  }

  if (!user || !password) {
    return `amqp://${host}:${port}`;
  }

  return `amqp://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}`;
}

const Service = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(getAmqpUrl());

    try {
      const channel = await connection.createChannel();

      try {
        await channel.assertQueue(queue, {
          durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(message), {
          persistent: true,
        });
      } finally {
        await channel.close();
      }
    } finally {
      await connection.close();
    }
  },
};

export default Service;