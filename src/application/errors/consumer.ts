import { logger } from '@/infra/helpers';
export class ConsumerError extends Error {
  constructor(error?: Error) {
    super('Consumer failed. Message cannot be processed');
    this.name = 'ConsumerError';
    this.stack = error?.stack;
    logger.error(`[${this.name}] ${error?.message}`);
  }
}
