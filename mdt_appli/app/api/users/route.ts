import {drizzle} from "drizzle-orm/node-postgres";
import {NextRequest, NextResponse} from "next/server";
import {UserToUpdateType, UserType} from "@/types/db/user";
import {auth} from "@/auth";
import {UserRepository} from "@/repositories/userRepository";
import {RoleType} from "@/types/enums/roleType";

const db = drizzle(process.env.DATABASE_URL!);

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if(!session?.user?.discordId) return NextResponse.json({ error: "Unauthorized" }, {status: 401});
        
        const userToAdd = await request.json() as UserToUpdateType;
        if(!userToAdd) return NextResponse.json({error: "Bad Request"}, {status: 400})
        
        const currentUser = await UserRepository.get(session.user.discordId);
        const isAdmin = currentUser?.role === RoleType.Admin;
        const isSelf = session.user.discordId === userToAdd.id;
        
        if (currentUser?.isDisable || (!isAdmin && !isSelf)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const userUpdated = await UserRepository.update(userToAdd);
        
        return NextResponse.json(userUpdated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 500});
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if(!session?.user?.discordId) return NextResponse.json({ error: "Unauthorized" }, {status: 401});
        const currentUser = await UserRepository.get(session.user.discordId);
        if(currentUser?.role != RoleType.Admin || currentUser.isDisable)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const users = await UserRepository.getList();
        
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({error: e}, {status: 500});
    }
}