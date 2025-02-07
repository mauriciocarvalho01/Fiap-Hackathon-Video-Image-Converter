import { VideoConverter } from '@/domain/contracts/services/video-converter';
import { makeMessageBroker } from '@/main/factories/infra/message-broker/rabbitmq';
import { VideoController } from '@/application/controllers';
import { RequestHandler } from 'express';

type VideoAdapter = (controller: VideoController) => RequestHandler;
type GenericType<T = any> = T;

const makeResponseHandler = async (
  message: GenericType,
  statusCode: string,
  messageBroker: GenericType
) => {
  const isFinished = ['finished', 'error'].includes(statusCode);
  const videoImageConverterChannel = messageBroker.getChannel(
    'video-image-converter'
  );
  if (isFinished) {
    const videoImageStatusChannel =
      messageBroker.getChannel('video-image-status');
    await messageBroker.sendToQueue(videoImageStatusChannel, {
      queueName: 'video-image-status',
      message: message.payload,
    });
    await messageBroker.ack(videoImageConverterChannel, message.buffer);
    return;
  }
  await messageBroker.rejectAck(videoImageConverterChannel, message.buffer);
};

export const adaptRabbitMQImageConvertVideo: VideoAdapter =
  (controller) =>
  async ({ messages }: VideoConverter.GenericType) => {
    for (const message of messages) {
      const videoDto: VideoConverter.ConvertVideoInput = {
        videoId: message.payload.videoId,
        videoType: message.payload.videoType,
      };
      if (videoDto.videoId === undefined || videoDto.videoType === undefined) {
        await makeResponseHandler(message, 'error', makeMessageBroker());
        return;
      }
      const { statusCode, data } =
        await controller.handleImageConvertVideo(videoDto);
      message.payload = data;
      await makeResponseHandler(message, statusCode, makeMessageBroker());
    }
  };
