"use client";

import CitizenBlock from "@/components/citizen-block";
import Page from "@/components/page";
import { booleanToString } from "@/lib/converters";
import Citizen from "@/types/class/Citizen";
import { CitizenType } from "@/types/db/citizen";
import dayjs from "dayjs";
import { useState } from "react";

type Props = {
    citizen: CitizenType;
};

const items = [
    {
        id: "identity",
        title: "Identité",
        items: [
            { id: "lastName", label: "Nom" },
            { id: "firstName", label: "Prénom" },
            { id: "birthDate", label: "Date de naissance" },
            { id: "birthPlace", label: "Lieu de naissance" },
            { id: "origin", label: "Nationalité" },
            { id: "gender", label: "Sexe" },
        ],
    },
    {
        id: "physic",
        title: "Caractéristiques physiques",
        items: [
            { id: "height", label: "Taille (cm)" },
            { id: "weight", label: "Poids (kg)" },
            { id: "eyeColor", label: "Couleur des yeux" },
            { id: "hairColor", label: "Couleur des cheveux" },
            { id: "bloodType", label: "Groupe sanguin" },
            { id: "hasTattoo", label: "Présence de tatouages" },
        ],
    },
    {
        id: "contact",
        title: "Informations de contact",
        items: [
            { id: "address", label: "Adresse" },
            { id: "city", label: "Ville" },
            { id: "phoneNumber", label: "Numéro de téléphone" },
        ],
    },
    {
        id: "other",
        title: "Autres",
        items: [
            { id: "job", label: "Métier" },
            { id: "isWanted", label: "Est recherché" },
            { id: "status", label: "Statut" },
            { id: "description", label: "Informations complémentaires" },
        ],
    },
];

export default function CitizenIdClient({ citizen: citizenServer }: Props) {
    const [citizen] = useState<Citizen>(new Citizen(citizenServer));
    console.log(citizen);
    return (
        <Page title={`Détails de ${citizen.fullName}`}>
            <div className="grid gap-5 w-full">
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
            </div>
        </Page>
    );
}
