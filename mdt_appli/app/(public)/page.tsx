import {signIn} from "@/auth";
import Image from "next/image";

export default function PublicHome() {
    return (
        <div className="flex flex-row justify-center items-center h-full">
            <form
                action={async () => {
                    "use server"
                    await signIn("discord", {redirectTo: "/police/dashboard"})
                }}
            >
                <button type="submit" className="cursor-pointer">
                    <Image src="/logolspd.webp" alt="Logo LSPD" width={200} height={200}/>
                </button>
            </form>
        </div>
    )
}