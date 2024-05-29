import {Kafka} from 'kafkajs';
import nodemailer from 'nodemailer';

// Initialize Kafka consumer
const kafka = new Kafka({
  brokers: ['52.72.198.36:9092', '54.224.217.168:9092', '44.208.221.62:9092'],
});
const consumer = kafka.consumer({groupId: 'edis-crm-service'});

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'adityaajmera0604@gmail.com',
    pass: 'ydvd szoo dbsg mwwe',
  },
});

async function run() {
  await consumer.connect();
  await consumer.subscribe({
    topic: 'adityaaj.customer.evt',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      console.log(`Sending on ${topic}/${partition}`);
      console.log(JSON.stringify(message));
      const {userId, name} = JSON.parse(message.value!.toString());

      // Send email
      await transporter.sendMail({
        from: 'adityaajmera0604@gmail.com',
        to: userId,
        subject: 'Activate your book store account',
        text: `Dear ${name},\nWelcome to the Book store created by adityaaj.
        \nExceptionally this time we won't ask you to click a link to activate your account.`,
      });

      console.log(`Sent email to ${userId}`);
    },
  });
}

export default run;
