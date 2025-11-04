import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import UserService from "@/services/user-service";
import { UserToCreateType } from "@/types/commons/user";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const itemPerPage = Number(searchParams.get("itemPerPage"));
        const searchTerm = searchParams.get("searchTerm") ?? undefined;
        const isDisable =
            searchParams.get("isDisable") === "true"
                ? true
                : searchParams.get("isDisable") === "false"
                ? false
                : undefined;

        const filters = {
            isDisable,
            jobId: searchParams.get("jobId") ? Number(searchParams.get("jobId")) : undefined,
            rankId: searchParams.get("rankId") ? Number(searchParams.get("rankId")) : undefined,
            roleId: searchParams.get("roleId") ? Number(searchParams.get("roleId")) : undefined,
            searchTerm,
        };

        if (!page || !itemPerPage || isNaN(page) || isNaN(itemPerPage)) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const userService = await UserService.create(session.user.discordId);
        const pager = await userService.getList(page, itemPerPage, filters);

        return NextResponse.json(pager);
    } catch (error) {
        return await nextResponseApiError(error, request, auth(), null);
    }
}

export async function POST(request: NextRequest) {
    let body = null;
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        body = (await request.json()) as UserToCreateType;
        const userService = await UserService.create(session.user.discordId);

        const userCreated = await userService.add(body);

        return NextResponse.json(userCreated.toType(), { status: HttpStatus.CREATED });
    } catch (error) {
        return await nextResponseApiError(error, request, auth(), body);
    }
}
