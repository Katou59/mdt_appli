import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/minio";
import { HttpStatus } from "@/types/enums/httpStatus";

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
                Bucket: "mdt", // crée ce bucket dans MinIO
                Key: fileName,
                Body: bytes,
                ContentType: file.type,
            })
        );

        return NextResponse.json(
            {
                url: `${process.env.MINIO_URL}${fileName}`,
            },
            { status: HttpStatus.CREATED }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
    }
}
