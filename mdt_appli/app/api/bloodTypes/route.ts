import BloodTypeRepository from "@/repositories/bloodTypeRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json(await BloodTypeRepository.getList(), { status: HttpStatus.OK });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: HttpStatus.BAD_REQUEST });
    }
}