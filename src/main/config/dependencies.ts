import { logger } from '@/infra/helpers';
import { makeStorage } from '@/main/factories/infra/storage/aws-s3';
import fs from 'fs';
import path from 'path';

export const downloadDependencies = async () => {
  try {
    const storage = makeStorage();
    const outputPath = path.join(process.cwd(), 'libs/ffmpeg/ffmpeg.exe');
    const outputDir = path.dirname(outputPath);

    // 🔹 Garantir que a pasta exista
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Diretório criado: ${outputDir}`);
    }

    await storage.download({
      key: 'ffmpeg/ffmpeg.exe',
      outputDir: outputPath,
    });
  } catch (error: any) {
    logger.error(`Can not find ffmpeg: ${error.message}`);
  }
};
