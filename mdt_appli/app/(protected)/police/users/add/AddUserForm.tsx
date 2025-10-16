"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UserToCreateType } from "@/types/db/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    discordId: z
        .string()
        .min(2, "L'id discord doit au moin contenir 1 caractère")
        .max(50, "L'id discord doit au maximum avoir 50 caractères"),
    jobId: z.string().min(1, "Vous devez choisir un métier"),
    rankId: z.string().min(1, "Vous devez choisir un grade"),
});

export function AddUserForm({
    jobs,
    onJobChange,
    ranks,
    onSubmit,
}: {
    jobs: { label: string; value: string }[];
    onJobChange: (value: string) => void;
    ranks: { label: string; value: string }[];
    onSubmit: (values: UserToCreateType) => Promise<boolean>;
}) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            discordId: "",
            jobId: "",
            rankId: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        const isSuccess = await onSubmit({
            id: values.discordId,
            jobId: Number(values.jobId),
            rankId: Number(values.rankId),
        });

        if (isSuccess) form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="space-y-8 grid grid-cols-2 gap-x-4"
            >
                <FormField
                    control={form.control}
                    name="discordId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Id Discord</FormLabel>
                            <FormControl>
                                <Input placeholder="Id Discord" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div></div>
                <FormField
                    control={form.control}
                    name="jobId"
                    render={({ field, fieldState }) => (
                        <FormItem data-invalid={fieldState.invalid}>
                            <FormLabel>Métier</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        onJobChange(value);
                                    }}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        className={`${cn(
                                            "min-w-[120px]",
                                            fieldState.invalid &&
                                                "border-destructive focus:ring-destructive"
                                        )} w-full`}
                                    >
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobs.map((job) => (
                                            <SelectItem key={job.value} value={job.value}>
                                                {job.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rankId"
                    render={({ field, fieldState }) => (
                        <FormItem data-invalid={fieldState.invalid}>
                            <FormLabel>Grade</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                    }}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        className={`${cn(
                                            "min-w-[120px]",
                                            fieldState.invalid &&
                                                "border-destructive focus:ring-destructive"
                                        )} w-full`}
                                    >
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ranks.map((rank) => (
                                            <SelectItem key={rank.value} value={rank.value}>
                                                {rank.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-center col-span-2">
                    <Button type="reset" className="w-30" variant={"cancel"} groupPosisiton="left">
                        Annuler
                    </Button>
                    <Button type="submit" className="w-30" variant={"ok"} groupPosisiton="right">
                        Valider
                    </Button>
                </div>
            </form>
        </Form>
    );
}
