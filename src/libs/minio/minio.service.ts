import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_HOST'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: Boolean(this.configService.get('MINIO_USE_SSL')),
      accessKey: this.configService.get('MINIO_ROOT_USER'),
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD'),
    });

    this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
  }

  async onModuleInit() {
    try {
      this.logger.log(
        `Connecting to MinIO at ${this.configService.getOrThrow('MINIO_ENDPOINT')}:${this.configService.getOrThrow('MINIO_PORT')}`,
      );
      await this.createBucketIfNotExists();
    } catch (error: any) {
      this.logger.error(`Failed to create bucket on startup: ${error.message}`);
    }
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);

    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, '');
      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(publicPolicy),
      );
      this.logger.log(`Created bucket: ${this.bucketName}`);
    }
  }

  async uploadFile(fileName: string, filePath: string, mimeType: string) {
    const metaData = {
      'Content-Type': mimeType,
    };

    const uploadedFile = await this.minioClient.fPutObject(
      this.bucketName,
      fileName,
      filePath,
      metaData,
    );

    this.logger.log(`Uploaded file: ${fileName}`);
    return uploadedFile;
  }

  async uploadFileStream(
    fileName: string,
    fileStream: Readable,
    fileSize: number,
    mimeType: string,
  ) {
    const metaData = {
      'Content-Type': mimeType,
    };
    const uploadedFile = await this.minioClient.putObject(
      this.bucketName,
      fileName,
      fileStream,
      fileSize,
      metaData,
    );

    this.logger.log(`Uploaded file: ${fileName}`);
    return uploadedFile;
  }

  async getFileUrl(fileName: string) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );

    this.logger.log(`Retrieved file URL: ${url}`);

    if (process.env.NODE_ENV === 'dev') {
      return url;
    }

    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    const host = this.configService.getOrThrow<string>('MINIO_HOST');

    return url.replace(endpoint, host);
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);

    this.logger.log(`Deleted file: ${fileName}`);
  }

  async deleteFiles(fileNames: string[]) {
    try {
      this.minioClient.removeObjects(this.bucketName, fileNames);
      this.logger.log('Objects deleted successfully');
    } catch (err) {
      this.logger.error(`Error occurred while deleting files: ${err}`);
    }
  }

  async getFileStream(fileName: string) {
    try {
      const stream = await this.minioClient.getObject(
        this.bucketName,
        fileName,
      );

      this.logger.log(`Retrieved file stream: ${fileName}`);
      return stream;
    } catch (err) {
      console.error('Error occurred while downloading file:', err);
      this.logger.error(`Error occurred while downloading file: ${err}`);
    }
  }
}
