"use client";

import Page from "@/components/page";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/alert-context";
import Citizen from "@/types/class/Citizen";
import { CitizenToCreateType, CitizenToUpdateType, CitizenType } from "@/types/db/citizen";
import { MetadataType } from "@/types/utils/metadata";
import { useRouter } from "next/navigation";
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

    async function onSubmit(value: CitizenToCreateType): Promise<boolean> {
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
            photoUrl: value.photoUrl ?? citizen.photoUrl ?? null,
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
