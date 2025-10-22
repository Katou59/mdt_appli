import { auth, signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function PublicHome({}: { searchParams?: { error: string } }) {
    const session = await auth();

    return (
        <>
            <div className="flex flex-row justify-center items-center h-full">
                {session?.user ? (
                    <Link href="/police/dashboard">
                        <Image src="/logolspd.webp" alt="Logo LSPD" width={200} height={200} />
                    </Link>
                ) : (
                    <form
                        action={async () => {
                            "use server";
                            await signIn("discord", { redirectTo: "/police/dashboard" });
                        }}
                    >
                        <button type="submit" className="cursor-pointer">
                            <Image src="/logolspd.webp" alt="Logo LSPD" width={200} height={200} />
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
