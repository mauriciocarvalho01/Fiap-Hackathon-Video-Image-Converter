import { logger } from '@/infra/helpers/logger';
import { CloudStorage } from '@/domain/contracts/gateways';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs from 'fs';

export class AWSS3 implements CloudStorage {
  private readonly s3Client: S3Client;

  constructor(private readonly options: CloudStorage.Options) {
    this.s3Client = new S3Client({
      region: this.options.region,
      credentials: this.options.credentials,
    });
  }

  /**
   * Upload a file to S3
   * @param key - The key (path) for the object in the bucket
   * @param body - The content of the file (Buffer, ReadableStream, or string)
   * @returns Promise with upload result
   */
  async upload({ key, fileDir }: CloudStorage.UploadOptions): Promise<void> {
    try {
      logger.log(`Uploading ${fileDir} for ${key}`);
      const fileContent = fs.readFileSync(fileDir);
      try {
        const command = new PutObjectCommand({
          Bucket: this.options.bucketName,
          Key: key,
          Body: fileContent,
          ACL: 'public-read', // Define o objeto como público
        });

        await this.s3Client.send(command);
        logger.log(`Uploaded ${fileDir} to S3 to ${key}`);
      } catch (error: CloudStorage.GenericType) {
        console.error(`Failed to upload ${key}:${error.message}`);
      }
    } catch (error: CloudStorage.GenericType)  {
      logger.error(`Error uploading ${key} to ${fileDir} ${error.message}`);
    }
  }

  /**
   * Download a file from S3
   * @param key - The key of the object to download
   * @returns Promise with the file content as a Buffer
   */
  async download({ key, outputDir }: CloudStorage.DownloadOptions): Promise<string> {
    logger.log(`[AWSS3] Downloading file ${key} to ${outputDir}`);

    const command = new GetObjectCommand({
      Bucket: this.options.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;

    const fileStream = fs.createWriteStream(outputDir);
    stream.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    return outputDir;
  }

  /**
   * Remove a file from S3
   * @param key - The key of the object to delete
   * @returns Promise<void>
   */
  async remove({ key }: CloudStorage.DeleteOptions): Promise<void> {
    try {
      logger.log(`[AWSS3] Removing file ${key} from S3`);

      const command = new DeleteObjectCommand({
        Bucket: this.options.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      logger.log(`[AWSS3] Successfully removed file ${key} from S3`);
    } catch (error: CloudStorage.GenericType)  {
      logger.error(`[AWSS3] Failed to remove file ${key}: ${error.message}`);
      throw new Error(`Failed to remove file ${key}: ${error.message}`);
    }
  }
}
