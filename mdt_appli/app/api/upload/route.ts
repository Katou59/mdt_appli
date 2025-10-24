import { auth } from "@/auth";
import { s3 } from "@/lib/minio";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());

        const extension = file.name.split(".").pop();
        const min = 1_000_000_000;
        const max = 999_999_999_999;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;

        const fileName = `${Date.now()}${random}.${extension}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.MINIO_BUCKET,
                Key: fileName,
                Body: bytes,
                ContentType: file.type,
            })
        );

        return NextResponse.json(
            {
                url: `${fileName}`,
            },
            { status: HttpStatus.CREATED }
        );
    } catch (err) {
        return await nextResponseApiError(err, request, auth(), null);
    }
}
