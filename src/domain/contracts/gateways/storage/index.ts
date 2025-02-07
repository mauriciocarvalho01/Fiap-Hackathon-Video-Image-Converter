import { Readable } from 'stream';

export interface CloudStorage {
  upload: (options: CloudStorage.UploadOptions) => Promise<void>;
  download: (options: CloudStorage.DownloadOptions) => Promise<string>;
  remove: (options: CloudStorage.DeleteOptions) => Promise<void>
}

export namespace CloudStorage {
  export type GenericType<T=any> = T
  export type Options = {
    linkFilesUrl: string;
    bucketName: string;
    region: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
  };
  export type UploadOptions = {
    key: string;
    fileDir: string,
    bod?: Buffer | Readable | string;
    acl?:
      | 'private'
      | 'public-read'
      | 'public-read-write'
      | 'authenticated-read';
  };

  export type DownloadOptions = {
    key: string;
    outputDir: string
  };

  export type DeleteOptions = { key: string }
}
