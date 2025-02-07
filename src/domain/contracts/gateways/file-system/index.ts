export interface FileSystem {
  zip: (fileOptions: FileSystem.FileOptions) => Promise<string>
  remove: (fileOptions: FileSystem.FileOptions) => Promise<void>
}


export namespace FileSystem {
  export type GenericType<T=any> = T
  export type FileOptions = {
    fileDir: string
  }
}
