import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const region = process.env.S3_REGION;
    this.bucket = process.env.S3_BUCKET || '';
    this.client = new S3Client({
      region,
      credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ? {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
      } : undefined
    });
  }

  async getSignedUploadUrl(key: string, contentType: string, expiresIn = 60 * 5) {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.client, cmd, { expiresIn });
    return url;
  }

  // Simple server-side upload helper (if you want to upload file buffer)
  async uploadBuffer(key: string, buffer: Buffer, contentType: string) {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: buffer, ContentType: contentType }));
    return `s3://${this.bucket}/${key}`;
  }
}
