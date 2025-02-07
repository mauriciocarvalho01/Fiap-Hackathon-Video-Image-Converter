import {
  ConsumerError,
} from '@/application/errors';

export type Response<T = any> = {
  statusCode: string;
  data: T;
};

export const finished = <T = any>(data: T): Response<T> => ({
  statusCode: 'finished',
  data,
});

export const error = <T = any>(data: T): Response<T> => ({
  statusCode: 'error',
  data,
});

export const unexpectedError = (error: unknown): Response<Error> => ({
  statusCode: 'unexpected',
  data: new ConsumerError(error instanceof Error ? error : undefined),
});
