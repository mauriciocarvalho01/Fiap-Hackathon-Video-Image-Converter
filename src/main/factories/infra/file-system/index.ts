import { FileSystemManager } from '@/infra/file-system';


export const makeFileSystem = (): FileSystemManager  => {
  return new FileSystemManager()
}
