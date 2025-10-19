import ButtonGroupForm from "@/components/ButtonGroup";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Rank from "@/types/class/Rank";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export type AddRankFormType = {
    name: string;
    rankToUpdate?: Rank;
};

const formSchema = z.object({
    name: z
        .string()
        .min(1, "Le nom est obligatoire")
        .max(50, "Le nom doit au maximum avoir 50 caractères"),
});

type Props = {
    onCancel: () => void;
    onSubmit: (values: AddRankFormType) => void;
    rankToUpdate?: Rank;
};

export default function AddOrUpdateRankFrom({ onCancel, onSubmit, rankToUpdate }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: rankToUpdate?.name ?? "",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitInternal)} className="w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="h-5">
                                {fieldState.error ? <FormMessage /> : <FormLabel>Nom</FormLabel>}
                            </div>
                            <FormControl>
                                <Input placeholder="Nom" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex items-center col-span-2">
                    <ButtonGroupForm
                        onCancel={() => {
                            form.clearErrors();
                            form.reset();
                            onCancel();
                        }}
                    />
                </div>
            </form>
        </Form>
    );
}
