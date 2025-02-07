import { setupMessageBrokerQueues } from '@/main/middlewares';
import { makeMessageBroker } from '@/main/factories/infra/message-broker/rabbitmq';
export const setupMiddlewares = async (): Promise<void> => {
  await setupMessageBrokerQueues(makeMessageBroker())
};
