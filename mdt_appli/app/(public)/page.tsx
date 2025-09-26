import {signIn} from "@/auth";

export default function PublicHome() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("discord")
            }}
        >
            <button type="submit">Signin with Discord</button>
        </form>
    )
}