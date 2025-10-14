import { auth } from "@/auth";
import CitizenRepository from "@/repositories/citizenRepository";
import HistoryRepository from "@/repositories/historyRepository";
import { UserRepository } from "@/repositories/userRepository";
import { CitizenToCreateType } from "@/types/db/citizen";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const result = Number(searchParams.get("result"));
        const search = searchParams.get("search");

        if (isNaN(page) || isNaN(result)) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const pager = await CitizenRepository.GetList(page, result, search ?? undefined);

        return NextResponse.json(pager.toType());
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

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const user = await UserRepository.get(session!.user!.discordId!);

        if (!user) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const citizenToAddRequest = (await request.json()) as CitizenToCreateType;
        const newCitizenId = await CitizenRepository.Add(citizenToAddRequest, user);

        HistoryRepository.Add({
            action: "create",
            entityId: newCitizenId,
            entityType: "citizen",
            newData: await CitizenRepository.Get(newCitizenId),
            oldData: null,
            userId: session!.user!.discordId!,
        });

        return NextResponse.json({ id: newCitizenId }, { status: HttpStatus.CREATED });
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
