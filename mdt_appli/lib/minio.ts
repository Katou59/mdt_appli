// lib/minio.ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: "http://localhost:9000",
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "admin123",
    },
    forcePathStyle: true, // obligatoire pour MinIO
});
