import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types/db/user";
import dayjs from "dayjs";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import z from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import ButtonGroupForm from "./ButtonGroup";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { is } from "drizzle-orm";
import { ItemForm } from "./ItemForm";

const formSchema = z.object({
    firstName: z.string().max(50, "Le prénom ne peut pas dépasser 50 caractères").optional(),
    lastName: z.string().max(50, "Le nom ne peut pas dépasser 50 caractères").optional(),
    number: z.number().min(0).optional(),
    phoneNumber: z.string().optional(),
    jobId: z.string().optional(),
    rankId: z.string().optional(),
    roleId: z.string().optional(),
});

export default function UserUpdate({
    userToUpdate,
    isAdmin,
    jobs = [],
    ranks = [],
    onJobChange,
}: {
    userToUpdate: UserType;
    isAdmin?: boolean;
    jobs: { label: string; value: string }[];
    ranks: { label: string; value: string }[];
    onJobChange: (jobId: string) => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: userToUpdate.firstName || "",
            lastName: userToUpdate.lastName || "",
            number: userToUpdate.number || undefined,
            phoneNumber: userToUpdate.phoneNumber || "",
            jobId: userToUpdate.rank?.job?.id ? String(userToUpdate.rank.job.id) : undefined,
            rankId: userToUpdate.rank?.id ? String(userToUpdate.rank.id) : "",
            roleId: userToUpdate.role.key ? String(userToUpdate.role.key) : "",
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        console.log("values", values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="flex w-full max-w-lg flex-col gap-6"
            >
                <Tabs defaultValue="hrp">
                    <TabsList>
                        <TabsTrigger value="hrp">Informations HRP</TabsTrigger>
                        <TabsTrigger value="rp">Informations RP</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hrp">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations HRP</CardTitle>
                                <CardDescription>
                                    Informations relatives à la gestion du compte utilisateur.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid">
                                <ItemForm title="Id Discord" description={userToUpdate.id} />
                                <ItemForm
                                    title="Nom Discord"
                                    description={userToUpdate.name ?? "Vide"}
                                />
                                <ItemForm
                                    title="Adresse e-mail"
                                    description={userToUpdate.email ?? "Vide"}
                                />
                                <ItemForm
                                    title="Rôle"
                                    description={userToUpdate.role.value ?? "Vide"}
                                />
                                <ItemForm
                                    title="Statut"
                                    description={userToUpdate.isDisable ? "Actif" : "Inactif"}
                                />
                                <ItemForm
                                    title="Date de création"
                                    description={dayjs(userToUpdate.createdAt).format(
                                        "DD/MM/YYYY HH:mm:ss"
                                    )}
                                />
                                <ItemForm
                                    title="Première connexion"
                                    description={dayjs(userToUpdate.firstLogin).format(
                                        "DD/MM/YYYY HH:mm:ss"
                                    )}
                                />
                                <ItemForm
                                    title="Dernière connexion"
                                    description={
                                        userToUpdate.lastLogin
                                            ? dayjs(userToUpdate.lastLogin).format(
                                                  "DD/MM/YYYY HH:mm:ss"
                                              )
                                            : "Jamais connecté"
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="rp">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations RP</CardTitle>
                                <CardDescription>
                                    Informations relatives au personnage RP de l&apos;utilisateur.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field, fieldState }) => (
                                        <FormItem >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Nom</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input placeholder="Nom" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field, fieldState }) => (
                                        <FormItem >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Prénom</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input placeholder="Prénom" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field, fieldState }) => (
                                        <FormItem >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Matricule</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Matricule"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field, fieldState }) => (
                                        <FormItem >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Numéro de téléphone</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Numéro de téléphone"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {!isAdmin ? (
                                    <ItemForm
                                        title="Métier"
                                        description={userToUpdate.rank?.job?.name ?? "Vide"}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="jobId"
                                        render={({ field, fieldState }) => (
                                            <FormItem
                                                data-invalid={fieldState.invalid}
                                                className="gap-0"
                                            >
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
                                                            {jobs.map((job) => (
                                                                <SelectItem
                                                                    key={job.value}
                                                                    value={job.value}
                                                                >
                                                                    {job.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {!isAdmin ? (
                                    <ItemForm
                                        title="Grade"
                                        description={userToUpdate.rank?.name ?? "Vide"}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="rankId"
                                        render={({ field, fieldState }) => (
                                            <FormItem
                                                data-invalid={fieldState.invalid}
                                                className="gap-0"
                                            >
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
                                                            !form.watch("jobId") ||
                                                            form.watch("jobId") === "none"
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
                                                            <SelectItem value="none">
                                                                Tous
                                                            </SelectItem>
                                                            <SelectSeparator />
                                                            {ranks.map((rank) => (
                                                                <SelectItem
                                                                    key={rank.value}
                                                                    value={rank.value}
                                                                >
                                                                    {rank.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <ButtonGroupForm
                        onCancel={function (): void {
                            form.reset({
                                firstName: userToUpdate.firstName || "",
                                lastName: userToUpdate.lastName || "",
                                number: userToUpdate.number || undefined,
                                phoneNumber: userToUpdate.phoneNumber || "",
                                jobId: userToUpdate.rank?.job?.id
                                    ? String(userToUpdate.rank.job.id)
                                    : "none",
                                rankId: userToUpdate.rank?.id
                                    ? String(userToUpdate.rank.id)
                                    : "none",
                                roleId: userToUpdate.role.key
                                    ? String(userToUpdate.role.key)
                                    : "none",
                            });
                            form.clearErrors();
                        }}
                    />
                </Tabs>
            </form>
        </Form>
    );
}
