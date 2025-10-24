import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import CitizenService from "@/services/citizen-service";
import UserService from "@/services/user-service";
import { CitizenToCreateType } from "@/types/db/citizen";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const itemPerPage = Number(searchParams.get("itemPerPage"));
        const searchTerm = searchParams.get("searchTerm");

        if (isNaN(page) || isNaN(itemPerPage)) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const citizenService = await CitizenService.create(session.user.discordId);
        const citizenPager = await citizenService.getList(page, itemPerPage, searchTerm);

        return NextResponse.json(citizenPager.toType());
    } catch (error) {
        return await nextResponseApiError(error, request, auth(), null);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const userService = await UserService.create(session.user.discordId);
        const user = await userService.get(session!.user!.discordId!);

        if (!user) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const citizenToAddRequest = (await request.json()) as CitizenToCreateType;
        const citizenService = await CitizenService.create(session.user.discordId);
        const citizenCreated = await citizenService.add(citizenToAddRequest);

        return NextResponse.json(citizenCreated.toType(), { status: HttpStatus.CREATED });
    } catch (error) {
        return await nextResponseApiError(error, request, auth(), null);
    }
}
