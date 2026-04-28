import "dotenv/config";
import amqp from "amqplib";
import nodemailer from "nodemailer";
import ApplicationNotificationRepository from "./repositories/application-notification-repository.js";

const applicationNotificationRepository = new ApplicationNotificationRepository();

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

function createMailer() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

async function sendApplicationEmail(data) {
  const transporter = createMailer();

  const subject = `New application for ${data.job_title}`;
  const text = `
Hello ${data.owner_name},

A candidate has applied to your job posting.

Job title: ${data.job_title}
Company: ${data.company_name}

Applicant name: ${data.applicant_name}
Applicant email: ${data.applicant_email}
Application date: ${new Date(data.application_date).toISOString()}

Regards,
OpenJob System
  `.trim();

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: data.owner_email,
    subject,
    text,
  });
}

async function startConsumer() {
  const connection = await amqp.connect(getAmqpUrl());
  const channel = await connection.createChannel();

  const queue = "applications:created";
  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const payload = JSON.parse(message.content.toString());
      const applicationId = payload.application_id;

      if (!applicationId) {
        throw new Error("application_id is required");
      }

      const data = await applicationNotificationRepository.getByApplicationId(applicationId);

      if (!data) {
        throw new Error(`Application not found: ${applicationId}`);
      }

      await sendApplicationEmail(data);

      channel.ack(message);
      console.log(`Processed application ${applicationId}`);
    } catch (error) {
      console.error("Failed to process message:", error);
      channel.nack(message, false, false);
    }
  });
}

startConsumer().catch((error) => {
  console.error("Consumer failed to start:", error);
  process.exit(1);
});