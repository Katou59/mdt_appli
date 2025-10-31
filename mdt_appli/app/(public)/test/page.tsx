import { auth } from "@/auth";
import MetadataService from "@/services/metadata-service";

export default async function App() {
    const session = await auth();
    console.log(session);
    const metadataService = await MetadataService.create(session!.user.discordId!);
    const metadata = await metadataService.get();
    console.log(metadata);
    return (
        <div className="h-[100vh] w-[100vw] bg-cyan-500 p-1 overflow-hidden flex justify-center items-center">
            test{" "}
        </div>
    );
}
