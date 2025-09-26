import Image from "next/image";
import {signIn} from "@/auth";

export default function Home() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("discord")
            }}
        >
            <button type="submit" className="btn btn-primary">Signin with Discord</button>
        </form>
    );
}
