import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;