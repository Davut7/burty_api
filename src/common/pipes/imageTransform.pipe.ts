import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { MinioService } from '../../libs/minio/minio.service';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class ImageTransformer implements PipeTransform<Express.Multer.File> {
  constructor(private readonly minioService: MinioService) {}

  async transform(file: Express.Multer.File): Promise<ITransformedFile> {
    let transformedFile: ITransformedFile;
    if (!file.path || !file.destination) {
      throw new BadRequestException('Image not provided');
    }
    try {
      const uploadStream = createReadStream(file.path);

      await this.minioService.uploadFileStream(
        file.filename,
        uploadStream,
        file.size,
        file.mimetype,
      );

      transformedFile = {
        fileName: file.filename,
        originalName: file.originalname,
        filePath: await this.minioService.getFileUrl(file.filename),
        mimeType: file.mimetype,
        size: file.size.toString(),
        mediaType: MediaType.IMAGE,
      };

      await unlink(file.path);
      return transformedFile;
    } catch (err) {
      console.error(`Error processing file ${file.originalname}:`, err);
      await unlink(file.path);
      throw new InternalServerErrorException(
        'Failed to process some files. Please check server logs for details.',
      );
    }
  }
}
