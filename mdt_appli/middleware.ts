export const config = {
	matcher: ["/police/:path*", "/api/:path*"], // tes routes protégées
	runtime: "nodejs", // <-- force Node runtime
};

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/repositories/userRepository";
import { UserType } from "@/types/db/user";

const apiAdmins = [
	{ path: "/api/users", method: "GET" },
	{ path: "/api/ranks", method: "PUT" },
	{ path: "/api/ranks", method: "DELETE" },
];

export async function middleware(req: NextRequest) {
	const session = await auth();

	if (req.nextUrl.pathname.startsWith("/api/auth/callback")) return NextResponse.next();

	if (apiAdmins.some((x) => req.nextUrl.pathname.startsWith(x.path) && x.method === req.method)) {
		const user = await UserRepository.get(session!.user.discordId!);

		if (!user?.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!session?.user?.discordId) {
		return NextResponse.redirect("/");
	}

	const userDb: UserType | null = await UserRepository.get(session.user.discordId);
	if (!userDb || userDb.isDisable) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}
