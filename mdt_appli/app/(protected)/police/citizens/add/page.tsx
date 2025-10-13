"use client";

import React, { useState } from "react";
import AddImage from "@/components/AddImage";

const inputs = [
    { title: "Nom", type: "text", minLength: 2, maxLength: 50, placeHolder: "Nom" },
    { title: "Prénom", type: "text", minLength: 2, maxLength: 50, placeHolder: "Prénom" },
    { title: "Date de naissance", type: "date", placeHolder: "Date de naissance" },
    {
        title: "Lieu de naissance",
        type: "text",
        minLength: 2,
        maxLength: 100,
        placeHolder: "Lieu de naissance",
    },
    { title: "Nationalité", type: "text", minLength: 2, maxLength: 50, placeHolder: "Nationalité" },
    { title: "Adresse", type: "text", minLength: 2, maxLength: 150, placeHolder: "Adresse" },
    { title: "Taille (cm)", type: "number", placeHolder: "Taille (cm)" },
    { title: "Poids (kg)", type: "number", placeHolder: "Poids (kg)" },
    {
        title: "Couleur des yeux",
        type: "text",
        minLength: 2,
        maxLength: 30,
        placeHolder: "Couleur des yeux",
    },
    {
        title: "Couleur des cheveux",
        type: "text",
        minLength: 2,
        maxLength: 30,
        placeHolder: "Couleur des cheveux",
    },
    { title: "Profession", type: "text", minLength: 2, maxLength: 50, placeHolder: "Profession" },
    { title: "Téléphone", type: "text", minLength: 6, maxLength: 20, placeHolder: "Téléphone" },
    { title: "Sexe", type: "select", placeHolder: "Sexe", options: ["Homme", "Femme", "Autre"] },
    {
        title: "Groupe sanguin",
        type: "text",
        minLength: 1,
        maxLength: 3,
        placeHolder: "Groupe sanguin",
    },
];

export default function AddCitizen() {
    const [image, setImage] = useState<string | null>(null);

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
            <AddImage image={image} onPaste={handlePaste} delete={() => setImage("")} />
            <form className="grid grid-cols-2 gap-2">
                {inputs.map((x, index) => (
                    <fieldset key={index} className="fieldset">
                        <legend className="fieldset-legend">{x.title}</legend>
                        {x.type === "select" ? (
                            <select className="input input-primary w-full">
                                <option value="">{x.placeHolder}</option>
                                {x.options
                                    ? x.options.map((opt: string, idx: number) => (
                                          <option key={idx} value={opt}>
                                              {opt}
                                          </option>
                                      ))
                                    : null}
                            </select>
                        ) : x.type === "checkbox" ? (
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                placeholder={x.placeHolder}
                            />
                        ) : x.type === "textarea" ? (
                            <textarea
                                className="input input-primary w-full"
                                placeholder={x.placeHolder}
                                minLength={x.minLength}
                                maxLength={x.maxLength}
                            />
                        ) : (
                            <input
                                type={x.type}
                                className="input w-full"
                                placeholder={x.placeHolder}
                                minLength={x.minLength}
                                maxLength={x.maxLength}
                            />
                        )}
                    </fieldset>
                ))}
            </form>
        </>
    );
}
