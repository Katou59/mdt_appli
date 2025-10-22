// lib/minio.ts
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
    endpoint: process.env.MINIO_URL,
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true, // obligatoire pour MinIO
});

export async function getSignedFileUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: process.env.MINIO_BUCKET, Key: key });
    return await getSignedUrl(s3, command, { expiresIn });
}
