"use client";

import AddImage from "@/components/add-image";
import Loader from "@/components/loader";
import Page from "@/components/page";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { useMetadata } from "@/lib/Contexts/MetadataContext";
import { CitizenToCreateType } from "@/types/db/citizen";
import { UploadResponseType } from "@/types/response/upload-response-type";
import React, { useState } from "react";
import { toast } from "sonner";
import AddCitizenForm from "./AddCitizenForm";

export default function AddCitizenClient() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const { setAlert } = useAlert();

    const { metadata } = useMetadata();

    if (!metadata) return <Loader />;

    const handlePaste = async (e: React.ClipboardEvent) => {
        const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
        if (!item) return;
        const file = item.getAsFile();
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <Page title="Ajouter un citoyen">
            <AddImage
                image={image}
                onPaste={handlePaste}
                delete={() => setImage(null)}
                title="Collez une image de profil"
            />
            <AddCitizenForm
                nationalities={metadata.nationalities.map((x) => ({
                    key: String(x.key),
                    value: x.value,
                }))}
                genders={metadata.genders.map((x) => ({ key: String(x.key), value: x.value }))}
                bloodTypes={metadata.bloodTypes.map((x) => ({
                    key: String(x.key),
                    value: x.value,
                }))}
                statuses={metadata.statuses.map((x) => ({
                    key: String(x.key),
                    value: x.value,
                }))}
                onSubmit={async (values: CitizenToCreateType): Promise<boolean> => {
                    let url: string | null = null;

                    if (imageFile) {
                        const formData = new FormData();
                        formData.append("file", imageFile);
                        const res = await getData(
                            axiosClient.post("/upload", formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                        );

                        if (res.errorMessage) {
                            setAlert({
                                title: "Erreur",
                                description: "Impossible de sauvegarder l'image",
                            });
                            return false;
                        }

                        const data = res.data as UploadResponseType;
                        url = data.url;
                    }

                    values.photoUrl = url;
                    const result = await getData(axiosClient.post("/citizens", values));

                    if (result.errorMessage) {
                        setAlert({ title: "Erreur", description: result.errorMessage });
                        return false;
                    }

                    toast.success("Citoyen créé");
                    setImageFile(null);
                    setImage(null);
                    return true;
                }}
            />
        </Page>
    );
}
