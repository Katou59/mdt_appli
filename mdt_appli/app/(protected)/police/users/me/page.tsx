import {auth} from "@/auth";
import {createAxiosServer} from "@/lib/axios";

export default async function Me() {
    const session = await auth();

    const axiosServer = await createAxiosServer();
    const res = await axiosServer.get(`/users/${session?.user?.discordId}`);
    
    console.log('test', res.data);

    const user = await res.data;

    return (
        <h1 className="text-3xl">Me</h1>
    )
} 