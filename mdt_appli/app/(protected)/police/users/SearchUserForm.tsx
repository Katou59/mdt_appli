"use client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type SearchUserFormOnSubmitType = {
    searchField?: string;
    jobId?: string;
    rankId?: string;
    roleId?: string;
    isDisable?: boolean;
};

const formSchema = z.object({
    searchField: z.string().max(50, "Le champs de recherche doit au maximum avoir 50 caractères"),
    jobId: z.string().optional(),
    rankId: z.string().optional(),
    roleId: z.string().optional(),
    isDisabled: z.string().optional(),
});

const isDesactivatedItems = [
    { label: "Oui", value: "true" },
    { label: "Non", value: "false" },
];

export default function SearchUserForm({
    jobs,
    onJobChange,
    ranks,
    roles,
    onSubmit,
    onCancel,
}: {
    jobs: { label: string; value: string }[];
    ranks: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    onJobChange: (value: string) => void;
    onSubmit: (values: SearchUserFormOnSubmitType) => Promise<void>;
    onCancel: () => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchField: "",
            jobId: "none",
            rankId: "none",
            roleId: "none",
            isDisabled: "none",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        if (onSubmit) {
            await onSubmit({
                searchField: values.searchField,
                jobId: values.jobId,
                rankId: values.rankId,
                roleId: values.roleId,
                isDisable: values.isDisabled === "none" ? undefined : values.isDisabled === "true",
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="flex flex-col gap-5 items-center"
            >
                <FormField
                    control={form.control}
                    name="searchField"
                    render={({ field, fieldState }) => (
                        <FormItem className="w-64">
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
                <div className="grid grid-cols-4 gap-5 w-full">
                    <FormField
                        control={form.control}
                        name="jobId"
                        render={({ field, fieldState }) => (
                            <FormItem data-invalid={fieldState.invalid}>
                                <div className="h-5">
                                    {fieldState.error ? (
                                        <FormMessage />
                                    ) : (
                                        <FormLabel>Métier</FormLabel>
                                    )}
                                </div>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            form.setValue("rankId", "");
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
                                            <SelectItem value="none">Tous</SelectItem>
                                            <SelectSeparator />
                                            {jobs.map((job) => (
                                                <SelectItem key={job.value} value={job.value}>
                                                    {job.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rankId"
                        render={({ field, fieldState }) => (
                            <FormItem data-invalid={fieldState.invalid}>
                                <div className="h-5">
                                    {fieldState.error ? (
                                        <FormMessage />
                                    ) : (
                                        <FormLabel>Grade</FormLabel>
                                    )}
                                </div>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        disabled={
                                            !form.watch("jobId") || form.watch("jobId") === "none"
                                        }
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
                                            <SelectItem value="none">Tous</SelectItem>
                                            <SelectSeparator />
                                            {ranks.map((rank) => (
                                                <SelectItem key={rank.value} value={rank.value}>
                                                    {rank.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field, fieldState }) => (
                            <FormItem data-invalid={fieldState.invalid}>
                                <div className="h-5">
                                    {fieldState.error ? (
                                        <FormMessage />
                                    ) : (
                                        <FormLabel>Rôle</FormLabel>
                                    )}
                                </div>
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
                                            <SelectItem value="none">Tous</SelectItem>
                                            <SelectSeparator />
                                            {roles?.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isDisabled"
                        render={({ field, fieldState }) => (
                            <FormItem data-invalid={fieldState.invalid}>
                                <div className="h-5">
                                    {fieldState.error ? (
                                        <FormMessage />
                                    ) : (
                                        <FormLabel>Est désactivé</FormLabel>
                                    )}
                                </div>
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
                                            <SelectItem value="none">Tous</SelectItem>
                                            <SelectSeparator />
                                            {isDesactivatedItems?.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
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
