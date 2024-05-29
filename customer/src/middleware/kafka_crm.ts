import {Kafka} from 'kafkajs';

const kafka = new Kafka({
  brokers: ['52.72.198.36:9092', '54.224.217.168:9092', '44.208.221.62:9092'],
});
const producer = kafka.producer();

const callKafkaMiddleware = async (customerObj: Object) => {
  await producer.connect();
  await producer.send({
    topic: 'adityaaj.customer.evt',
    messages: [
      {
        value: JSON.stringify(customerObj),
      },
    ],
  });
  await producer.disconnect();
};

export default callKafkaMiddleware;
