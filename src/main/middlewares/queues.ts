import { makeVideoController } from '@/main/factories/application/controllers';
import { adaptRabbitMQImageConvertVideo } from '@/main/adapters/rabbitmq/video-status-consumer';
import { MessageBroker } from '@/domain/contracts/gateways';

export const setupMessageBrokerQueues = async (messageBroker: MessageBroker): Promise<void> => {
  await messageBroker.createChannel({
    channelName: 'video-image-converter',
    queueName: 'video-image-converter',
    arguments: {
      durable: true
    }
  }).then(() => void 0)

  await messageBroker.createChannel({
    channelName: 'video-image-status',
    queueName: 'video-image-status',
    arguments: {
      durable: true
    }
  }).then(() => void 0)

  const consumerOptions = {
    channel: messageBroker.getChannel('video-image-converter'),
    queueName: 'video-image-converter',
    queuePrefetch: 1,
    messages: [],
    performOptions: {
      mode: 'normal'
    }
  }
  await messageBroker.consumeQueue(consumerOptions,  adaptRabbitMQImageConvertVideo(await makeVideoController()))
};

