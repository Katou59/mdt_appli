import {drizzle} from "drizzle-orm/node-postgres";
import {NextRequest, NextResponse} from "next/server";
import {UserRepository} from "@/repositories/userRepository";
import {auth} from "@/auth";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        
        if(!session?.user?.discordId) return NextResponse.json({ error: "Unauthorized" }, {status: 401});
        
        const {id} = await context.params;

        const userResult = await UserRepository.get(id);

        if (!userResult) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json(userResult);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 500});
    }
}