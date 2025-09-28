import {drizzle} from "drizzle-orm/node-postgres";
import {NextRequest, NextResponse} from "next/server";
import {UserType} from "@/types/db/user";
import {auth} from "@/auth";
import {UserRepository} from "@/repositories/userRepository";

const db = drizzle(process.env.DATABASE_URL!);

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.discordId) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        
        const userToAdd = await request.json();
        
        if(!userToAdd) return NextResponse.json({error: "Bad Request"}, {status: 400})
        
        const userUpdated = await UserRepository.update(userToAdd);
        
        return NextResponse.json(userUpdated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 500});
    }
}