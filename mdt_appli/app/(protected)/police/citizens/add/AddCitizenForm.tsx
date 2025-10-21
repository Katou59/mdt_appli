"use client";

import ButtonGroupForm from "@/components/ButtonGroup";
import { InputForm } from "@/components/InputForm";
import { RadioGroupForm } from "@/components/RadioGroupForm";
import { SelectForm } from "@/components/SelectForm";
import { TextareaForm } from "@/components/TextareaForm";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CitizenToCreateType } from "@/types/db/citizen";
import { KeyValueType } from "@/types/utils/keyValue";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z, { optional } from "zod";

const formSchema = z.object({
    lastName: z
        .string()
        .min(1, "Le champ de recherche doit être renseigné")
        .max(50, "Le champ de recherche doit au maximum avoir 50 caractères"),
    firstName: z
        .string()
        .min(1, "Le champ de recherche doit être renseigné")
        .max(50, "Le champ de recherche doit au maximum avoir 50 caractères"),
    birthDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), "La date de naissance n'est pas valide"),
    birthPlace: z
        .string()
        .max(100, "La ville de naissance ne doit pas dépasser 50 caractères")
        .optional(),
    nationalityId: z.string().optional(),
    genderId: z.string().optional(),
    height: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) <= 300),
            "La taille doit être inférieur ou égal à 300"
        ),
    weight: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) <= 300),
            "Le poids doit être inférieur ou égal à 300"
        ),
    eyeColor: z
        .string()
        .max(50, "La couleur des yeux ne doit pas dépasser 50 caractères")
        .optional(),
    hairColor: z
        .string()
        .max(50, "La couleur des cheveux ne doit pas dépasser 50 caractères")
        .optional(),
    bloodTypeId: z.string().optional(),
    statusId: z.string().optional(),
    hasTattoo: z.string(),
    phoneNumber: z.string().max(50, "Le téléphone ne doit pas dépasser 50 caractères").optional(),
    city: z.string().max(100, "La ville ne doit pas dépasser 100 caractères").optional(),
    address: z.string().max(250, "L'adresse ne doit pas dépasser 250 caractères").optional(),
    job: z.string().max(50, "Le métier ne doit pas dépasser 50 caractères").optional(),
    isWanted: z.string(),
    description: z.string().optional(),
});

const yesNoList = [
    {
        key: "false",
        value: "Non",
    },
    {
        key: "true",
        value: "Oui",
    },
];

export default function AddCitizenForm({
    nationalities,
    genders,
    bloodTypes,
    statuses,
    onSubmit,
}: {
    nationalities: KeyValueType[];
    genders: KeyValueType[];
    bloodTypes: KeyValueType[];
    statuses: KeyValueType[];
    onSubmit: (values: CitizenToCreateType) => Promise<boolean>;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            birthPlace: "",
            bloodTypeId: "",
            eyeColor: "",
            genderId: "",
            hairColor: "",
            height: "",
            nationalityId: "",
            weight: "",
            birthDate: "",
            hasTattoo: "false",
            address: "",
            city: "",
            phoneNumber: "",
            isWanted: "false",
            job: "",
            description: "",
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        const convert = (val: string | undefined) => (val && val.trim() !== "" ? val : null);
        const result = await onSubmit({
            lastName: values.lastName,
            firstName: values.firstName,
            birthDate: convert(values.birthDate),
            birthPlace: convert(values.birthPlace),
            nationalityId: values.nationalityId ? Number(values.nationalityId) : null,
            genderId: values.genderId ? Number(values.genderId) : null,
            height: values.height ? Number(values.height) : null,
            weight: values.weight ? Number(values.weight) : null,
            eyeColor: convert(values.eyeColor),
            hairColor: convert(values.hairColor),
            bloodTypeId: values.bloodTypeId ? Number(values.bloodTypeId) : null,
            statusId: values.statusId ? Number(values.statusId) : null,
            hasTattoo: values.hasTattoo === "true",
            phoneNumber: convert(values.phoneNumber),
            city: convert(values.city),
            address: convert(values.address),
            job: convert(values.job),
            isWanted: values.isWanted === "true",
            description: convert(values.description),
            originId: null,
            photoUrl: null,
        });

        if (result) {
            form.reset();
            form.clearErrors();
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="flex flex-col items-center w-full gap-5"
            >
                <h2 className="text-xl text-primary w-full">Identité</h2>
                <div className="grid grid-cols-2 w-full gap-5">
                    <InputForm form={form} label="Nom" name="lastName" placeHolder="Nom" />
                    <InputForm form={form} label="Prénom" name="firstName" placeHolder="Prénom" />
                    <InputForm
                        form={form}
                        label="Date de naissance"
                        type="date"
                        name="birthDate"
                        placeHolder="Date de naissance"
                    />
                    <InputForm
                        form={form}
                        label="Lieu de naissance"
                        name="birthPlace"
                        placeHolder="Lieu de naissance"
                    />
                    <SelectForm
                        form={form}
                        name="nationalityId"
                        label="Nationalité"
                        items={nationalities}
                    />
                    <SelectForm form={form} name="genderId" label="Sexe" items={genders} />
                </div>
                <h2 className="text-xl text-primary w-full">Caractéristiques physiques</h2>
                <div className="grid grid-cols-2 w-full gap-5">
                    <InputForm form={form} label="Taille" name="height" placeHolder="Taille (cm)" />
                    <InputForm form={form} label="Poids" name="weight" placeHolder="Poids (kg)" />
                    <InputForm
                        form={form}
                        label="Couleur des yeux"
                        name="eyeColor"
                        placeHolder="Couleur des yeux"
                    />
                    <InputForm
                        form={form}
                        label="Couleur des cheveux"
                        name="hairColor"
                        placeHolder="Couleur des cheveux"
                    />
                    <SelectForm
                        form={form}
                        label="Groupe sanguin"
                        name="bloodTypeId"
                        items={bloodTypes}
                    />
                    <RadioGroupForm
                        form={form}
                        items={yesNoList}
                        label="Présence de tatouages"
                        name="hasTattoo"
                    />
                </div>
                <h2 className="text-xl text-primary w-full">Informations de contact</h2>
                <div className="grid grid-cols-2 w-full gap-5">
                    <InputForm form={form} label="Adresse" placeHolder="Adresse" name="address" />
                    <InputForm form={form} label="Ville" placeHolder="Ville" name="city" />
                    <InputForm
                        form={form}
                        label="Numéro de téléphone"
                        placeHolder="Numéro de téléphone"
                        name="phoneNumber"
                        type="tel"
                    />
                </div>
                <h2 className="text-xl text-primary w-full">Autres</h2>
                <div className="grid grid-cols-2 w-full gap-5">
                    <InputForm form={form} label="Métier" placeHolder="Métier" name="job" />
                    <RadioGroupForm
                        form={form}
                        name="isWanted"
                        items={yesNoList}
                        label="Est recherché"
                    />
                    <div className="col-span-2 grid grid-cols-2 gap-5">
                        <SelectForm form={form} items={statuses} label="Statut" name="statusId" />
                    </div>
                    <div className="col-span-2">
                        <TextareaForm
                            form={form}
                            label="Informations complémentaires"
                            placeHolder="Informations complémentaires"
                            name="description"
                        />
                    </div>
                </div>
                <div>
                    <ButtonGroupForm
                        onCancel={() => {
                            form.reset();
                            form.clearErrors();
                        }}
                    />
                </div>
            </form>
        </Form>
    );
}
