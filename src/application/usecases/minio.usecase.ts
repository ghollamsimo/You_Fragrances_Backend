import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: 'http://127.0.0.1', 
      port: 9000,                     
      useSSL: false,                  
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
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
