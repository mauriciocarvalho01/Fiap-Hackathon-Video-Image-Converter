import { makeWhatsAppNotifier } from '@/main/factories/infra/whatsapp/twilio';
import { makeHelpers } from '@/main/factories/infra/helpers';
import { makeStorage } from '@/main/factories/infra/storage/aws-s3';
import { VideoConverterService } from '@/domain/services/video-converter-service';
import { makeFileSystem } from '@/main/factories/infra/file-system';

export const makeVideoConverterService = async (): Promise<VideoConverterService> => {
  return new VideoConverterService(
    await makeHelpers(),
    makeStorage(),
    makeFileSystem(),
    makeWhatsAppNotifier()
  );
};
