import axios from "axios";
import { cookies } from "next/headers";

export async function createAxiosServer() {
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    
    return axios.create({
        baseURL: `${base}/api`,
        headers: {
            Cookie: (await cookies()).toString(),
            "Content-Type": "application/json",
        },
        timeout: 10000,
    });
}