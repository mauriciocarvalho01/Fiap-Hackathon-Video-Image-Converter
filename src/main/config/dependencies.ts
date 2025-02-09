import { logger } from '@/infra/helpers';
import { makeStorage } from '@/main/factories/infra/storage/aws-s3';
import fs from 'fs';
import path from 'path';
import tar from 'tar'; // Biblioteca para extrair arquivos tar
import os from 'os';

export const downloadDependencies = async () => {
  try {
    const storage = makeStorage();
    const outputPath = path.join(process.cwd(), 'libs/ffmpeg/ffmpeg_7.1.orig.tar.xz');
    const outputDir = path.dirname(outputPath);

    // 🔹 Garantir que a pasta exista
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Diretório criado: ${outputDir}`);
    }

    // Baixar o arquivo ffmpeg.tar.xz
    await storage.download({
      key: 'ffmpeg/ffmpeg_7.1.orig.tar.xz',  // Nome do arquivo a ser baixado
      outputDir: outputPath,
    });
    logger.info('Arquivo ffmpeg_7.1.orig.tar.xz baixado com sucesso.');

    // 🔹 Extrair o arquivo
    const extractedDir = path.join(outputDir, 'ffmpeg'); // Defina o diretório onde os arquivos extraídos serão colocados
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
      logger.info(`Diretório para extração criado: ${extractedDir}`);
    }

    // Extração do arquivo .tar.xz
    await tar.x({
      file: outputPath,
      cwd: extractedDir,  // Diretório onde os arquivos serão extraídos
      strict: true, // Para garantir que a extração aconteça com permissões apropriadas
    });

    logger.info('Arquivo extraído com sucesso.');

    // Remova o arquivo .tar.xz original, caso não seja mais necessário
    fs.unlinkSync(outputPath);
    logger.info('Arquivo .tar.xz removido após extração.');

  } catch (error: any) {
    logger.error(`Não foi possível encontrar ou extrair o ffmpeg: ${error.message}`);
  }
};
