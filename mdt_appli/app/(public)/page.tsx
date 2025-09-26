import {signIn} from "@/auth";

export default function PublicHome() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("discord", {redirectTo: "/police/dashboard"})
            }}
        >
            <button type="submit" className="btn btn-primary rounded-xl">Se connecter avec discord</button>
        </form>
    )
}