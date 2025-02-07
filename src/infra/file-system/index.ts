import { logger } from '@/infra/helpers';
import { FileSystem } from '@/domain/contracts/gateways/file-system';

import path from 'path';
import fs from 'fs';
import asyncFs from 'fs/promises';
import archiver from 'archiver';

export class FileSystemManager implements FileSystem {
  async zip({ fileDir }: FileSystem.FileOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(`${fileDir}.zip`);
      const archive = archiver('zip', { zlib: { level: 9 } }); // Nível de compressão ajustável

      output.on('close', () => {
        logger.log(`${archive.pointer()} total bytes`);
        logger.log(
          'Archive has been finalized and the output file descriptor has closed.'
        );
        resolve(`${fileDir}.zip`);
      });

      output.on('error', (err) => {
        logger.error(`Stream error: ${err.message}`);
        reject(err);
      });

      archive.on('error', (err) => {
        logger.error(`Archiver error: ${err.message}`);
        reject(err);
      });

      archive.pipe(output);

      try {
        // Adiciona arquivos/diretórios ao arquivo ZIP
        archive.directory(fileDir, false);
        archive.finalize();
      } catch (error: FileSystem.GenericType) {
        logger.error(
          `Error while adding files to the archive: ${error.message}`
        );
        reject(error);
      }
    });
  }

  async remove({ fileDir }: { fileDir: string }): Promise<void> {
    try {
      const stats = await asyncFs.lstat(fileDir);

      if (stats.isDirectory()) {
        // Lê o conteúdo do diretório
        const files = await asyncFs.readdir(fileDir);

        // Remove cada arquivo/diretório dentro do diretório
        await Promise.all(
          files.map(async (file) => {
            const fullPath = path.join(fileDir, file);
            await this.remove({ fileDir: fullPath });
          })
        );

        // Remove o diretório após esvaziá-lo
        await asyncFs.rmdir(fileDir);
      } else {
        // Remove o arquivo
        await asyncFs.unlink(fileDir);
      }
      // logger.log(`Removed ${fileDir}`)
    } catch (error: any) {
      throw new Error(`Failed to remove ${fileDir}: ${error.message}`);
    }
  }
}
