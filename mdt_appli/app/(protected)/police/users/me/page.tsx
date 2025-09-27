import { auth } from "@/auth";
import { cookies } from "next/headers";

export default async function Me() {
    const session = await auth();

    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/users/${session?.user?.discordId}`, {
            headers: {
                Cookie: (await cookies()).toString(),
            },
            cache: "no-store"
            }
    );
    
    const user = await res.json();
    
    return (
        <h1 className="text-3xl">Me</h1>
    )
} 