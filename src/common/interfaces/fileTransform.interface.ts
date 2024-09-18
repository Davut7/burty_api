import { MediaType } from '@prisma/client';

export interface ITransformedFile {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: string;
  originalName: string;
  mediaType: MediaType;
}
