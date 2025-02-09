import { downloadDependencies } from '@/main/config/dependencies';
import { setupMessageBrokerQueues } from '@/main/middlewares';
import { makeMessageBroker } from '@/main/factories/infra/message-broker/rabbitmq';
export const setupMiddlewares = async (): Promise<void> => {
  await downloadDependencies()
  await setupMessageBrokerQueues(makeMessageBroker())
};
