export interface VideoConverter {
  convert(convertOptions: VideoConverter.ConvertVideoInput): Promise<VideoConverter.ConvertVideoOutput>;
}

export namespace VideoConverter {
  export type GenericType<T=any> = T

  export type ConvertVideoInput = {
    videoId: string
    videoType: string
  }

  export type ConvertVideoOutput = {
    status: string
    videoId: string
  }
}
