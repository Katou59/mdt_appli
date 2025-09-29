export const config = {
    matcher: ["/police/:path*", "/api/:path*"], // tes routes protégées
    runtime: "nodejs",           // <-- force Node runtime
};

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {UserRepository} from "@/repositories/userRepository";
import {UserType} from "@/types/db/user";

export async function middleware(req: Request) {
    const session = await auth();
    if (!session?.user?.discordId) {
        return NextResponse.redirect("/");
    }

    const userDb: UserType | null = await UserRepository.get(session.user.discordId);
    if (!userDb || userDb.isDisable) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}
