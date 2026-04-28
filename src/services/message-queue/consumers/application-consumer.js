import "dotenv/config";
import amqp from "amqplib";
import nodemailer from "nodemailer";
import {Pool} from "pg";

const QUEUE_NAME = "applications:created";
const pool = new Pool();

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

function createMailTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

async function getNotificationData(applicationId) {
  const query = {
    text: `
      SELECT
        owner.email AS owner_email,
        owner.name AS owner_name,
        applicant.email AS applicant_email,
        applicant.name AS applicant_name,
        a.created_at AS application_date
      FROM applications a
      JOIN users applicant ON applicant.id = a.user_id
      JOIN jobs j ON j.id = a.job_id
      JOIN companies c ON c.id = j.company_id
      JOIN users owner ON owner.id = c.owner_user_id
      WHERE a.id = $1
      LIMIT 1
    `,
    values: [applicationId],
  };

  const result = await pool.query(query);
  return result.rows[0] || null;
}

async function processMessage(messageBody) {
  const { application_id: applicationId } = JSON.parse(messageBody);

  if (!applicationId) {
    throw new Error("Invalid message payload: application_id is required");
  }

  const data = await getNotificationData(applicationId);

  if (!data) {
    // Nothing to notify yet (e.g., owner relation missing); skip gracefully.
    return;
  }

  const transporter = createMailTransport();

  const readableDate = new Date(data.application_date).toISOString();
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data.owner_email,
    subject: "New Candidate Application",
    text: [
      `Hello ${data.owner_name},`,
      "",
      "A candidate has applied to your job posting.",
      `Applicant Email: ${data.applicant_email}`,
      `Applicant Name: ${data.applicant_name}`,
      `Application Date: ${readableDate}`,
    ].join("\n"),
  };

  await transporter.sendMail(mailOptions);
}

async function main() {
  const connection = await amqp.connect(getAmqpUrl());
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.prefetch(1);

  console.log(`[*] Waiting for messages in ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) {
      return;
    }

    try {
      await processMessage(msg.content.toString());
      channel.ack(msg);
    } catch (error) {
      console.error("[x] Failed to process message:", error);
      channel.nack(msg, false, false);
    }
  });
}

main().catch((error) => {
  console.error("Consumer startup error:", error);
  process.exit(1);
});

