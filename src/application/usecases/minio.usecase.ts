import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor(configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: configService.get('MINIO_END_POINT'), 
      port: configService.get('MINIO_PORT'),                     
      useSSL: false,                  
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });
  }

  async uploadFile(bucketName: string, objectName: string, filePath: string): Promise<string> {
    await this.minioClient.fPutObject(bucketName, objectName, filePath, {
      'Content-Type': 'application/octet-stream',
    });
    return `File uploaded successfully to ${bucketName}/${objectName}`;
  }

  async getFileUrl(bucketName: string, objectName: string): Promise<string> {
    return await this.minioClient.presignedGetObject(bucketName, objectName);
  }

  async createBucket(bucketName: string): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
  }
}
