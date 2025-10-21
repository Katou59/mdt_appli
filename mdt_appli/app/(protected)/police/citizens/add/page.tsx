"use client";

import React, { useState } from "react";
import AddImage from "@/components/AddImage";
import axiosClient, { getData } from "@/lib/axiosClient";
import Loader from "@/components/Loader";
import AddCitizenForm from "./AddCitizenForm";
import { useMetadata } from "@/lib/Contexts/MetadataContext";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { CitizenToCreateType } from "@/types/db/citizen";
import { toast } from "sonner";
import { UploadResponseType } from "@/types/response/uploadResponseType";

export default function AddCitizen() {
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
        <>
            <h1 className="text-4xl font-bold text-primary text-center mb-4">Ajouter un citoyen</h1>
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
        </>
    );
}
