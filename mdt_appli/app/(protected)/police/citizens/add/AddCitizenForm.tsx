"use client";

import ButtonGroupForm from "@/components/ButtonGroup";
import { InputForm } from "@/components/InputForm";
import { SelectForm } from "@/components/SelectForm";
import { Form } from "@/components/ui/form";
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
    birthDate: z.date().optional(),
    birthPlace: z.string().optional(),
    nationalityId: z.string().optional(),
    genderId: z.string().optional(),
    height: z.number().max(300).optional(),
    weight: z.number().max(300).optional(),
    eyeColor: z.string().optional(),
    hairColor: z.string().optional(),
});

export default function AddCitizenForm({
    nationalities,
    genders,
}: {
    nationalities: KeyValueType[];
    genders: KeyValueType[];
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                        isRequired={true}
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
