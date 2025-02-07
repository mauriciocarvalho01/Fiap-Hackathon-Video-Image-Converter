import { WhatsAppNotifier } from '@/domain/contracts/services/whatsapp-notifier';
import { env } from '@/main/config/env';
import { logger } from '@/infra/helpers/logger';
import { VideoConverter } from '@/domain/contracts/services/video-converter';
import { CloudStorage } from '@/domain/contracts/gateways/storage';
import { FileSystem } from '@/domain/contracts/gateways/file-system';

type VideoProcessor = VideoConverter.GenericType;

export class VideoConverterService implements VideoConverter {
  constructor(
    private readonly videoProcessor: VideoProcessor,
    private readonly storage: CloudStorage,
    private readonly fileSystem: FileSystem,
    private readonly whatsAppNotifier: WhatsAppNotifier
  ) {}

  // /convert
  async convert({
    videoId,
    videoType,
  }: VideoConverter.ConvertVideoInput): Promise<VideoConverter.ConvertVideoOutput> {
    const response = {
      status: 'pending',
      videoId,
    };
    const videoKey = `videos/${videoId}.${videoType}`;
    const videoPath = `${process.cwd()}/public/videos/${videoId}.${videoType}`;
    const imagePath = `${process.cwd()}/public/images/${videoId}`;
    try {
      const tempVideoPath = await this.storage.download({
        key: videoKey,
        outputDir: videoPath,
      });
      if (tempVideoPath) {
        logger.log('Video processing...');
        await this.videoProcessor.extractFrames({
          tempVideoPath,
          tempOutputDir: imagePath,
        });
        const outputFile = await this.fileSystem.zip({
          fileDir: imagePath,
        });
        await this.storage.upload({
          key: `images/${videoId}.zip`,
          fileDir: outputFile,
        });
        response.status = 'finished';
      }
    } catch (error: VideoConverter.GenericType) {
      console.log(error);
      response.status = 'error';
      logger.error(`Error on video conversion with videoId: ${videoId}`);
      await this.whatsAppNotifier.sendMessage({
        from: env.notifications.twilioFakeWhatsAppFromNumber,
        to: env.notifications.twilioFakeWhatsAppToNumber,
        message: `Error on video conversion with videoId: ${videoId} with message: ${error.message}`
      });

    } finally {
      await this.fileSystem.remove({ fileDir: videoPath });
      await this.fileSystem.remove({ fileDir: imagePath });
    }
    return response;
  }
}
