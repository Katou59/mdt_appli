import { NextRequest, NextResponse } from "next/server";
import { UserToCreateType, UserToUpdateType } from "@/types/db/user";
import { auth } from "@/auth";
import { UserRepository } from "@/repositories/userRepository";
import Rank from "@/types/class/Rank";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        const currentUser = await UserRepository.get(session!.user.discordId!);

        const userToAddRequest = (await request.json()) as UserToUpdateType;
        if (!userToAddRequest?.id)
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userToUpdate = await UserRepository.get(userToAddRequest.id);
        if (!userToUpdate?.id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        userToUpdate.update(userToAddRequest);
        if (currentUser?.isAdmin && userToAddRequest !== undefined) {
            userToUpdate.rank = new Rank(userToAddRequest.rank);
        }

        const isSelf = session!.user.discordId === userToUpdate.id;

        if (currentUser?.isDisable || (!currentUser?.isAdmin && !isSelf)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await UserRepository.update(userToUpdate);

        const userUpdated = await UserRepository.get(userToUpdate.id);

        return NextResponse.json(userUpdated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await auth();
        const currentUser = await UserRepository.get(session!.user.discordId!);

        const users = await UserRepository.getList();

        if (!currentUser!.isAdmin) {
            users?.forEach((user) => {
                user.email = null;
            });
        }

        return NextResponse.json(users);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userToAddRequest = (await request.json()) as UserToCreateType;
        await UserRepository.add(userToAddRequest);

        return NextResponse.json((await UserRepository.get(userToAddRequest.id))?.toUserType());
    } catch (e) {
        console.log(e);
        if (e instanceof Error) {
            const pgError = e.cause as { code?: string; detail?: string; message?: string };

            if (pgError.code === "23505") {
                // 23505 = unique_violation (duplicate key)
                return NextResponse.json(
                    { error: "A user with this ID already exists." },
                    { status: 409 }
                );
            }
        }
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
