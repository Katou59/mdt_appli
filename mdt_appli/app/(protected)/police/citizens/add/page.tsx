"use client";

import React, { FormEvent, useEffect, useState } from "react";
import AddImage from "@/components/AddImage";
import axiosClient, { getData } from "@/lib/axiosClient";
import { KeyValueType } from "@/types/utils/keyValue";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import InputWithLabel from "@/components/InputWithLabel";
import Select from "@/components/Select";
import CheckBox from "@/components/CheckBox";
import Textarea from "@/components/Textarea";
import { CitizenToCreateType, CitizenType } from "@/types/db/citizen";
import Citizen from "@/types/class/Citizen";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/supabaseClient";
import { useToast } from "@/lib/Contexts/ToastContext";

type Lists = {
    genders: KeyValueType<number, string>[];
    bloodTypes: KeyValueType<number, string>[];
    nationalities: KeyValueType<number, string>[];
    statuses: KeyValueType<number, string>[];
};

export default function AddCitizen() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [lists, setLists] = useState<Lists>();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    // Test autofill toggle
    const TEST_FILL = false;
    const testData: CitizenToCreateType = {
        lastName: "Dupont",
        firstName: "Jean",
        birthDate: "1990-01-01",
        birthPlace: "Paris",
        phoneNumber: "0601020304",
        address: "12 rue de la Paix",
        city: "Lille",
        job: "Informaticien",
        eyeColor: "Bleu",
        hairColor: "Châtain",
        description: "Citoyen de test",
        isWanted: false,
        bloodTypeId: 2,
        genderId: 2,
        hasTattoo: true,
        originId: 15,
        statusId: 3,
        photoUrl: null,
        height: 189,
        weight: 92,
    } as const;

    useEffect(() => {
        async function init() {
            try {
                setLists(await getLists());
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Une erreur est survenue");
                }
            } finally {
                setIsLoaded(true);
            }
        }

        init();
    }, []);

    if (!isLoaded) return <Loader />;

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

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        let url = null;
        if (imageFile) {
            url = await uploadImage(imageFile);
        }

        const citizenToCreate: CitizenToCreateType = {
            firstName: form.get("firstname") as string,
            lastName: form.get("lastname") as string,
            birthDate: (form.get("birthDate") as string) ?? null,
            birthPlace: (form.get("birthPlace") as string) ?? null,
            genderId: toNullableNumber(form.get("genderId")),
            phoneNumber: (form.get("phoneNumber") as string) ?? null,
            job: (form.get("job") as string) ?? null,
            description: (form.get("description") as string) ?? null,
            isWanted: form.get("isWanted") === "on",
            statusId: toNullableNumber(form.get("statusId")),
            bloodTypeId: toNullableNumber(form.get("bloodTypeId")),
            address: (form.get("address") as string) ?? null,
            city: (form.get("city") as string) ?? null,
            eyeColor: (form.get("eyeColor") as string) ?? null,
            hairColor: (form.get("hairColor") as string) ?? null,
            hasTattoo: form.get("hasTattoo") === "on",
            originId: toNullableNumber(form.get("originId")),
            height: toNullableNumber(form.get("height")),
            weight: toNullableNumber(form.get("weight")),
            photoUrl: url,
        };

        try {
            const newCitizenId = await createAndGetCitizen(citizenToCreate);
            addToast("Citoyen créé avec succés", "success");
            router.push(`/police/citizens/${newCitizenId}`);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                return;
            }
            setErrorMessage("Une erreur est survenue");
            return;
        }
    }

    return (
        <>
            <Alert message={errorMessage} />
            <h1 className="text-4xl font-bold text-primary text-center mb-4">Ajouter un citoyen</h1>
            <AddImage image={image} onPaste={handlePaste} delete={() => setImage("")} />
            <form className="mt-4" onSubmit={handleSubmit}>
                <div>
                    <h2 className="text-xl text-primary">Identité</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <InputWithLabel
                            label="Nom"
                            name="lastname"
                            placeHolder="Nom"
                            type="text"
                            maxLenght={50}
                            minLenght={2}
                            defaultValue={TEST_FILL ? testData.lastName : undefined}
                        />
                        <InputWithLabel
                            label="Prénom"
                            name="firstname"
                            placeHolder="Prénom"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? testData.firstName : undefined}
                        />
                        <InputWithLabel
                            label="Date de naissance"
                            name="birthDate"
                            placeHolder="Date de naissance"
                            type="date"
                            defaultValue={TEST_FILL ? (testData.birthDate as string) : undefined}
                            required={false}
                        />
                        <InputWithLabel
                            label="Lieu de naissance"
                            name="birthPlace"
                            placeHolder="Lieu de naissance"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.birthPlace as string) : undefined}
                            required={false}
                        />
                        <Select
                            defaulValue={TEST_FILL ? String(testData.originId) : ""}
                            items={lists!.nationalities}
                            label="Nationalité"
                            name="originId"
                            emptyValue="Choisir..."
                        />
                        <Select
                            defaulValue={TEST_FILL ? String(testData.genderId) : ""}
                            items={lists!.genders}
                            label="Sexe"
                            name="genderId"
                            emptyValue="Choisir..."
                        />
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Caractéristiques physiques</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <InputWithLabel
                            label="Taille"
                            name="height"
                            placeHolder="Taille (cm)"
                            type="number"
                            max={300}
                            min={100}
                            defaultValue={TEST_FILL ? String(testData.height) : undefined}
                            required={false}
                        />
                        <InputWithLabel
                            label="Poids"
                            name="weight"
                            placeHolder="Poids (kg)"
                            type="number"
                            max={300}
                            min={30}
                            defaultValue={TEST_FILL ? String(testData.weight) : undefined}
                            required={false}
                        />
                        <InputWithLabel
                            label="Couleur des yeux"
                            name="eyeColor"
                            placeHolder="Couleur des yeux"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.eyeColor as string) : undefined}
                            required={false}
                        />
                        <InputWithLabel
                            label="Couleur des cheveux"
                            name="hairColor"
                            placeHolder="Couleur des cheveux"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.hairColor as string) : undefined}
                            required={false}
                        />
                        <Select
                            label="Groupe sanguin"
                            defaulValue={TEST_FILL ? String(testData.bloodTypeId) : ""}
                            items={lists!.bloodTypes}
                            name="bloodTypeId"
                            emptyValue="Choisir..."
                        />
                        <CheckBox
                            label="Tatouages"
                            name="hasTattoo"
                            checkBoxLabel="Oui"
                            defaultChecked={TEST_FILL ? testData.hasTattoo : false}
                        />
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Informations de contact</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <InputWithLabel
                            label="Téléphone"
                            name="phoneNumber"
                            placeHolder="Numéro de téléphone"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.phoneNumber as string) : undefined}
                            required={false}
                        />

                        <InputWithLabel
                            label="Adresse"
                            name="address"
                            placeHolder="Adresse"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.address as string) : undefined}
                            required={false}
                        />

                        <InputWithLabel
                            label="Ville"
                            name="city"
                            placeHolder="Ville"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.city as string) : undefined}
                            required={false}
                        />
                    </div>
                </div>

                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Autres</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <InputWithLabel
                            label="Métier"
                            name="job"
                            placeHolder="Métier"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                            defaultValue={TEST_FILL ? (testData.job as string) : undefined}
                            required={false}
                        />
                        <Select
                            defaulValue={
                                TEST_FILL && lists!.statuses[0]
                                    ? String(lists!.statuses[0].key)
                                    : ""
                            }
                            items={lists!.statuses}
                            label="Statut"
                            name="statusId"
                            emptyValue="Choisir..."
                        />
                        <CheckBox
                            className="col-span-2"
                            checkBoxLabel="Oui"
                            label="Est recherché"
                            name="isWanted"
                            defaultChecked={TEST_FILL ? testData.isWanted : undefined}
                        />
                        <Textarea
                            className="w-full col-span-2"
                            label="Informations complémentaires"
                            name="description"
                            placeHolder="Informations Complémentaires"
                            defaultValue={TEST_FILL ? (testData.description as string) : undefined}
                        />
                    </div>
                </div>

                <div className="flex justify-center join mt-4">
                    <button type="reset" className="btn btn-error join-item w-30">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success join-item w-30">
                        Valider
                    </button>
                </div>
            </form>
        </>
    );
}

async function getLists(): Promise<Lists> {
    const [genders, bloodTypes, nationalities, statuses] = await Promise.all([
        getData(axiosClient.get("/genders")),
        getData(axiosClient.get("/bloodTypes")),
        getData(axiosClient.get("/nationalities")),
        getData(axiosClient.get("/statuses")),
    ]);

    const responses = [genders, bloodTypes, nationalities, statuses];
    const error = responses.find((r) => r.errorMessage);
    if (error) throw new Error(error.errorMessage);

    return {
        genders: genders.data,
        bloodTypes: bloodTypes.data,
        nationalities: nationalities.data,
        statuses: statuses.data,
    } as Lists;
}

function toNullableNumber(v: FormDataEntryValue | null) {
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}

async function createAndGetCitizen(citizenToCreate: CitizenToCreateType): Promise<string> {
    const citizenCreated = await getData(axiosClient.post("/citizens", citizenToCreate));
    if (citizenCreated.errorMessage) {
        throw new Error(citizenCreated.errorMessage);
    }

    const { id } = citizenCreated.data;
    return id;
}
