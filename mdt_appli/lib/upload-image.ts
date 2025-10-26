import { UploadResponseType } from "@/types/response/upload-response-type";
import axiosClient, { getData } from "./axios-client";

export async function uploadImage(file: File) {
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await getData(
            axiosClient.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        );

        if (res.errorMessage) {
            throw new Error("Error saving image");
        }

        const data = res.data as UploadResponseType;
        return data.url;
    }
    return null;
}
