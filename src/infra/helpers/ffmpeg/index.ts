import { logger } from '@/infra/helpers/logger';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs'

// // Configura os caminhos diretamente
// ffmpeg.setFfmpegPath(`${process.cwd()}/libs/ffmpeg/ffmpeg_7.1.orig`);
// ffmpeg.setFfprobePath(`${process.cwd()}/libs/ffmpeg/ffmpeg_7.1.orig`);

export const extractFrames = async ({
  tempVideoPath,
  tempOutputDir,
}: {
  tempVideoPath: string;
  tempOutputDir: string;
}): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true });
    }
    ffmpeg(tempVideoPath)
      .output(`${tempOutputDir}/frame-%04d.png`)
      .on('end', () => {
        logger.log(`Video output directory ${tempVideoPath}`)
        resolve()
      })
      .on('error', (error) => {
        console.log(error)
        reject(error)
      })
      .run();
  });
};
