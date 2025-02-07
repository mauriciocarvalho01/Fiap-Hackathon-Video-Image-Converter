import { VideoConverter } from '@/domain/contracts/services/video-converter';
import { VideoConverterService } from '@/domain/services/video-converter-service';
import { finished, error, unexpectedError, Response } from '@/application/helpers';

export class VideoController {
  constructor(
    private readonly videoConverterService: VideoConverterService,
  ) {}

  // POST /upload
  async handleImageConvertVideo(
    createVideoInput: VideoConverter.ConvertVideoInput
  ): Promise<Response<VideoConverter.ConvertVideoOutput | Error>> {
    try {
      const convertedVideo = await this.videoConverterService.convert(createVideoInput)
      if (convertedVideo.status === 'finished') return finished(convertedVideo)
      return error(convertedVideo)
    } catch (error: VideoConverter.GenericType) {
      return unexpectedError(error);
    }
  }
}
