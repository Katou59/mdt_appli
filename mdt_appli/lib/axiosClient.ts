import axios, { AxiosError, AxiosResponse } from "axios";

export const axiosClient = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
	withCredentials: true,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export async function getData<T = unknown>(
	request: Promise<AxiosResponse<T>>
): Promise<{ data?: T; status?: number; errorMessage?: string }> {
	try {
		const response = await request;
		return { data: response.data, status: response.status };
	} catch (e) {
		if (e instanceof AxiosError) {
			if (e.response?.status === 401) {
				return { status: 401, errorMessage: "Vous n'êtes pas autorisé" };
			}
			return { status: e.response?.status, errorMessage: e.message };
		}
		return { errorMessage: "Une erreur est survenue" };
	}
}

export default axiosClient;
