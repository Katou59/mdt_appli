import CitizenRepository from "@/repositories/citizenRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const result = Number(searchParams.get("result"));
        const search = searchParams.get("search");
        
        if(isNaN(page) || isNaN(result)){
            return NextResponse.json({error: "Bad Request"}, {status: HttpStatus.BAD_REQUEST})
        }

        const pager = await CitizenRepository.GetList(page, result, search ?? undefined);

        return NextResponse.json(pager.toType());
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
