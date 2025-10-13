"use client";

import React, { useEffect, useState } from "react";
import AddImage from "@/components/AddImage";
import axiosClient, { getData } from "@/lib/axiosClient";
import { KeyValueType } from "@/types/utils/keyValue";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import Input from "@/components/Input";
import Select from "@/components/Select";
import CheckBox from "@/components/CheckBox";
import Textarea from "@/components/Textarea";

type Lists = {
    genders: KeyValueType<number, string>[];
    bloodTypes: KeyValueType<number, string>[];
    nationalities: KeyValueType<number, string>[];
    statuses: KeyValueType<number, string>[];
};

export default function AddCitizen() {
    const [image, setImage] = useState<string | null>(null);
    const [lists, setLists] = useState<Lists>();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

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
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <>
            <h1 className="text-4xl font-bold text-primary text-center mb-4">Ajouter un citoyen</h1>
            <Alert message={errorMessage} />
            <AddImage image={image} onPaste={handlePaste} delete={() => setImage("")} />
            <form className="mt-4">
                <div>
                    <h2 className="text-xl text-primary">Identité</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <Input
                            label="Nom"
                            name="lastname"
                            placeHolder="Nom"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Input
                            label="Prénom"
                            name="firstname"
                            placeHolder="Prénom"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Input
                            label="Date de naissance"
                            name="birthDate"
                            placeHolder="Date de naissance"
                            type="date"
                        />
                        <Input
                            label="Lieu de naissance"
                            name="birthPlace"
                            placeHolder="Lieu de naissance"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Select
                            defaulValue=""
                            items={lists!.nationalities}
                            label="Nationalité"
                            name="nationality"
                            emptyValue="Choisir..."
                        />
                        <Select
                            defaulValue=""
                            items={lists!.genders}
                            label="Sexe"
                            name="sex"
                            emptyValue="Choisir..."
                        />
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Caractéristiques physiques</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <Input
                            label="Taille"
                            name="height"
                            placeHolder="Taille (cm)"
                            type="number"
                            max={300}
                            min={100}
                        />
                        <Input
                            label="Poids"
                            name="weight"
                            placeHolder="Poids (kg)"
                            type="number"
                            max={30}
                            min={300}
                        />
                        <Input
                            label="Couleur des yeux"
                            name="eyeColor"
                            placeHolder="Couleur des yeux"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Input
                            label="Couleur des cheveux"
                            name="hairColor"
                            placeHolder="Couleur des cheveux"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Input
                            label="Origine"
                            name="origin"
                            placeHolder="Origine"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Select
                            label="Groupe sanguin"
                            defaulValue=""
                            items={lists!.bloodTypes}
                            name="bloodType"
                            emptyValue="Choisir..."
                        />
                        <CheckBox label="Tatouages" name="tattoo" checkBoxLabel="Oui" />
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Informations de contact</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <Input
                            label="Téléphone"
                            name="phoneNumber"
                            placeHolder="Numéro de téléphone"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />

                        <Input
                            label="Adresse"
                            name="address"
                            placeHolder="Adresse"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />

                        <Input
                            label="Ville"
                            name="city"
                            placeHolder="Ville"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                    </div>
                </div>

                <div className="divider"></div>
                <div>
                    <h2 className="text-xl text-primary">Autres</h2>
                    <div className="grid grid-cols-2 gap-x-6">
                        <Input
                            label="Métier"
                            name="Job"
                            placeHolder="Métier"
                            type="text"
                            maxLenght={50}
                            minLenght={1}
                        />
                        <Select
                            defaulValue=""
                            items={lists!.statuses}
                            label="Statut"
                            name="status"
                            emptyValue="Choisir..."
                        />
                        <CheckBox
                            className="col-span-2"
                            checkBoxLabel="Oui"
                            label="Est recherché"
                            name="isWanted"
                        />
                        <Textarea
                            className="w-full col-span-2"
                            label="Informations complémentaires"
                            name="description"
                            placeHolder="Informations Complémentaires"
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
