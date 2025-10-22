import { auth } from "@/auth";
import CitizenRepository from "@/repositories/citizenRepository";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import HistoryRepository from "@/repositories/historyRepository";
import { UserRepository } from "@/repositories/userRepository";
import { CitizenToCreateType } from "@/types/db/citizen";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const itemPerPage = Number(searchParams.get("itemPerPage"));
        const searchTerm = searchParams.get("searchTerm");

        if (isNaN(page) || isNaN(itemPerPage)) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const pager = await CitizenRepository.GetList(page, itemPerPage, searchTerm ?? undefined);

        return NextResponse.json(pager.toType());
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });

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
        const user = await UserRepository.Get(session!.user!.discordId!);

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
