"use client";

import AddImage from "@/components/add-image";
import Page from "@/components/page";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/alert-context";
import { uploadImage } from "@/lib/upload-image";
import Citizen from "@/types/class/Citizen";
import { CitizenToCreateType, CitizenToUpdateType, CitizenType } from "@/types/db/citizen";
import { MetadataType } from "@/types/utils/metadata";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AddCitizenForm from "../../add-citizen-form";

type Props = {
    citizen: CitizenType;
    metadata: MetadataType;
};

export default function UpdateCitizenClient({ citizen: citizenServer, metadata }: Props) {
    const citizen = new Citizen(citizenServer);
    const { setAlert } = useAlert();
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(citizen.photoUrl ?? null);

    async function onSubmit(value: CitizenToCreateType): Promise<boolean> {
        let photoUrl: string | null =
            citizen.photoUrl === image ? citizen.getPhotoIdFromUrl() : null;
        if (!photoUrl && image && imageFile) {
            photoUrl = await uploadImage(imageFile);
        }

        const citizenUpdated = {
            address: value.address,
            birthDate: value.birthDate,
            birthPlace: value.birthPlace,
            bloodType: { key: value.bloodTypeId },
            city: value.city,
            description: value.description,
            eyeColor: value.eyeColor,
            firstName: value.firstName,
            gender: { key: value.genderId },
            hairColor: value.hairColor,
            hasTattoo: value.hasTattoo,
            height: value.height,
            isWanted: value.isWanted,
            id: citizen.id,
            job: value.job,
            lastName: value.lastName,
            nationality: { key: value.nationalityId },
            origin: value.originId,
            phoneNumber: value.phoneNumber,
            status: { key: value.statusId },
            weight: value.weight,
            bloodTypeId: value.bloodTypeId,
            genderId: value.genderId,
            nationalityId: value.nationalityId,
            originId: value.originId,
            statusId: value.statusId,
            photoUrl: photoUrl,
        } as CitizenToUpdateType;

        const resultResponse = await getData<CitizenType>(
            axiosClient.put(`/citizens/${citizenUpdated.id}`, citizenUpdated)
        );

        if (resultResponse.errorMessage) {
            setAlert({
                title: "Erreur",
                description: resultResponse.errorMessage,
            });
            return false;
        }

        router.push(`/police/citizens/${citizenUpdated.id}`);
        toast.success("Utilisateur mis à jour");

        return true;
    }

    return (
        <Page title={`Modification de ${citizen.fullName}`}>
            <AddImage
                image={image}
                delete={() => {
                    setImageFile(null);
                    setImage(null);
                }}
                onPaste={(file) => {
                    setImageFile(file);
                    const url = URL.createObjectURL(file);
                    setImage(url);
                }}
            />
            <AddCitizenForm
                citizen={citizen}
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
                onSubmit={onSubmit}
                onCancel={() => {
                    router.back();
                }}
            />
        </Page>
    );
}
