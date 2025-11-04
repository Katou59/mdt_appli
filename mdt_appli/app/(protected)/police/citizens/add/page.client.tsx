"use client";

import AddImage from "@/components/add-image";
import Loader from "@/components/loader";
import Page from "@/components/page";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/alert-context";
import { useMetadata } from "@/lib/Contexts/metadata-context";
import { uploadImage } from "@/lib/upload-image";
import { CitizenToCreateType } from "@/types/commons/citizen";
import { useState } from "react";
import { toast } from "sonner";
import AddCitizenForm from "../add-citizen-form";

export default function AddCitizenClient() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const { setAlert } = useAlert();

    const { metadata } = useMetadata();

    if (!metadata) return <Loader />;

    return (
        <Page title="Ajouter un citoyen">
            <AddImage
                onPaste={(file) => {
                    setImageFile(file);
                    const url = URL.createObjectURL(file);
                    setImage(url);
                }}
                image={image}
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
                    values.photoUrl = imageFile ? await uploadImage(imageFile) : null;
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
