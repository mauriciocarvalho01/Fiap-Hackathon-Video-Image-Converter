import { makeVideoConverterService } from '@/main/factories/domain/services/video-converter-service';
import { VideoController } from '@/application/controllers';

export const makeVideoController = async (): Promise<VideoController> => {
  return new VideoController(await makeVideoConverterService());
};
