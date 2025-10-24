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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export type SearchAgentFormOnSubmitType = {
    searchField?: string;
};

const formSchema = z.object({
    searchField: z
        .string()
        .min(1, "Le champ de recherche doit être renseigné")
        .max(50, "Le champ de recherche doit au maximum avoir 50 caractères"),
});

export default function SearchAgentForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (values: SearchAgentFormOnSubmitType) => void;
    onCancel: () => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchField: "",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="flex flex-col items-center"
            >
                <FormField
                    control={form.control}
                    name="searchField"
                    render={({ field, fieldState }) => (
                        <FormItem className="w-80">
                            <div className="h-5">
                                {fieldState.error ? (
                                    <FormMessage />
                                ) : (
                                    <FormLabel>Recherche</FormLabel>
                                )}
                            </div>
                            <FormControl>
                                <Input placeholder="Recherche" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div>
                    <ButtonGroupForm
                        onCancel={() => {
                            form.reset();
                            form.clearErrors();
                            onCancel();
                        }}
                    />
                </div>
            </form>
        </Form>
    );
}
