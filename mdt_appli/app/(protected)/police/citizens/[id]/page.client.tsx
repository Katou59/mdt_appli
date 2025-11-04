"use client";

import CitizenBlock from "@/components/citizen-block";
import Page from "@/components/page";
import ShowImageDialog from "@/components/show-image-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { booleanToString } from "@/lib/converters";
import Citizen from "@/types/class/Citizen";
import { CitizenType } from "@/types/commons/citizen";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    citizen: CitizenType;
};

export default function CitizenIdClient({ citizen: citizenServer }: Props) {
    const [citizen] = useState<Citizen>(new Citizen(citizenServer));
    const router = useRouter();

    return (
        <Page title={`Détails de ${citizen.fullName}`}>
            <div className="grid gap-5 w-full">
                <div className="flex justify-center">
                    <Avatar className="rounded-sm w-50 h-50">
                        {citizen.photoUrl && (
                            <ShowImageDialog url={citizen.photoUrl}>
                                <AvatarImage
                                    src={citizen.photoUrl ?? undefined}
                                    alt="Hallie Richards"
                                    className="rounded-sm"
                                />
                            </ShowImageDialog>
                        )}
                        <AvatarFallback className="text-6xl">
                            {citizen.firstName[0].toUpperCase()}
                            {citizen.lastName[0].toLocaleUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CitizenBlock
                    title="Identité"
                    items={[
                        { label: "Nom", value: citizen.lastName },
                        { label: "Prénom", value: citizen.firstName },
                        {
                            label: "Date de naissance",
                            value: citizen.birthDate
                                ? dayjs(citizen.birthDate).format("DD/MM/YYYY")
                                : undefined,
                        },
                        { label: "Lieu de naissance", value: citizen.birthPlace ?? undefined },
                        { label: "Nationalité", value: citizen.nationality?.value ?? undefined },
                        { label: "Sexe", value: citizen.gender?.value ?? undefined },
                        {
                            label: "Créé par",
                            value: `${citizen.createdBy.fullNameNumber} le ${dayjs(
                                citizen.createdAt
                            ).format("DD/MM/YYYY HH:mm:ss")}`,
                        },
                        {
                            label: "Modifié par",
                            value: `${citizen.updatedBy.fullNameNumber} le ${dayjs(
                                citizen.updatedAt
                            ).format("DD/MM/YYYY HH:mm:ss")}`,
                        },
                    ]}
                />
                <CitizenBlock
                    title="Caractéristiques physiques"
                    items={[
                        {
                            label: "Taille",
                            value: citizen.height ? `${citizen.height} cm` : undefined,
                        },
                        {
                            label: "Poids",
                            value: citizen.weight ? `${citizen.weight} kg` : undefined,
                        },
                        { label: "Couleur des yeux", value: citizen.eyeColor ?? undefined },
                        { label: "Couleur des cheveux", value: citizen.hairColor ?? undefined },
                        { label: "Groupe sanguin", value: citizen.bloodType?.value },
                        {
                            label: "Présence de tatouages",
                            value: booleanToString(citizen.hasTattoo),
                        },
                    ]}
                />
                <CitizenBlock
                    title="Informations de contact"
                    items={[
                        { label: "Adresse", value: citizen.address ?? undefined },
                        { label: "Ville", value: citizen.city ?? undefined },
                        { label: "Numéro de téléphone", value: citizen.phoneNumber ?? undefined },
                    ]}
                />

                <CitizenBlock
                    title="Autres"
                    items={[
                        { label: "Métier", value: citizen.job ?? undefined },
                        { label: "Est recherché", value: booleanToString(citizen.isWanted) },
                        { label: "Statut", value: citizen.status?.value },
                        {
                            label: "Informations complémentaires",
                            value: citizen.description ?? undefined,
                            colSpan: 2,
                        },
                    ]}
                />
                <div className="flex justify-center">
                    <Button
                        className="px-5"
                        variant={"default"}
                        onClick={() => router.push(`/police/citizens/${citizen.id}/update`)}>
                        Modifier
                    </Button>
                </div>
            </div>
        </Page>
    );
}
