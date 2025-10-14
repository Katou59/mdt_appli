import GenderRepository from "@/repositories/genderRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json(await GenderRepository.getList(), { status: HttpStatus.OK });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json(
                { error: error.message },
                { status: HttpStatus.INTERNAL_SERVER_ERROR }
            );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
