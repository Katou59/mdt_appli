import {NextRequest, NextResponse} from "next/server";
import {UserToUpdateType} from "@/types/db/user";
import {auth} from "@/auth";
import {UserRepository} from "@/repositories/userRepository";


export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const userToAddRequest = await request.json() as UserToUpdateType;
        if(!userToAddRequest?.id) return NextResponse.json({error: "Bad Request"}, {status: 400})
        
        const userToAdd = await UserRepository.get(userToAddRequest.id);
        if(!userToAdd?.id) return NextResponse.json({error: "Bad Request"}, {status: 400})
        
        userToAdd.update(userToAddRequest);
        
        const currentUser = await UserRepository.get(session!.user.discordId!);
        const isSelf = session!.user.discordId === userToAdd.id;
        
        if (currentUser?.isDisable || (!currentUser?.isAdmin && !isSelf)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const userUpdated = await UserRepository.update(userToAdd);
        
        return NextResponse.json(userUpdated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 500});
    }
}

export async function GET() {
    try {
        const session = await auth();
        const currentUser = await UserRepository.get(session!.user.discordId!);

        const users = await UserRepository.getList();
        
        if(!currentUser!.isAdmin){
            users?.forEach((user) => {
                user.email = null
            })
        }
        
        return NextResponse.json(users);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 500});
    }
}