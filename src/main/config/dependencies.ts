import { logger } from '@/infra/helpers';
import { makeStorage } from '@/main/factories/infra/storage/aws-s3';

export const downloadDependencies = async () => {
  try {
    const storage = makeStorage();
    await storage.download({
      key: 'ffmpeg/ffmpeg.exe',
      outputDir: `${process.cwd()}/libs/ffmpeg/ffmpeg.exe`,
    });
  } catch (error: any) {
    logger.error(`Can not find ffmpeg: ${error.message}`);
  }
};
